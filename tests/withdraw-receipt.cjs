const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert');
const source = fs.readFileSync(path.join(__dirname, '../common/utils/withdrawReceipt.js'), 'utf8').replace(/export /g, '');
const box = {}; vm.createContext(box); vm.runInContext(source, box);
for (const value of [null, {}, true, {paid: true, status: '6'}, {paid: false, status: '3'}, {paid: 'true', status: '3'}]) {
  assert.strictEqual(box.isWithdrawalPaid(value), false);
  assert.ok(!box.withdrawalMessage(value).includes('成功'));
}
assert.strictEqual(box.isWithdrawalPaid({paid: true, status: '3'}), true);
const ready = {status: '6', providerState: 'WAIT_USER_CONFIRM', packageInfo: 'package', appId: 'app', mchId: 'merchant'};
assert.strictEqual(box.canConfirmWithdrawal(ready), true);
assert.strictEqual(box.canConfirmWithdrawal({...ready, providerState: 'PROCESSING'}), false);
assert.strictEqual(box.canConfirmWithdrawal({...ready, packageInfo: ''}), false);
assert.ok(box.withdrawalMessage({status: '4'}).includes('退回'));
console.log('PASS: confirmed success, pending/timeout/error, failed transfer and receipt authorization contract');
