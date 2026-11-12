<template>
	<view style="height: 100vh;">
		<view class="padding-row-30 bg-white">
			<view class="u-font-32 font-weight text-333333  padding-col-30">问题反馈类型</view>
			<view class="u-flex tags">
				<view @click="current = 1" class="tags-item  u-flex u-row-center u-m-r-30"
					:class="current==1?'active':'inActive'">
					<image :src="current==2?'/pagesMy/static/1.png':'/pagesMy/static/2.png'" mode="">
					</image>
					<text>软件反馈</text>
				</view>
				<view @click="current = 2" class="tags-item  u-flex u-row-center"
					:class="current==2?'active':'inActive'">
					<image :src="current==1?'/pagesMy/static/3.png':'/pagesMy/static/4.png'" mode="">
					</image>
					<text>问题反馈</text>
				</view>
			</view>
			<view class="u-m-t-20"
				style="background-color: #f8f8f8;border-radius: 10rpx;padding: 10rpx 20rpx;min-height: 400rpx;">
				<u-input style="" v-model="content" type="textarea" :autoHeight="true" maxlength="-1"
					placeholder="请简要描述您的问题和意见，以便我们提供更好的帮助!">
				</u-input>
				<view style="margin-top: 100rpx;">
					<u-upload ref="uUpload" :auto-upload="true" max-count="5" :header="request_heard" :action="action"
						:custom-btn="true" width="140" height="140" style="margin-top: 100rpx;">
						<view slot="addBtn" class="slot-btn u-flex-col u-col-center" hover-class="slot-btn__hover"
							hover-stay-time="150">
							<image src="/pagesMy/static/5.png" mode=""></image>
							<view class="color-999 u-font-24 u-p-t-10">
								上传照片
							</view>
						</view>
					</u-upload>
				</view>

			</view>
		</view>
		<view class="width-100 u-p-30">
			<button @click="submit">立即提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				current: 1
			}
		},
		computed: {
			action() {
				return this.$store.state.config.baseURL + 'api/common/public/upload'
			},
			request_heard() {
				return this.$store.getters.requestHeader
			},
		},
		methods: {
			submit() {
				uni.showLoading({
					title: '提交中~',
					mask: true
				})
				if (this.$u.test.isEmpty(this.content)) {
					let title = '请输入反馈内容'
					uni.showToast({
						title: title,
						icon: 'none'
					})
					return
				}

				let pics = []
				let contentImg = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				for (var i = 0; i < contentImg.length; i++) {
					if (contentImg[i].progress != 100) {
						this.$toast('图片正在上传！')
						return
					} else {
						{
							pics.push(contentImg[i].response.fileName)
						}

					}
				}

				let obj = {
					content: this.content,
					scene: this.current == 1 ? 'appFeedback' : 'questionFeedback',
					pics: pics
				}
				UserFeedbackAPI(obj).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					if (res.code == 200) {
						setTimeout(res => {
							uni.navigateBack({})
						}, 1000)
					}
				}).catch(e => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss">
	.slot-btn {
		width: 140rpx;
		height: 140rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1rpx dashed #999999;
		border-radius: 10rpx;

		image {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.slot-btn__hover {
		background-color: rgb(235, 236, 238);
	}

	.tags {
		font-size: 28rpx;

		image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 10rpx;
		}

		.tags-item {
			width: 277rpx;
			height: 75rpx;
			line-height: 75rpx;
			text-align: center;
			border-radius: 38px;

			&.active {
				border: 2rpx solid $theme-color;
				color: $theme-color;
			}

			&.inActive {
				border: 2rpx solid #e1e1e1;
				color: #333;
			}
		}
	}

	button{
		width: 690rpx;
		color: #fff;
		border-radius: 50rpx;
		background-color: $theme-color;
		
	}
</style>
