<template>
	<view>
		<view class="font-weight u-p-l-60 u-p-t-60 u-m-t-30" style="font-size: 48rpx;" v-if="!show">请选择您的登录方式</view>
		<!-- <view class="u-font-24 u-p-l-60 u-p-t-20" style="color: #999;">为了您的账户安全请绑定手机号</view> -->
		<view v-if="!show">
			<button class="login-button" open-type="getPhoneNumber" @getphonenumber="getphonenumber" v-if="showMode">
				手机号快捷登录
			</button>
			<button class="login-button" @click="showTips" v-if="!showMode">
				手机号快捷登录
			</button>
			<button class="login-button" @click="show = true" style="margin-top: 60rpx;">
				手机短信登录/注册
			</button>
		</view>
		<view v-if="show" class="u-p-t-60 u-m-t-60">
			<view class=" lgnInt">
				<input placeholder="请输入手机号" v-model="query.mobile" class="int" />
			</view>
			<view class="lgnInt yzm">
				<input placeholder="请输入验证码" v-model="query.yzm" class="yzmInt" />
				<view class="yzmBtn" @click="getCode">{{yzmTxt}}</view>
			</view>
			<view class="u-flex">
				<view class="bottom-button login-button" @click="submit">登录/注册</view>
			</view>
			<view class="bottom-button u-m-t-30" @click="show = false" style="color: #666;">返回手机号快捷登录/注册</view>
		</view>

		<view class="bottom">
			<!-- <view class="bottom-button" @click="show = true">短信验证码绑定</view> -->
			<view class="info">
				<image @click="showMode = !showMode" v-if="!showMode" src="/static/35.png"></image>
				<!-- <image @click="showMode = !showMode" v-else src="/static/35-active.png"></image> -->
				<u-icon @click="showMode = !showMode" v-else name="checkmark-circle-fill" size="40" :color="themeColor"
					style="margin-right: 14rpx;"></u-icon>
				请阅读并同意<text style="color: #333;" @click="jemp('2')">《用户隐私政策》</text>和<text style="color: #333;"
					@click="jemp('1')">《用户协议》</text>
			</view>
		</view>
		<!-- 隐私政策 -->
		<!-- <CustomPrivacy isAutomatic isHide></CustomPrivacy> -->
	</view>
</template>

<script>
	import { authRegister } from '@/api/user.js'
	import {
		sendCode
	} from '@/api/public.js'
	import {
		bindPublicityApi
	} from '@/api/index.js'
	import { hasPendingScanTask } from '@/common/utils/scanFlow.js'
	import { phoneAuthorizationFailure } from '@/common/utils/phoneAuthorization.js'
	export default {
		data() {
			return {
				publicityId: '',
				show: false,
				query: {
					mobile: null,
					scene: 6,
					yzm: ''
				},
				btn_getCode: false,
				yzmTxt: '获取验证码',
				// 989898
				showMode: false,
				session: ''
			}
		},
		onLoad() {
			this.getSession()
		},
		created() {
			let id = uni.getStorageSync('publicityId')
			console.log('宣传人员idddd', id);
		},
		methods: {
			async getSession() {
				try {
					this.session = await this.xunHelper.getWxLoginCode()
				} catch (error) {
					uni.showToast({
						title: '获取微信登录凭证失败，请重试',
						icon: 'none'
					})
				}
			},
			finishLogin(res, requireProfile = false) {
				this.$store.commit('user/SET_TOKEN', res.token)
				this.$store.commit('user/SET_USERINFO', res.member)
				this.$store.dispatch('user/getPublicityConfig')

				if (hasPendingScanTask()) {
					uni.reLaunch({
						url: '/pages/index/index'
					})
					return
				}

				if (requireProfile && !res.member.nickname) {
					uni.redirectTo({
						url: '/pagesMy/setUser/setUser'
					})
					return
				}

				// #ifdef MP-WEIXIN
				uni.switchTab({
					url: '/pages/index/index'
				})
				// #endif
				// #ifdef MP-ALIPAY
				uni.reLaunch({
					url: '/pages/index/index'
				})
				// #endif
			},
			bindPublicity(id) {
				bindPublicityApi({
					publicityId: id
				}).then(res => {
					console.log('绑定', res);
				}).finally(() => {
					uni.setStorageSync('publicityId', '')
				})
			},
			isValidPhone(phone) {
				return /^(13[0-9]|14[01456879]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(phone);
			},
			getCode() { //获取验证码
				// return
				if (this.btn_getCode) return
				const goData = this.isValidPhone(this.query.mobile)
				if (goData) {
					sendCode(this.query).then(res => {
						if(res.code == 200){
							this.setTxt(90)
						}else{
							this.setTxt(10)
						}
					}).catch(() => {
						// 请求层已提示具体错误；发送失败不进入倒计时。
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请输入正确手机号'
					})
				}

			},
			//倒计时
			setTxt(num) {
				// var $sendBtn = this.PhoneCodetext;
				if (this.btn_getCode) return
				var _this = this;
				this.btn_getCode = true;
				this.yzmTxt = num + 's后重新发送';
				let clock = setInterval(() => {
					num--
					_this.yzmTxt = num + 's后重新发送'
					if (num < 0) {
						clearInterval(clock)
						_this.yzmTxt = '重新发送验证码'
						num = 90
						// this.canClick = true //这里重新开启
						_this.btn_getCode = false
					}
				}, 1000)
			},
			submit() {
				if (this.showMode) {
					uni.showLoading({
						title: "登录中...",
						mask: true
					})
					const Pdata  = {
						scene: "mobile_code_register",
						mobile: this.query.mobile,
						password: "",
						smsCode: this.query.yzm,
						promoterId: uni.getStorageSync('promoterId') || '',
						runnerUserId: uni.getStorageSync('offline') || '',
						// #ifdef MP-WEIXIN
						weminiJsCode: this.session,
						// #endif
						// #ifdef MP-ALIPAY
						aliAuthCode: this.session
						// #endif
					}
					return authRegister(Pdata).then(res => {
						//console.log(Pdata,PPdata555555555555111111)
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
						this.finishLogin(res)
					}).catch(() => {
						this.getSession()
					}).finally(() => {
						uni.hideLoading()
					})
				} else {
					this.showTips()
				}

			},
			showTips() {
				this.$u.toast("请勾选用户协议与隐私政策")
			},
			async getphonenumber(e) { //微信授权登录
				if (!this.showMode) return this.showTips()
				const resultPhone = (e && e.detail) || {}
				// #ifdef MP-WEIXIN
				if ((resultPhone.errMsg && resultPhone.errMsg !== 'getPhoneNumber:ok') ||
					(!resultPhone.code && !(resultPhone.iv && resultPhone.encryptedData))) {
					console.warn('[phone-authorization]', {
						errMsg: resultPhone.errMsg || '',
						errno: resultPhone.errno == null ? '' : resultPhone.errno
					})
					return uni.showModal({
						title: '手机号授权未完成',
						content: phoneAuthorizationFailure(resultPhone),
						showCancel: false
					})
				}
				// 手机号 code 和 wx.login code 各有用途；每次新版授权重新获取登录凭证。
				if (resultPhone.code) {
					try {
						this.session = await this.xunHelper.getWxLoginCode()
						if (!this.session) throw new Error('微信登录凭证为空')
					} catch (error) {
						return this.$u.toast('获取微信登录凭证失败，请重试')
					}
				}
				// #endif
				uni.showLoading({
					title: "登录中...",
					mask: true
				})
				const PPdata = {
					// #ifdef MP-WEIXIN
					scene: "wemini_mobile_register",
					weminiJsCode: this.session,
					code: resultPhone.code,
					iv: resultPhone.iv,
					encryptedData: resultPhone.encryptedData,
					promoterId: uni.getStorageSync('promoterId') || '',
					runnerUserId: uni.getStorageSync('offline') || '',
					// #endif
					// #ifdef MP-ALIPAY
					scene: "alipay_auth_register",
					aliAuthCode: this.session,
					aliPhoneNumberResponse: resultPhone.encryptedData,
					aliPhoneNumberSign: resultPhone.sign
					// #endif
				}
				return authRegister(PPdata).then(res => {
					let publicityId = uni.getStorageSync('publicityId')
					if (publicityId) {
						this.bindPublicity(publicityId)
					}
					this.finishLogin(res, true)
				}).catch(() => {
					this.getSession()
				}).finally(() => {
					uni.hideLoading()
				})
			},
			jemp(id) {
				uni.navigateTo({
					url: `/pages/singPage/singPage?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.lgnInt {
		margin: 20rpx 60rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx #ccc solid;
	}

	.int {
		height: 60rpx;
		line-height: 60rpx;
	}

	.yzm {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
		align-items: center;
	}

	.yzmInt {
		height: 40rpx;
		// padding: 10rpx 0;
	}

	.yzmBtn {
		width: 200rpx;
		padding: 10rpx 0;
		text-align: center;
		border: 1rpx #ccc solid;
		border-radius: 10rpx;
	}

	.bottom {
		width: calc(100% - 120rpx);
		text-align: center;
		position: fixed;
		left: 60rpx;
		bottom: 0;
		padding-bottom: 60rpx;
	}

	.info {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		line-height: 72rpx;
		color: #999999;

		image {
			width: 40rpx;
			height: 40rpx;
			margin-right: 14rpx;
		}
	}

	.bottom-button {
		width: 625rpx;
		height: 96rpx;
		line-height: 96rpx;
		border-radius: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		border: solid 2rpx #e1e1e1;
		text-align: center;
		margin: auto;
	}

	.login-button {
		margin: 160rpx auto 0;
		font-size: 34rpx;
		line-height: 96rpx;
		width: calc(100% - 120rpx);
		height: 96rpx;
		background-color: #00B3E0;
		border-radius: 20rpx;
		color: #FFFFFF;
		box-shadow: 5rpx 15rpx 10px rgba($color: $theme-bgColor, $alpha: 0.2);
	}
</style>
