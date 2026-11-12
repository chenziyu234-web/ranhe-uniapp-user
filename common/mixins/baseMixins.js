export default {
	data() {
		return {
			share: {
				path: '/pages/index/index'
			}
		}
	},
	onShareAppMessage(res) {
		return {
			...this.share,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	},

	computed: {
		themeColor() {
			return this.$store.getters.themeColor
		},
		userInfo() {
			return this.$store.getters.userInfo || {}
		},
		loginStatus() {
			return this.$store.getters.loginStatus
		},
		location() {
			return this.$store.state.user.location || {}
		},
		tabbarList() {
			return this.$store.state.user.tabbarList || []
		},
	},
	methods: {
		logError(e) {
			uni.hideLoading()
			this.$u.toast(e?.data?.msg || JSON.stringify(e.toString()) || "服务错误")
		},
		checkLogIn(callback) {
			if (this.$xunHelper.isLogin()) {
				callback()
			} else {
				uni.navigateTo({
					url: "/pages/login/index"
				})
			}
		},
		useLoactionSetting() {
			let sysSetting = uni.getSystemSetting();
			if (!sysSetting.locationEnabled) {
				this.openSetting(1)
				return
			}
			// #ifdef APP-PLUS || MP-WEIXIN
			let appSetting = uni.getAppAuthorizeSetting()
			if (appSetting.locationAuthorized !== 'authorized') {
				this.openSetting(1)
			}
			// #endif
			// #ifndef APP-PLUS || MP-WEIXIN || H5
			uni.getSetting({
				success: (res) => {
					if (!res.authSetting['scope.userLocation']) {
						this.openSetting(2)
					}
				}
			})
			// #endif
		},
		openSetting(type) {
			if (type == 1) {
				uni.showModal({
					content: '定位服务未开启,开启后才能看到附近的回收机。',
					confirmText: '去开启',
					success: (response) => {
						if (response.confirm) {
							uni.openAppAuthorizeSetting({})
						}
					}
				})
			} else {
				uni.authorize({
					scope: 'scope.userLocation',
					fail: (error) => {
						console.log(error);
						uni.showModal({
							content: '定位服务未开启,开启后才能看到附近的回收机。',
							confirmText: '去开启',
							success: (response) => {
								if (response.confirm) {
									uni.openSetting({})
								}
							}
						})
					}
				})
			}
		}
	}
}