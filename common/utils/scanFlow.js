import store from '@/store'
import { sendCommand } from '@/api/index.js'

export const PENDING_SCAN_VALUE_KEY = 'pendingScanValue'
const PENDING_CAMERA_SCAN_KEY = 'pendingCameraScan'

let scanRequesting = false
let cameraOpening = false

function isLoggedIn() {
	return Boolean(store.getters.loginStatus)
}

function currentRoute() {
	const pages = getCurrentPages()
	return pages.length ? pages[pages.length - 1].route : ''
}

function goToLogin() {
	if (currentRoute().indexOf('pages/login/index') !== -1) return
	uni.navigateTo({
		url: '/pages/login/index'
	})
}

function isUnauthorized(error) {
	const statusCode = Number(error && error.statusCode)
	const code = Number(error && error.data && error.data.code)
	return statusCode === 401 || code === 401
}

export function savePendingScanValue(scanValue) {
	if (typeof scanValue !== 'string' || !scanValue.trim()) return
	uni.setStorageSync(PENDING_SCAN_VALUE_KEY, scanValue)
}

export function hasPendingScanTask() {
	return Boolean(
		uni.getStorageSync(PENDING_SCAN_VALUE_KEY) ||
			uni.getStorageSync(PENDING_CAMERA_SCAN_KEY)
	)
}

export function startScanFlow(scanValue, options = {}) {
	const rawScanValue = typeof scanValue === 'string' ? scanValue.trim() : ''
	if (!rawScanValue) {
		uni.showToast({
			title: '未识别到有效二维码，请重新扫码',
			icon: 'none'
		})
		return Promise.resolve(false)
	}

	if (!isLoggedIn()) {
		savePendingScanValue(rawScanValue)
		goToLogin()
		return Promise.resolve(false)
	}

	if (scanRequesting) {
		return Promise.resolve(false)
	}

	scanRequesting = true
	uni.showLoading({
		title: options.fromPending ? '正在继续扫码' : '加载中',
		mask: true
	})

	const location = store.state.user.location || {}
	return sendCommand({
		eventType: 'control_scan_success',
		scanValue: rawScanValue,
		lon: location.longitude,
		lat: location.latitude
	}).then(res => {
		const data = res && res.data ? res.data : {}
		const uuid = data.uuid
		const sn = data.sn || uuid
		if (!uuid) {
			throw new Error('扫码响应缺少设备UUID')
		}

		const url =
			`/pages/code/index?data=${encodeURIComponent(rawScanValue)}` +
			`&uuid=${encodeURIComponent(uuid)}` +
			`&sn=${encodeURIComponent(sn)}`
		uni.navigateTo({ url })
		return true
	}).catch(error => {
		if (isUnauthorized(error)) {
			savePendingScanValue(rawScanValue)
		} else if (options.fromPending) {
			uni.showToast({
				title: '续扫失败，请重新扫码',
				icon: 'none'
			})
		} else if (error instanceof Error) {
			uni.showToast({
				title: error.message || '扫码失败，请重试',
				icon: 'none'
			})
		}
		return false
	}).finally(() => {
		scanRequesting = false
		uni.hideLoading()
	})
}

export function scanFromCamera() {
	if (!isLoggedIn()) {
		uni.setStorageSync(PENDING_CAMERA_SCAN_KEY, true)
		goToLogin()
		return
	}

	if (cameraOpening || scanRequesting) return
	cameraOpening = true
	uni.scanCode({
		onlyFromCamera: true,
		success: res => {
			startScanFlow(res.result)
		},
		complete: () => {
			cameraOpening = false
		}
	})
}

export function consumePendingScan() {
	if (!isLoggedIn() || scanRequesting || cameraOpening) return Promise.resolve(false)

	const pendingScanValue = uni.getStorageSync(PENDING_SCAN_VALUE_KEY)
	if (pendingScanValue) {
		// 必须先删除再发请求，避免首页 onShow 重复发送开柜指令。
		uni.removeStorageSync(PENDING_SCAN_VALUE_KEY)
		return startScanFlow(pendingScanValue, { fromPending: true })
	}

	if (uni.getStorageSync(PENDING_CAMERA_SCAN_KEY)) {
		uni.removeStorageSync(PENDING_CAMERA_SCAN_KEY)
		scanFromCamera()
	}
	return Promise.resolve(false)
}
