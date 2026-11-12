export function isWithdrawalPaid(data) {
  return !!data && data.paid === true && String(data.status) === '3'
}
export function canConfirmWithdrawal(data) {
  return !!data && String(data.status) === '6' && data.providerState === 'WAIT_USER_CONFIRM' &&
    typeof data.packageInfo === 'string' && data.packageInfo.length > 0 && !!data.appId && !!data.mchId
}
export function withdrawalMessage(data) {
  if (isWithdrawalPaid(data)) return '微信转账成功，请核对到账'
  if (data && String(data.status) === '4') return '微信转账失败，余额已退回'
  if (data && String(data.status) === '5') return '提现申请已拒绝'
  return '转账结果尚未确认，请稍后刷新记录'
}
