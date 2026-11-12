import http from '@/common/utils/request.js'

export const uploadApiPath = 'api/common/public/upload'

//获取基本配置信息
export function getConfig(data) {
	return http.request({
		url: '/api/common/config',
		method: 'GET',
		data
	})
}
// 字典
export function dictdata(data) {
	return http.request({
		url: '/xunapi/dictdata',
		method: 'POST',
		data
	})
}
//发送短信验证码
export function sendCode(data) {
	return http.request({
		url: '/api/common/send-code',
		method: 'POST',
		data
	})
}

//轮播图
export function bannerList(data) {
	return http.request({
		url: '/api/banner/list',
		method: 'POST',
		data
	})
}
//获取单页
export function contentPage(data) {
	return http.request({
		url: '/contentpage/get',
		method: 'POST',
		data
	})
}


// 位置获取
export function commonLocation(data) {
	return http.request({
		url: '/api/common/location',
		method: 'GET',
		data
	})
}

//通用上传请求
export function publicUpload(data) {
	return http.upload(uploadApiPath, data)
}