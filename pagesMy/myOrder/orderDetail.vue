<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<customTop title="订单详情" :isBack="true" bgHeight="800rpx" bgSrc='/static/newStatic/1.png'></customTop>
		<!-- #endif -->
		<view class="pos-r">
			<view class="orderItem">
				<view class="u-flex u-row-between">
					<view class="u-font-48 font-weight text-333333">订单概述</view>
					<view class="text-E54350" v-if="dataSource.publicityFlag == 1">投递体验单</view>
				</view>
				<view class="u-flex  u-col-top margin-col-30">
					<view class="" style="flex-shrink: 0;">
						<image @click="xunHelper.previewImage(0,[dataSource.afterPic])" class="picture"
							:src="xunHelper.detectUrl(dataSource.afterPic)" mode=""></image>
					</view>
					<view class="u-m-l-20 u-flex-1">
						<view class=" u-flex  u-row-between width-100 u-font-36 font-weight text-333333 ">
							<text>{{dataSource.wasteName}}</text>
							<view>
								<text class="u-font-32">￥</text>
								<text style="font-size: 50rpx;">{{dataSource.sendPrice || dataSource.totalPrice}}</text>
							</view>
						</view>
						<view class="u-font-28" style="color: #A8A6B3;">
							{{xunHelper.weightK(dataSource.totalWeight)}}千克X{{dataSource.wastePrice || '--'}}元/千克
						</view>
					</view>
				</view>

				<view class="text-E54350 u-flex u-row-right"
					v-if="dataSource.sendStatus > 1 && dataSource.sendPrice > 0">
					<text class="u-font-32">违规扣除金额</text>
					<view class="u-m-l-30">
						<text>-￥</text><text class="font-weight" style="font-size: 52rpx;">{{weiGuiPrice()}}</text>
					</view>
				</view>

			<view class="border-tope1e1e1 u-font-28" style="color: #A8A6B3;">
					<view class="u-flex u-row-between margin-col-30">
						<text>订单号</text>
						<text class="text-333333">{{dataSource.orderSn}}</text>
					</view>
					<view class="u-flex u-row-between u-m-b-30" v-if="dataSource.basePrice != null">
						<text>投递金额</text>
						<text class="text-333333">￥{{dataSource.basePrice}}</text>
					</view>
					<view class="u-flex u-row-between u-m-b-30" v-if="dataSource.bonusPrice != null">
						<text>环保补贴金额</text>
						<text class="text-333333">￥{{dataSource.bonusPrice}}</text>
					</view>
					<view class="u-flex u-row-between margin-col-30">
						<text>发放状态</text>
						<text class="text-333333">{{filterStatusText(dataSource.sendStatus)}}</text>
					</view>
					<view class="u-flex u-row-between u-m-b-30">
						<text>创建时间</text>
						<text class="text-333333">{{dataSource.createTime}}</text>
					</view>
					<view>
						<view class="u-flex u-row-between u-m-b-30" v-if="dataSource.sendStatus == 4">
							<text>处理人</text>
							<text class="text-333333">{{dataSource.markUserName}}</text>
						</view>
						<view class="u-flex u-row-between u-m-b-30" v-if="dataSource.sendStatus > 1">
							<text>{{dataSource.sendStatus == 2?'发放时间':'处理时间'}}</text>
							<text
								class="text-333333">{{dataSource.sendStatus==4?dataSource.revocationTime:dataSource.sendTime }}</text>
						</view>
						<view class="u-flex u-row-between u-m-b-30" v-if="dataSource.sendStatus > 2">
							<text>处理备注</text>
							<text class="text-333333">{{dataSource.markRemark || ''}}</text>
						</view>
						<view class="u-flex u-row-between u-m-b-30" v-if="dataSource.sendStatus > 2">
							<text>违规照片</text>
							<view class="" style="flex-shrink: 0;">
								<image v-for="(item,index) in dataSource.markImages"
									@click="xunHelper.previewImage(0,dataSource.markImages)" class="picture"
									:src="xunHelper.detectUrl(item)" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="border-tope1e1e1 u-flex u-row-center text-333333 u-p-t-30" @click="open">
					<image src="/static/newStatic/14.png" style="width: 27rpx;height: 27rpx" mode="widthFix"></image>
					<text class="u-font-28 font-weight u-m-l-20">联系客服</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		orderDetail
	} from '@/api/index.js'
	export default {
		data() {
			return {
				id: '',
				dataSource: {}
			}
		},
		onLoad(res) {
			if (res.id) {
				this.id = res.id
			}
			this.getOrderDetail()
		},
		computed: {
			info() {
				return this.$store.state.settings.global.system || {}
			},
		},
		methods: {
			filterStatusText(val) {
				switch (val) {
					case '1':
						return '待发放'
						break;
					case '2':
						return '已发放'
						break;
					case '3':
						return '取消发放'
						break;
					case '4':
						return '撤回发放'
						break;
					default:
						break;
				}
			},
			weiGuiPrice() {
				if (this.$u.test.isEmpty(this.dataSource.sendPrice)) {
					return this.dataSource.totalPrice
				} else if (this.dataSource.sendPrice - this.dataSource.totalPrice > 0) {
					return (this.dataSource.sendPrice - this.dataSource.totalPrice).toFixed(2)
				}
			},
			topPrice() {
				if (this.dataSource.sendStatus == 1) {
					return this.dataSource.totalPrice
				} else {
					if (this.$u.test.isEmpty(this.dataSource.sendPrice)) {
						return this.dataSource.totalPrice
					} else {
						return (this.dataSource.sendPrice - this.dataSource.totalPrice).toFixed(2)
					}
				}
			},
			open() {
				uni.makePhoneCall({
					phoneNumber: this.info.phone
				})
				// return
				// uni.showModal({
				// 	title: '联系客服',
				// 	showCancel: false,
				// 	content: '客服电话： ' + this.info.phone,
				// 	success: (res => {})
				// });
			},
			filterUnitPrict() {
				let unitPirce = (this.dataSource.totalPrice / (this.dataSource.totalWeight / 1000)).toFixed(2)
				if (isNaN(unitPirce)) {
					return 0
				}
				return unitPirce
			},
			getOrderDetail() {
				orderDetail({
					id: this.id
				}).then(res => {
					if (res.code == 200) {
						this.dataSource = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.text-E54350 {
		color: #E54350;
	}

	page {
		background-color: #F6F7FB;
		/* #ifdef MP-ALIPAY */
		padding-top: 50rpx;
		background-image: url('/static/newStatic/1.png');
		background-size: 100% 800rpx;
		background-repeat: no-repeat;
		/* #endif */
	}

	.orderItem {
		min-height: 500rpx;
		width: 690rpx;
		padding: 30rpx 40rpx;
		background-color: #fff;
		border-radius: 30rpx;
		margin-left: 30rpx;
		margin-bottom: 24rpx;
		
		.time {
			color: #7B7B7B;
			font-size: 24rpx;
		}

		.picture {
			width: 156rpx;
			height: 156rpx;
			border-radius: 30rpx;
		}

		.detailBtn {
			width: 196rpx;
			height: 58rpx;
			text-align: center;
			line-height: 56rpx;
			color: #333;
			font-size: 26rpx;
			font-weight: bold;
			border-radius: 12rpx;
			border: 1px solid #333333;
			margin-top: 30rpx;
		}
	}
</style>