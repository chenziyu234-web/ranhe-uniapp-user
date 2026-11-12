<template>
	<view>
		<view class="content">
			<image src="/pagesMy/static/52.png"></image>
			<view class="font-weight u-font-32 u-p-t-30">提现申请成功</view>
			<!-- <view class="u-font-14 u-p-t-30">审核通过后即可入账</view> -->
			<view class="num font-weight u-p-b-40">
				<view class="u-font-36" style="line-height: 90rpx;">￥</view>
				<view style="font-size: 100rpx;letter-spacing: -1rpx;">{{num}}</view>
			</view>
			<view class="button u-m-t-60" @click="toMe">返回首页</view>
		</view>
		<view class="bottom">
			<!-- #ifdef MP-ALIPAY -->
			<view>入账账户：支付宝账户 {{userInfo.mobile}}</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view>入账账户：微信钱包 {{userInfo.mobile}}</view>
			<!-- #endif -->
			<view>提现金额：{{num}}元</view>
			<view>提现时间：{{time}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: null,
				stutus: null,
				time: null
			}
		},
		computed: {
			userInfo() { //tabbar
				return this.$store.state.user.userInfo || {}
			}
		},
		onLoad(option) {
			this.num = option.n
			this.stutus = option.s
			this.time = option.t
		},
		methods: {
			toMe(){
				// this.doSubscrite()
				// #ifdef MP-WEIXIN
				uni.switchTab({
					url:'/pages/me/index'
				})
				// #endif
				// #ifdef MP-ALIPAY
				uni.reLaunch({
					url: '/pages/me/index'
				})
				// #endif
			},
			doSubscrite(){
				wx.getSetting({
					withSubscriptions: true,
					success(res) {
						console.log(res,'获取微信配置')
						const msgList = res.subscriptionsSetting
						if (msgList.mainSwitch === false){
							uni.showToast({
								icon: 'none',
								title: '请在小程序设置中打开订阅消息开关'
							})
						}else{
							wx.requestSubscribeMessage({
								tmplIds: ['VrmmCsskJicAwpZ7eyQtFrob9t9ahO1a9sFZ7Zc3Jr8','hXHtrXyC21cNhcA8eqtcC2rfkXMFj5xtIDUHwU2dgh4'],
								success(res) {
									console.log(res,'消息订阅查看')
								},complete() {
									uni.switchTab({
										url:'/pages/me/index'
									}) 
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 200rpx;
		.num {
			display: flex;
		}

		.button {
			width: 284rpx;
			height: 96rpx;
			border-radius: 20rpx;
			border: solid 2rpx #e1e1e1;
			line-height: 96rpx;
			color: #333333;
			font-weight: bold;
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		left: 63rpx;
		width: 625rpx;
		height: 276rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		color: #666666;
		padding: 40rpx 0rpx 0rpx 120rpx;
		border-top: 1rpx solid #e1e1e1;
	}

	image {
		width: 235rpx;
		height: 235rpx;
		margin-left: 20rpx;
	}
</style>
