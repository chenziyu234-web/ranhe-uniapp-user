// 只记录平台错误信息，不能记录手机号 code、encryptedData 或用户号码。
export function phoneAuthorizationFailure(detail = {}) {
	const message = String(detail.errMsg || '')
	const errno = detail.errno == null ? '' : String(detail.errno)
	if (errno === '112' || /privacy|scope is not declared/i.test(message)) {
		return '微信隐私指引未声明手机号用途，请管理员在公众平台更新并发布隐私指引。'
	}
	if (/no permission|permission denied|not authorized|无权限/i.test(message)) {
		return '当前小程序没有手机号接口权限，请管理员检查公众平台的手机号能力。'
	}
	if (/deny|denied|cancel/i.test(message)) {
		return '你取消了手机号授权，可重新授权或使用短信登录。'
	}
	if (/getPhoneNumber:ok/i.test(message)) {
		return '微信未返回手机号凭证，请用手机真机重试，或使用短信登录。'
	}
	return '微信未完成手机号授权。请使用手机真机重试，管理员可从开发者工具 Console 查看具体错误。'
}
