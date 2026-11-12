// Isolated contract checks; no WeChat API, SMS, database or application startup.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const root = path.resolve(__dirname, '..');

function wechatScript(source) {
  const enabled = [true];
  return source.split('\n').filter(line => {
    const start = line.match(/\/\/\s*#ifdef\s+(\S+)/);
    if (start) { enabled.push(enabled[enabled.length - 1] && start[1] === 'MP-WEIXIN'); return false; }
    if (/\/\/\s*#endif/.test(line)) { enabled.pop(); return false; }
    return enabled[enabled.length - 1];
  }).join('\n');
}

function setup(loginFails = false) {
  const calls = [], messages = [];
  let refreshes = 0;
  const script = fs.readFileSync(path.join(root, 'pages/login/index.vue'), 'utf8')
    .match(/<script>([\s\S]*?)<\/script>/)[1];
  const source = wechatScript(script)
    .replace(/^\s*import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?\s*$/gm, '')
    .replace('export default', 'component =');
  const sandbox = {
    component: null,
    uni: { showLoading() {}, hideLoading() {}, getStorageSync() { return ''; } },
    authRegister: async data => { calls.push(data); return { token: 'test', member: {} }; },
    console,
  };
  vm.runInNewContext(source, sandbox);
  const context = {
    showMode: true, session: 'previous-login-code',
    $u: { toast: message => messages.push(message) },
    xunHelper: { getWxLoginCode: async () => {
      refreshes++;
      if (loginFails) throw new Error('simulated failure');
      return 'fresh-login-code';
    } },
    showTips() { messages.push('privacy'); }, finishLogin() {}, getSession() {},
  };
  return { calls, messages, context, refreshes: () => refreshes,
    run: detail => sandbox.component.methods.getphonenumber.call(context, { detail }) };
}

async function main() {
  const modern = setup();
  await modern.run({ errMsg: 'getPhoneNumber:ok', code: 'phone-authorization-code' });
  assert.strictEqual(modern.calls.length, 1);
  assert.strictEqual(modern.calls[0].code, 'phone-authorization-code');
  assert.strictEqual(modern.calls[0].weminiJsCode, 'fresh-login-code');
  assert.strictEqual(modern.calls[0].scene, 'wemini_mobile_register');

  const denied = setup();
  await denied.run({ errMsg: 'getPhoneNumber:fail user deny' });
  assert.strictEqual(denied.calls.length, 0);
  assert.strictEqual(denied.refreshes(), 0);

  const empty = setup();
  await empty.run({ errMsg: 'getPhoneNumber:ok' });
  assert.strictEqual(empty.calls.length, 0);

  const privacy = setup(); privacy.context.showMode = false;
  await privacy.run({ code: 'phone-authorization-code' });
  assert.strictEqual(privacy.calls.length, 0);

  const failed = setup(true);
  await failed.run({ errMsg: 'getPhoneNumber:ok', code: 'phone-authorization-code' });
  assert.strictEqual(failed.calls.length, 0);
  assert.strictEqual(failed.messages.length, 1);

  const legacy = setup();
  await legacy.run({ errMsg: 'getPhoneNumber:ok', iv: 'iv', encryptedData: 'ciphertext' });
  assert.strictEqual(legacy.calls.length, 1);
  assert.strictEqual(legacy.calls[0].weminiJsCode, 'previous-login-code');
  assert.strictEqual(legacy.refreshes(), 0);

  const config = fs.readFileSync(path.join(root, 'config.js'), 'utf8').replace('export default', 'config =');
  for (const [mode, expected] of [['development', 'http://127.0.0.1:8121/'], ['production', 'https://yitaohuanbao.com/']]) {
    const box = { process: { env: { NODE_ENV: mode } }, config: null };
    vm.runInNewContext(config, box);
    assert.strictEqual(box.config.baseURL, expected);
  }
  console.log('PASS: 6 phone authorization cases and 2 environment URL cases. No external requests.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
