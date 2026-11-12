const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'pages/index/keFU.vue'), 'utf8')
  .match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/^\s*import\s+.*?from\s+['"][^'"]+['"]\s*$/gm, '')
  .replace('export default', 'component =');

async function main() {
  const calls = [], messages = [], commits = [];
  let apiCalls = 0, fail = true;
  const box = {
    config: { giftServiceEnabled: false }, component: null,
    uni: { makePhoneCall: value => calls.push(value), showToast: value => messages.push(value) },
    getConfig: async () => {
      apiCalls++;
      if (fail) throw new Error('simulated offline');
      return { code: 200, data: { system: { phone: 'test-number' } } };
    }
  };
  vm.runInNewContext(source, box);
  const component = box.component;
  for (const global of [{}, null, { system: null }, { system: {} }]) {
    assert.strictEqual(component.computed.phone.call({ $store: { state: { settings: { global } } } }), '');
  }
  assert.strictEqual(component.computed.phone.call({ $store: { state: { settings: { global: { system: { phone: '  test-number  ' } } } } } }), 'test-number');
  component.methods.telPhone('');
  assert.strictEqual(calls.length, 0);
  assert.strictEqual(messages.length, 1);
  component.methods.telPhone('test-number');
  assert.strictEqual(calls[0].phoneNumber, 'test-number');

  const ctx = { loading: false, loadFailed: false, $store: { commit: (...args) => commits.push(args) } };
  await component.methods.loadServiceConfig.call(ctx);
  assert.strictEqual(ctx.loadFailed, true);
  assert.strictEqual(ctx.loading, false);
  assert.strictEqual(commits.length, 0);
  fail = false;
  await component.methods.loadServiceConfig.call(ctx);
  assert.strictEqual(ctx.loadFailed, false);
  assert.strictEqual(commits[0][0], 'settings/SET_GLOBAL');
  assert.strictEqual(commits[0][1].system.phone, 'test-number');
  ctx.loading = true;
  await component.methods.loadServiceConfig.call(ctx);
  assert.strictEqual(apiCalls, 2);

  const settings = fs.readFileSync(path.join(root, 'store/modules/settings.js'), 'utf8')
    .replace(/^\s*import\s+.*?from\s+['"][^'"]+['"]\s*$/gm, '')
    .replace('export default', 'settings =');
  const stateBox = { config: {}, settings: null };
  vm.runInNewContext(settings, stateBox);
  for (const data of [undefined, null, {}, { system: null }, { system: { phone: 'test-number' } }]) {
    stateBox.settings.mutations.SET_GLOBAL(stateBox.settings.state, data);
    assert.ok(stateBox.settings.state.global.system);
    assert.ok(stateBox.settings.state.global.withdraw);
    assert.ok(stateBox.settings.state.global.voice);
  }
  console.log('PASS: empty/partial configuration, phone action guard, offline recovery, duplicate request guard and state normalization. No external calls.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
