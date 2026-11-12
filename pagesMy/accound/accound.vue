<template>
	<view>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
			<!-- #ifdef MP-WEIXIN -->
			<customTop :bg="background" title="提现" :isBack="true">
			</customTop>
			<!-- #endif -->
			<view class="accound-view u-flex u-row-between pos-r u-m-t-30">
					<view>
						<view>可提现金额(元)</view>
						<view class="text-333333 u-font-28"><text class=" font-weight"
								style="font-size: 60rpx;">{{nowMoney || '0.00'}}</text>元</view>
					</view>
					<view class="accoundBtn" @click="accound">去提现</view>
				</view>
			<!-- 提现规则 -->
			<view class="rules-view">
				<view class="rules-title font-weight">提现规则</view>
				<view class="rules-item">
					<text class="rules-label">提现次数</text>
					<text class="rules-value">每日最多 5 次</text>
				</view>
				<view class="rules-item">
					<text class="rules-label">提现时间</text>
					<text class="rules-value">全天可申请</text>
				</view>
				<view class="rules-item">
					<text class="rules-label">到账时间</text>
					<text class="rules-value">审核通过后 1~3 天内到账</text>
				</view>
			</view>
			<view class="u-p-30">
				<view class="item u-flex u-row-between u-col-center" v-for="(item,index) in list" :key="index">
					<view class="font-weight u-font-28 u-p-b-10">
						<view>{{item.description}}</view>
						<view style="color: #999; font-size: 24rpx;">{{item.createTime}}</view>
					</view>
					<view class="font-weight">
						<view style="color: #333;">
							{{item.types==1?'+':item.types==2?'-':''}}{{item.changeMoney}}
						</view>
						<view class="u-font-24 " style=" text-align: right; color: #7B7B7B;">
							余额：{{item.currentMoney}}
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		homeData,
		billsList
	} from '@/api/user.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				background: {
					backgroundColor: '#fff'
				},
				nowMoney:'',
			list: []
		}
	},
	onLoad() {
			this.reloadInfo()
		},
		methods: {
			reloadInfo() {
				homeData().then(res =>{
					this.nowMoney = res.data.nowMoney
				})
			},
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			upCallback(page) {
				let pageSize = page.size
				let pageNum = page.num
				billsList({
					pageNum,
					pageSize
				}).then(res => {
					let curPageData = res.data || []
					if (page.num == 1) this.list = [];
					this.list = this.list.concat(curPageData);
					this.mescroll.endByPage(curPageData.length, curPageData.length + 10);
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
			toBack() {
				uni.switchTab({
					url: '/pages/me/index'
				})
			},
			accound() {
				uni.navigateTo({
					url: '/pagesMy/withdrawal/withdrawal'
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fafafa;
	}

	.accound-view {
		width: 690rpx;
		height: 192rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 10rpx 40rpx 2rpx rgba(0, 0, 0, 0.05);
		border-radius: 30rpx 30rpx 30rpx 30rpx;
		margin-left: 30rpx;
		padding: 36rpx 30rpx;

		.accoundBtn {
			width: 188rpx;
			height: 64rpx;
			background: #4E80FF;
			border-radius: 32rpx 32rpx 32rpx 32rpx;
			font-size: 28rpx;
			color: #fff;
			text-align: center;
			line-height: 64rpx;
		}
	}

	.rules-view {
		width: 690rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 10rpx 40rpx 2rpx rgba(0, 0, 0, 0.05);
		border-radius: 20rpx;
		margin-left: 30rpx;
		margin-top: 20rpx;
		padding: 10rpx 30rpx;

		.rules-title {
			font-size: 28rpx;
			color: #333;
			padding: 20rpx 0;
		}

		.rules-item {
			display: flex;
			justify-content: space-between;
			padding: 16rpx 0;
			border-top: 1rpx solid #F2F2F2;
			font-size: 26rpx;

			.rules-label {
				color: #999;
			}

			.rules-value {
				color: #333;
			}
		}
	}

	.item {
		background: #FFFFFF;
		box-shadow: 0rpx 10rpx 40rpx 2rpx rgba(0, 0, 0, 0.05);
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
</style>
