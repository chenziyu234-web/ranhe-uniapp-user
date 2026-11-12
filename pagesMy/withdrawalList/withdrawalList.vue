<template>
	<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
		<view class="padding-30" style="background-color: rgb(250,250,250);">
			<view v-for="(item,index) in deliveryList" :key="index" class="u-flex u-row-between u-col-center u-m-b-30"
				style="border-radius: 20rpx;background-color: #fff;padding: 20rpx;">
				<view>
					<view class="u-font-28 text-333333">提现</view>
					<view class="u-font-24 padding-col-10" style="color:#7B7B7B ;">{{item.createTime}}</view>
					<view class="u-font-20">订单号：<text style="color: #4E80FF;">{{item.orderSn}}</text></view>
				</view>
				<view class="text-right">
					<view class="u-font-28 tex-333333 font-weight">-￥{{item.amount}}</view>
					<view class="u-font-26 font-weight" style="color: #F9B908;">{{item.statusText}}</view>
				</view>
			</view>
		</view>
	</mescroll-body>
</template>

<script>
	import {
		withdrawList
	} from '@/api/index.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				deliveryList: [],
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10, // 每页数据的数量,默认10
					},
					noMoreSize: 5,
					textNoMore: '--我也是有底线的--'
				},
			}
		},
		onLoad() {
			// this.getMemberDeliveryList()
		},
		methods: {
			downCallback() { //下拉回调
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				//联网加载数据
				let pageSize = page.size
				let pageNum = page.num
				withdrawList({
					pageNum,
					pageSize,
				}).then(res => {
					let curPageData = res.rows
					if (page.num == 1) this.deliveryList = []; //如果是第一页需手动制空列表
					this.deliveryList = this.deliveryList.concat(curPageData); //追加新数据
					this.mescroll.endByPage(curPageData.length, curPageData.length + 10);
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			toOrderDetail(id) {
				uni.navigateTo({
					url: '/pagesMy/myOrder/orderDetail?id=' + id
				})
			},
			//获取提现列表
			getMemberDeliveryList() {
				withdrawList({
					pageNum: 1,
					pageSize: 100,
				}).then(res => {
					if (res.code == 200) {
						this.deliveryList = res.rows
					}
				})
			},
		}
	}
</script>

<style lang="scss">

</style>