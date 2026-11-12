<template>
	<view class="content-view">
		<view @click="toDetail(item)" class="item display" v-for="(item,index) in list" :key="index">
			<image :src="xunHelper.detectUrl(item.cover)"></image>
			<view class="calc-w230">
				<view class="u-line-2 vh80 u-p-l-20">{{item.name || item.title}}</view>
				<view class="phone-view display">
					<view class="calc-w100 u-line-1 u-flex u-p-t-20">
						<u-icon name="/static/2.png" size="28"></u-icon>
						{{item.address || item.title}}
					</view>
					<image @click.stop="setPhone(item)" src="/static/me/call.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			list: {
				type: Array,
				default: []
			}
		},
		methods: {
			setPhone(item) {
				this.$refs.phoneMode.open(item.mobile)
			},
			toDetail(item) { //跳转详情页
				uni.navigateTo({
					url: `/pagesIndex/storeList/storeDetail?id=${item.id}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.content-view {
		width: 100%;
		padding: 30rpx;

		.item {
			width: 690rpx;
			height: 210rpx;
			background-color: #ffffff;
			border-radius: 8rpx;
			padding: 20rpx 20rpx 0rpx;
			margin-top: 20rpx;

			image {
				width: 212rpx;
				height: 164rpx;
				margin-right: 10rpx;
				border-radius: 8rpx;
			}

			.phone-view {
				padding-top: 10rpx;

				image {
					width: 80rpx;
					height: 80rpx;
					margin-left: 20rpx;
				}
			}
		}
	}
</style>
