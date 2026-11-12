<template>
	<view>
		<view class="item" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
			<view class="title u-p-b-10">
				<view class="status u-line-1 calc-w130">
					<text v-for="(items,indexs) in item.memberDetails" :key="indexs">{{items.name}}</text>
				</view>
				<view class="title-icon vw130 text-right">
					<text class="text-theme">{{ item.statusText }}</text>
					<!-- {{item.status==1?'已取消':item.status==3?'接单中':item.status==4?'进行中':'已回收'}} -->
				</view>
			</view>
			<view class="info">
				<view class="info-item">
					<view class="info-item-label">预约时间: </view>
					<view class="info-item-name">{{item.preTime}}</view>
				</view>
				<view class="info-item">
					<view class="info-item-label">回收地址: </view>
					<view class="info-item-name">
						{{item.addressProvince}}{{item.addressCity}}
						{{item.addressCounty}}{{item.addressDetails}}
					</view>
				</view>
			</view>
			<view class="time u-border-top" v-if="item.status!=1">
				{{ item.status==5?'':'预计' }}收益:
				<text style="color: #fe8d02;margin-left: 16rpx;">
					<text class="u-font-20">￥</text>
					<text v-if="item.status==5" class="spacing2 u-font-28">{{item.payPrice}}</text>
					<text v-else class="spacing2 u-font-28">{{item.preMinPrice}} ~ {{ item.preMaxPrice }}</text>
					<text class="u-font-24">元</text>
				</text>
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
			toDetail(item) {
				uni.navigateTo({
					url: '/pagesIndex/doorOrderDetail/doorOrderDetail?id=' + item.id
				})
			}
		}
	}
</script>

<style>

</style>
