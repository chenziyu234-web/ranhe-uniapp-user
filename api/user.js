import http from '@/common/utils/request.js'

//获取用户信息
export function getInfo() {
	return http.request({
		url: '/api/user/member/info',
		method: 'GET',
	})
}
// 我的页面数据
export function homeData() {
	return http.request({
		url: '/api/user/member/home-data',
		method: 'GET',
	})
}
// 账户细(资金记录) 
export function billsList(data) {
	return http.request({
		url: '/api/user/member/bills/bills-list',
		method: 'POST',
		data
	})
}
// 账户明细(提现记录)
export function withdrawList(data) {
	return http.request({
		url: '/api/user/member/bills/withdraw-list',
		method: 'POST',
		data
	})
}
// 提现确认收款
export function withdrawConfirmReceipt(data) {
	return http.request({
		url: '/api/user/member/bills/confirm-receipt',
		method: 'POST',
		data
	})
}
// 提现确认收款结果
export function withdrawReceiptResult(data) {
	return http.request({
		url: '/api/user/member/bills/receipt-result',
		method: 'GET',
		data
	})
}

// 提现操作
export function withdraw(data) {
	return http.request({
		url: '/api/user/member/bills/withdraw',
		method: 'POST',
		data
	})
}
//登录
export function authLogin(data) {
	return http.request({
		url: 'api/user/auth/login',
		method: 'POST',
		data
	})
}
// 统一注册
export function authRegister(data) {
	// console.log(data,'logindata1111111111')
	return http.request({
		url: '/api/user/auth/register',
		method: 'POST',
		data
	})
}
// 更新会员信息
export function userEdit(data) {
	return http.request({
		url: '/api/user/member/edit',
		method: 'POST',
		data
	})
}
// 获取总的未读数量
export function noReadCount(data) {
	return http.request({
		url: '/api/user/member/message/noReadCount',
		method: 'GET',
		data
	})
}
// 企业认证
export function memberApplyCreate(data) {
	return http.request({
		url: '/api/user/member-apply/create',
		method: 'POST',
		data
	})
}
// 企业认证的详情
export function memberApplyGet(data) {
	return http.request({
		url: '/api/user/member-apply/get',
		method: 'POST',
		data
	})
}

// 推广图
export function memberPosterCreate(data) {
	return http.request({
		url: '/api/user/member-poster/create',
		method: 'POST',
		data
	})
}

// 碳积分分记录
export function memberIntegralList(data) {
	return http.request({
		url: '/api/user/member/integral/list',
		method: 'POST',
		data
	})
}

// 下级的人
export function memberPromoter(data) {
	return http.request({
		url: '/api/user/member-poster/promoter',
		method: 'POST',
		data
	})
}