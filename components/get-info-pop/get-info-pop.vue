<template>
	<view>
		<!-- 登录提醒 -->
		<u-modal v-model="showLogin" @confirm="to_login" @cancel="cancel" cancelText="关闭" :confirmColor="themeColor"
			:show-cancel-button="true" :content="content" title="信息同步提醒">
			<view class="flex flex-direction align-center justify-center u-m-t-30">
				<!-- #ifdef MP-WEIXIN -->
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image v-if="form.avatar" class="avatar" :src="form.avatar"></image>
					<!-- <image class="avatar" v-else src="/static/common/def.png" mode="widthFix"></image> -->
				</button>
				<input type="nickname" class="weui-input" :value="nickName" @blur="bindblur" @input="bindinput"
					placeholder="点击获取微信昵称" />
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<button class="avatar-wrapper" @click="chooseAvatar">
					<image v-if="form.avatar" class="avatar" :src="form.avatar"></image>
					<!-- <image class="avatar" v-else src="/static/common/def.png" mode="widthFix"></image> -->
				</button>
				<input type="nickname" class="weui-input" :value="nickName" @blur="bindblur" @input="bindinput" placeholder="点击输入昵称" />
				<!-- #endif -->

			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		userEdit as updateBaseInfo
	} from '@/api/user.js'
	export default {
		name: "get-info-pop",
		data() {
			return {
				type: '',
				form: {
					nickName: '',
					avatar: ''
				},
				nickName: '',
				showLogin: false,
			};
		},
		props: {
			content: {
				type: String,
				default: '为了给您更好的体验，请允许获取您的头像和昵称！'
			}
		},
		computed: {
			user() {
				return this.$store.state.user.userInfo || {}
			},
			actionUrl() {
				return this.$store.state.config.baseURL + 'api/common/public/upload'
			},
			requestData() {
				return {
					...this.$store.getters.requestHeader,
				}

			},
		},
		mounted() {},
		methods: {
			chooseAvatar(e) {
				uni.navigateTo({
					url: '/uni_modules/vk-uview-ui/components/u-avatar-cropper/u-avatar-cropper?destWidth=300&rectWidth=200&fileType=jpg'
				});
			},
			open(type = '') {
				this.form.avatar = this.user.avatar
				this.nickName = this.user.nickname
				this.type = type
				this.showLogin = true
				// #ifndef MP-WEIXIN
				uni.$on('uAvatarCropper', path => {
					console.log(123);
					this.form.avatar = path
					uni.uploadFile({
						url: this.actionUrl,
						filePath: path,
						header: this.requestData,
						name: 'file',
						success: (uploadFileRes) => {
							let data = JSON.parse(uploadFileRes.data)
							console.log(data);
							this.form.avatar = this.xunHelper.detectUrl(data.data.url)
							this.$forceUpdate()
							// this.setAvatar(data.data.fileName)
						}
					});
				});
				// #endif
			},
			cancel() {
				if (this.type == true) {
					// uni.navigateBack({});
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}
				// #ifndef MP-WEIXIN
				uni.$off('uAvatarCropper')
				// #endif
			},
			bindblur(e) {
				this.nickName = e.detail.value; // 获取微信昵称
			},
			bindinput(e) {
				this.nickName = e.detail.value; // 获取微信昵称
			},
			onChooseAvatar(e) {
				this.form.avatar = e.detail.avatarUrl
				uni.uploadFile({
					url: this.actionUrl,
					filePath: this.form.avatar,
					header: this.requestData,
					name: 'file',
					success: (uploadFileRes) => {
						let data = JSON.parse(uploadFileRes.data)
						this.form.avatar = this.xunHelper.detectUrl(data.fileName)
						this.$forceUpdate()
						// this.setAvatar(data.data.fileName)
					}
				});
			},
			to_login() {
				let that = this
				console.log(this.nickName);
				this.modifyInfo({
					// ...this.user,
					id: this.user.id,
					nickname: this.nickName,
					avatar: this.form.avatar
				})
			},
			async modifyInfo(requestData) {
				uni.showLoading({
					mask: true,
					title: '保存中'
				});
				updateBaseInfo(requestData)
					.then(async res => {
						uni.hideLoading();
						uni.showToast({
							title: '信息同步成功',
							icon: 'none'
						});
						await this.$store.dispatch("user/getUserInfo")
						if (this.type == true) {
							setTimeout(() => {
								// uni.navigateBack({});
								uni.reLaunch({
									url: '/pages/index/index'
								})
							}, 1000);
						}
					})
					.catch(e => {
						uni.hideLoading();
						this.logError(e)
					});
				// #ifndef MP-WEIXIN
				uni.$off('uAvatarCropper')
				// #endif
			},

		}
	}
</script>

<style lang="scss">
	.avatar-wrapper {
		width: 120rpx;
		height: 120rpx;
		padding: 0;
		margin: 0 !important;

		.avatar {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.weui-input {
		margin-bottom: 50rpx;
		margin-top: 30rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333;
	}
</style>