<template>
	<view class="">
		<nav-bg-fit title="账单明细">
			<view class="nav-select u-text-center u-m-t-48" @click="show=true"><text
					class="u-font-36 font-weight">{{month}}月</text>
				<u-icon name="arrow-down"></u-icon>
			</view>
			<view class="u-font-24 u-text-center u-m-t-28">
				本月{{info.totalNumber || '0'}}次投递，总重量{{xunHelper.weightK(info.totalWeight || '0')}}kg</view>
		</nav-bg-fit>


		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="list u-m-t-38">
				<view class="u-flex u-row-between u-p-t-30 u-p-b-30 item" :style="{borderTop:index==0?'0rpx' : ''}"
					v-for="(item,index) in list" :key="index">
					<view class="">
						<view class="u-m-b-10">{{item.villageName}}</view>
						<view class="color-999 u-font-24">{{item.createTime}}</view>
					</view>
					<view class="">
						<view>{{xunHelper.weightK(item.totalWeight)}}<text class="u-font-24">kg</text></view>
						<!-- <view :style="{color: item.sendStatus == 2 ? '#13992e' : item.sendStatus == 1 ? '#f3324f' : ''}">
							{{item.sendStatusText}}</view> -->
					</view>
				</view>
			</view>
		</mescroll-body>
		<u-picker v-model="show" @confirm="confirm" :params="params" mode="time"></u-picker>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		memberDeliveryList,
		billMemberTotal
	} from '@/api/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				show: false,
				month: currentDate,
				list: [],
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				info: {}
			}
		},
		methods: {
			confirm(e) {
				this.month = e.year + '-' + e.month
				this.downCallback()
			},
			getDate(type) { //获取当前年月
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				month = month > 9 ? month : '0' + month;
				this.index = month
				return `${year}-${month}`;
			},
			downCallback() { //下拉回调
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				//联网加载数据
				billMemberTotal({
					month: this.month,
					sortField: 'total_number'
				}).then(res => {
					this.info = res.total
				})
				let pageSize = page.size
				let pageNum = page.num
				memberDeliveryList({
					pageNum,
					pageSize,
					month: this.month
				}).then(res => {
					let curPageData = res.data
					if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(curPageData); //追加新数据
					this.mescroll.endByPage(curPageData.length, curPageData.length + 10);
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.nav-select {
		z-index: 10;
		position: relative;
		margin-top: -200rpx;
	}

	.list {
		width: 690rpx;
		background-color: #ffffff;
		border-radius: 40rpx;
		margin: auto;

		.item {
			width: 630rpx;
			margin: auto;
			border-top: 1rpx solid #e1e1e1;
		}
	}
</style>
