<template>
	<view class="item u-border-bottom u-p-30" v-for="(item,index) in list" :key="index" @click="todetail(item)">
		<view class="u-flex">
			<view class="u-m-r-10">
				<image class="image" :src="xunHelper.detectUrl(item.mainImage)"></image>
			</view>
			<view style="width: calc(100% - 180rpx);height: 100%;">
				<view class="u-line-2">{{item.name}}</view>
				<!-- <view class="vw20 vh30"></view> -->
				<view class="u-line-1 u-font-24 color-999 u-p-t-10">
					<u-icon name="/static/2.png" size="28rpx"></u-icon>
					{{item.address}}
				</view>
				<view style="color:#fe8d02;padding-top: 10rpx; ">
					<text class="u-font-20">￥</text><text class="u-font-32">{{item.salePrice}}</text>
				</view>
			</view>
		</view>
		<view class="u-tips-color u-p-t-10">{{item.auditTime}}</view>
	</view>
</template>

<script>
	export default {
		name: "goods-list",
		data() {
			return {

			};
		},
		props: {
			list: {
				type: Array,
				default: []
			}
		},
		methods: {
			todetail(item) {
				uni.navigateTo({
					url: '/pagesMarket/goodsDetail/goodsDetail?id=' + item.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.item {
		width: 750rpx;
	}

	.image {
		width: 164rpx;
		height: 164rpx;
		border-radius: 12rpx;
	}
</style>
