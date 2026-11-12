<template>
	<view>
		<view class="goods-view">
			<view class="icon-image">
				<image src="/pagesIndex/static/ic_success.png"></image>
			</view>
			<view class="u-text-center u-m-t-60">
				<text class="u-font-40 font-weight">预约成功，系统正在派单</text>
				<view class="color-999 u-font-24 u-p-t-10">请耐心等待回收员接单</view>
			</view>

			<view class="flex-direction flex-wrap align-center">
				<view class="goods-btn btn-back" @click="jump(1)">查看订单</view>
				<view class="goods-btn btn-view" @click="jump(2)">返回首页</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad(options) {
			this.id = options.id
		},

		methods: {
			jump(type) {
				if (type == 2) {
					uni.switchTab({
						url: "/pages/index/index"
					})
				} else {
					uni.redirectTo({
						url: `/pagesIndex/doorOrderDetail/doorOrderDetail?id=${this.id}`,
					})
				}
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: white;
	}

	.deposit-view {
		width: 690rpx;
		color: #1bcfeb;
		padding: 20rpx;
		margin: 20rpx auto;
		background-color: #e4f9fc;
		border-radius: 8rpx;
		box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(26, 201, 239, 0.5);
	}

	.goods-view {
		padding-top: 125rpx;

		.icon-image {
			text-align: center;
		}

		.icon-image image {
			width: 194rpx;
			height: 194rpx;
			margin-left: 10rpx;
		}

		.goods-btn {
			display: inline-block;
			text-align: center;
			line-height: 84rpx;
		}

		.btn-back {
			width: 382rpx;
			height: 84rpx;
			background-color: $theme-color;
			box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(4, 203, 199, 0.5);
			border-radius: 50rpx;
			color: #fff;
			margin-top: 80rpx;
		}

		.btn-view {
			width: 382rpx;
			height: 84rpx;
			border-radius: 50rpx;
			border: solid 2px $theme-color;
			color: $theme-color;
			margin-top: 20rpx;
		}
	}
</style>
