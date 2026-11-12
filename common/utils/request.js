import store from "@/store";
import config from '@/config.js'
const { baseURL } = config
import Request from '@/js_sdk/luch-request/luch-request/index.js'
const http = new Request()
http.setConfig((config) => {
	/* 设置全局配置 */
	config.baseURL = baseURL /* 根域名不同 */
	return config
})

http.interceptors.request.use(config => {

	const getters = store.getters
	//请求公共参数放在 请求头（header）
	const header = {
		...config.header,
		...getters['requestHeader'],
	}
	if (!getters.token) {
		delete header.token
		delete header.Authorization
		delete header.authorization
	}
	config.header = header
	return config
})
let toastTimer = null
let authHandling = null

function showErrorToast(message) {
	if (toastTimer) return
	uni.showToast({
		title: message || '请求错误',
		icon: 'none'
	})
	toastTimer = setTimeout(() => {
		toastTimer = null
	}, 500)
}

function isUnauthorized(response) {
	const statusCode = Number(response && response.statusCode)
	const code = Number(response && response.data && response.data.code)
	return statusCode === 401 || code === 401
}

function handleUnauthorized() {
	if (authHandling) return authHandling

	authHandling = new Promise(resolve => {
		uni.showModal({
			title: '温馨提示',
			content: '登录已失效，请重新登录',
			showCancel: false,
			confirmText: '重新登录',
			success: async modalResult => {
				if (!modalResult.confirm) {
					authHandling = null
					resolve()
					return
				}
				await store.dispatch('user/logOut')
				uni.reLaunch({
					url: '/pages/login/index',
					complete: () => {
						authHandling = null
						resolve()
					}
				})
			},
			fail: () => {
				authHandling = null
				resolve()
			}
		})
	})

	return authHandling
}

http.interceptors.response.use((response) => {
	if (isUnauthorized(response)) {
		handleUnauthorized()
		return Promise.reject(response)
	}
	if (Number(response.data.code) !== 200) {
		showErrorToast(response.data.msg)
		return Promise.reject(response)
	}
	return response.data
}, (response) => {
	if (isUnauthorized(response)) {
		handleUnauthorized()
	} else {
		const serverMessage = response && response.data && response.data.msg
		const fallback = response && response.statusCode
			? '服务器请求失败，请稍后重试'
			: '无法连接服务器，请稍后重试'
		showErrorToast(serverMessage || fallback)
	}
	return Promise.reject(response)
})

export default http;
