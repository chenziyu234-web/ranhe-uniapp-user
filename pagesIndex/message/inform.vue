<template>
	<view>
		<view class="u-p-t-60">
			<view class="u-flex padding-row-30 u-row-between message-lists" v-for="(item,index) in list" :key="index" @click="jemp(item)">
				<view class="message u-flex">
					<image :src="xunHelper.detectUrl(item.icon)"></image>
					<view class="red" v-if="item.unReadNumber!=0">{{item.unReadNumber}}</view>
					<view class="u-m-l-30">
						<view class="u-font-32 u-m-b-10 font-weight">{{item.typeText}}</view>
						<view class="u-font-22 color-999">{{item.typeText}}</view>
					</view>
				</view>
				<view class="u-font-22" style="color: #c1c1c1;">
					<!-- <text class="u-m-r-10">05-14</text><text>13:07</text> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		messageTypes
	} from '@/api/index.js'
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList() {
				messageTypes().then(res => {
					this.list = res.data
				})
			},
			toBack() {
				uni.navigateBack({})
			},
			jemp(item) {
				uni.navigateTo({
					url: `./orderForm?type=${item.type}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
	}

	.message image {
		width: 86rpx;
		height: 86rpx;
		border-radius: 50%;
	}

	.message-lists {
		width: 690rpx;
		height: 152rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		margin: 0 30rpx 20rpx;
	}
	.message{
		position: relative;
		.red {
			position: absolute;
			top: 0;
			left: 66rpx;
			width: 36rpx;
			height: 36rpx;
			background-color: #ff1a2f;
			border: solid 2rpx #ffffff;
			font-size: 20rpx;
			text-align: center;
			line-height: 36rpx;
			border-radius: 50%;
			color: #fff;
		}
	}
	
</style>
