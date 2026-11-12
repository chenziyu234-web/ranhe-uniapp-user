<template>
	<view>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
			<!-- #ifdef MP-WEIXIN -->
			<customTop :bg="background" title="提现" bgHeight="800rpx" bgSrc='/static/newStatic/5.png' :isBack="true"></customTop>
			<!-- #endif -->
			<view class="accound-view u-flex u-row-between pos-r u-m-t-30">
				<view>
					<view>可提现金额(元)</view>
					<view class="text-333333 u-font-28"><text class=" font-weight"
							style="font-size: 60rpx;">{{nowMoney.totalMoney || '0.00'}}</text>元</view>
				</view>
				<view class="accoundBtn" @click="showAccount = true">去提现</view>
			</view>
			<view class="u-p-30">
				<view class="item u-flex u-row-between u-col-center" v-for="(item,index) in list" :key="index">
					<view class="font-weight u-font-28 u-p-b-10">
						<view>{{item.description}} <text v-if="item.publicityFlag == 1"> - 提现体验权益</text></view>
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
			<u-modal v-model="showAccount" title="提现方式" :mask-close-able="true"
				:title-style="{fontSize:'40rpx',fontWeight:'bold',color:'#333'}" :showConfirmButton="false" >
				<view class="slot-content  ">
					<view class="u-flex u-row-between margin-30">
						<view class="u-flex accountItem accountItem1 u-flex-1">
							<image style="width: 40rpx;height: 40rpx" src="/static/newStatic/6.png" mode=""></image>
							<text class="u-m-l-10">微信提现</text>
							<image class="checkedImg" src="/static/newStatic/8.png"></image>
						</view>
						<view class="u-flex accountItem accountItem2 u-flex-1 u-m-l-30" v-if="isCardCash">
							<image style="width: 40rpx;height: 40rpx" src="/static/newStatic/7.png" mode=""></image>
							<text class="u-m-l-10">银行卡提现</text>
						</view>
					</view>
					<view :style="confirmStyle" class="u-m-l-40 u-m-b-40" @click="accound">确定</view>
				</view>
			</u-modal>
		</mescroll-body>
		<u-modal title="满15元可提现" v-model="show" :content="info"></u-modal>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		withdrawList,
		agentbillsList
	} from '@/api/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				background: {
					backgroundColor: 'transparent'
				},
				confirmStyle:{
					width:'520rpx',
					height:'88rpx',
					background:'#4E80FF',
					textAlign:'center',
					lineHeight:'88rpx',
					borderRadius:'44rpx',
					color:'#fff',
					fontWeight:'bold',
					fontSize:'32rpx'
				},
				showAccount: false,
				show: false,
				info: null,
				list: [],
				nowMoney: ''
			}
		},
		// computed: {
		// 	menuButton() {
		// 		return this.$store.state.user.menuButton || {}
		// 	},
		// 	homeData() {
		// 		return this.$store.state.user.homeData || {}
		// 	},
		// 	isCardCash(){
		// 		return this.$store.getters.global.withdraw.isCardCash
		// 	}
		// },
		onPageScroll(e) {
			let a = (1 - (100 - e.scrollTop) / 100).toFixed(2)
			this.background.backgroundColor = "rgba(255,255,255," + a + ")"
		},
		onShow() {
			this.nowMoney = uni.getStorageSync('agentMsg')
		},
		methods: {
			toBack() {
				uni.switchTab({
					url: '/pages/me/index'
				})
			},
			accound() {
				uni.navigateTo({
					url: '/pagesMy/withdrawal/withdrawalAgent'
				})
				this.showAccount = false
			},
			downCallback() { //下拉回调
				this.mescroll.resetUpScroll()
			},
			// getAgent(){
				
			// },
			upCallback(page) {
				//联网加载数据
				let pageSize = page.size
				let pageNum = page.num
				agentbillsList({
					pageNum,
					pageSize
				}).then(res => {
					let curPageData = res.rows
					if (page.num == 1) this.list = [];
					this.list = this.list.concat(curPageData);
					this.mescroll.endByPage(curPageData.length, curPageData.length + 10);
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fafafa;
	}

	.accountItem {
		height: 88rpx;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.checkedImg{
		width: 54rpx;
		height: 54rpx;
		position: absolute;
		right:0;
		bottom: 0;
	}
	.accountItem1 {
		border: 1px solid #4E80FF;
		color: #4E80FF;
	}

	.accountItem2 {
		border: 1px solid #999999;
		color: #999999;
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

	.left-icon-view {
		width: 10rpx;
		height: 30rpx;
		background-color: $theme-color;
		margin-right: 10rpx;
		border-radius: 5rpx;
	}

	.nav {
		width: 100%;
		height: 540rpx;
		position: relative;
		background-color: $theme-color;
		color: #FFF;

		.nav-bg {
			width: 100%;
			height: 540rpx;
			position: absolute;
			top: 0;
		}

		.nav-view {
			position: absolute;
			top: 10rpx;

			.info {
				width: 750rpx;
				text-align: center;
				padding-top: 40rpx;

				.num {
					font-size: 72rpx;
				}
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

	.button {
		width: 224rpx;
		height: 72rpx;
		border-radius: 8rpx;
		border: solid 2rpx rgba(255, 255, 255, 0.5);
		margin: auto;
		text-align: center;
		line-height: 72rpx;
		font-size: 32rpx;
	}
</style>