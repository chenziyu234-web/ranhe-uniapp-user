<template>
	<view style="padding-bottom: 200rpx;">

		<view class="view bg-theme text-white">
			<view>{{ goodDetail.statusText }}</view>
			<view class="u-font-24">
				订单编号
				<text>{{ goodDetail.ordersn }}</text>
			</view>
		</view>

		<view class="info-view">
			<view class="time">预约基本信息</view>
			<view class="padding-row-20">
				<view class="u-font-24 border-btm padding-col-20">
					<view class="u-tips-color u-p-b-10">预约上门时间</view>
					<view>{{ goodDetail.preTime }}</view>
				</view>
				<view class="u-font-24 padding-col-20">
					<view class="u-tips-color u-p-b-10">上门地址</view>
					<view>
						{{ goodDetail.addressProvince + goodDetail.addressCity + goodDetail.addressCounty + goodDetail.addressDetails }}
					</view>
				</view>
				<view class="u-font-24 u-p-b-20">
					<view class="u-tips-color u-p-b-10">用户信息</view>
					<view>{{ goodDetail.addressName }} {{ goodDetail.addressMobile }}</view>
				</view>
			</view>
		</view>

		<view class="info-view" v-if="goodDetail.status==4">
			<view class="time">回收员信息</view>
			<view class="padding-row-20 u-flex u-row-between">
				<view class="u-font-24 padding-col-20">
					<view class="u-tips-color u-p-b-10">{{recycleUser.actualName}}</view>
					<view>{{recycleUser.mobile}}</view>
				</view>
				<view class="u-flex" @click="getPhone">
					<image src="/pagesIndex/static/phone.png" style="width: 25rpx;height: 25rpx; "></image>
					<view class="line"></view>
					<text class="color-999 font-s24">拨打电话</text>
				</view>
			</view>
		</view>

		<view class="view titles">回收商品信息</view>

		<view class="view">
			<view class="item-view u-flex u-row-between" :style="{borderTop: index==0?'0':'1px solid #e1e1e1'}"
				v-for="(item,index) in goodDetail.memberDetails" :key="index">
				<text class="font-weight">{{ item.name }}</text>
				<text style="color: #ff7f3f;">{{ item.price }}元/{{ item.unit }}</text>
			</view>
		</view>

		<view class="view u-flex u-row-between">
			<text class="color-999">预估重量</text>
			<text>{{ goodDetail.preWeight }}公斤</text>
		</view>

		<view class="view">
			<view class="u-tips-color u-font-28 ">备注信息</view>
			<view class="padding-20">
				{{ goodDetail.remarks }}
			</view>
		</view>

		<view class="flex-bottom-view">
			<view v-if="goodDetail.status == 3">
				<picker :range="cancelList" range-key="label" @change="changes">
					<view class="button flex-center">取消预约</view>
				</picker>
			</view>
			<view class="display  u-m-r-20">
				<view class="u-font-28">{{ goodDetail.status==5?'':'预计' }}收益:</view>
				<view class="u-p-l-10">
					<view style="color: #ff7f3f;">
						<text class="u-font-20">￥</text>
						<text v-if="goodDetail.status==5" class="spacing2 u-font-28">{{goodDetail.payPrice}}</text>
						<text v-else class="spacing2 u-font-28">{{goodDetail.preMinPrice}} ~
							{{ goodDetail.preMaxPrice }}</text>
						<!-- <text class="spacing2 u-font-28">{{ goodDetail.preMinPrice }} ~
							{{ goodDetail.preMaxPrice }}</text> -->
						<text class="u-font-24">元</text>
					</view>
					<view class="u-font-20 color-999">成交价格以实际评估为准</view>
				</view>
			</view>
		</view>
		<phone-mode ref="phoneMode"></phone-mode>
	</view>
</template>

<script>
	import {
		recycleOrderDetail,
		recycleOrderCancel
	} from '@/api/index.js'
	export default {
		data() {
			return {
				recycleUser: {},
				goodDetail: {},
				cancelList: [{
						label: '不小心点错',
						value: 1
					},
					{
						label: '回收价格太低',
						value: 2
					},
					{
						label: '回收员态度不好',
						value: 3
					},
					{
						label: '太久没有确认上门时间',
						value: 4
					},
					{
						label: '联系不上回收员',
						value: 4
					},
					{
						label: '其他',
						value: 4
					}
				]
			}
		},
		computed: {

		},
		onLoad(options) {
			this.getOrder(options.id)
		},
		methods: {
			getPhone(){
				this.$refs.phoneMode.open(this.recycleUser.mobile)
			},
			changes(e) {
				recycleOrderCancel({
					reasonValue: this.cancelList[Number(e.detail.value)].label,
					id: this.goodDetail.id
				}).then(res => {
					this.$u.toast(res.msg)
					this.getOrder(this.goodDetail.id)
				}).catch(err => {
					this.logError(err)
				})
			},
			getOrder(id) {
				recycleOrderDetail({
					id: id
				}).then(res => {
					this.goodDetail = res.data
					this.recycleUser = res.data.recycleUser
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}
	.line{
		width: 1px;
		height: 19rpx;
		background-color: #e1e1e1;
		margin: 0 16rpx;
	}
	.info-view {
		width: 690rpx;
		border-radius: 12rpx;
		background-color: #ffffff;
		margin: 20rpx auto 0;

		.time {
			width: 100%;
			background-color: #e7e7e7;
			border-top-left-radius: 12rpx;
			border-top-right-radius: 12rpx;
			font-weight: bold;
			font-size: 24rpx;
			padding: 20rpx;
		}
	}

	.flex-bottom-view {
		position: fixed;
		bottom: 0;
		display: flex;
		flex-direction: row-reverse;
		width: 100%;
		background-color: #fff;
		padding: 10rpx 30rpx 60rpx;
		box-shadow: 0 0 20rpx 0 #e1e1e1;

		.button {
			width: 200rpx;
			height: 70rpx;
			// background-color: $theme-color;
			box-shadow: 0rpx 6rpx 12rpx 0rpx #e1e1e1;
			border-radius: 44rpx;
			border: 1px solid $theme-color;
			color: $theme-color;
		}
	}

	.view {
		width: 690rpx;
		border-radius: 12rpx;
		background-color: #ffffff;
		margin: 20rpx auto 0;
		padding: 20rpx;

		.item-view {
			width: 100%;
			padding: 20rpx 0;
		}

	}

	.titles {
		background-color: rgba(4, 203, 199, 0.1);
		color: $theme-color;
		font-size: 26rpx;
		font-weight: bold;
	}
</style>
