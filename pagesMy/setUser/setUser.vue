<template>
	<view>
		<view class="u-flex u-row-between u-p-30 u-border-bottom">
			<view class="u-flex u-row-center">头像</view>
			<view class="u-flex">
				<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="avatar" :src="query.avatar"></image>
				</button>
			</view>
		</view>
		<view class="u-flex u-row-between u-p-30 u-border-bottom">
			<view class="u-flex u-row-center">昵称</view>
			<view class="u-flex">
				<input type="nickname" class="weui-input" v-model="query.nickname" placeholder="请输入昵称" />
			</view>
		</view>
		<view class="btn" @click="submit">确定</view>
	</view>
</template>

<script>
	import {
		uploadApiPath
	} from '@/api/public.js'
	import {
		userEdit,
		getInfo
	} from '@/api/user.js'
	export default {
		data() {
			return {
				query: {
					avatar: '',
					nickname: null
				}
			}
		},
		computed: {
			actionUrl() {
				return this.$store.getters.baseURL + uploadApiPath;
			},
			requestData() {
				return this.$store.getters.requestHeader;
			},
			user() {
				return this.$store.state.user.userInfo || {}
			},
		},
		onReady() {
			this.query.avatar = this.xunHelper.detectUrl(this.user.avatar)
			this.query.nickname = this.user.nickname
		},
		methods: {
			onChooseAvatar(e) {
				this.query.avatar = e.detail.avatarUrl
				uni.uploadFile({
					url: this.actionUrl,
					filePath: this.query.avatar,
					header: this.requestData,
					name: 'file',
					success: (uploadFileRes) => {
						let data = JSON.parse(uploadFileRes.data)
						this.query.avatar = this.xunHelper.detectUrl(data.fileName)
					}
				});
			},
			submit() {
				if (!this.query.nickname) {
					uni.showToast({
						icon: 'none',
						title: '请输入昵称'
					})
					return
				}
				userEdit(this.query).then(res => {
					getInfo().then(res1 => {
						this.$store.commit('user/SET_USERINFO', res1.data)
					})
					uni.navigateBack({})
				})
			}
		}
	}
</script>

<style lang="scss">
	.avatar-wrapper {
		width: 120rpx;
		height: 120rpx;
		padding: 0;

		.avatar {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.weui-input {
		text-align: right;
	}

	.btn {
		width: 600rpx;
		height: 80rpx;
		margin: 120rpx auto;
		background-color: $theme-color;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-weight: bold;
	}
</style>
