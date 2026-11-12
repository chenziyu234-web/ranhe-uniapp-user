<template>
	<view>
		<!-- <view class="nav u-m-b-30">
			<u-navbar :background="{background:'#F6F7FB'}" :borderBottom="false" :customBack="{fontWeight:'bold'}">
				<view class="u-flex padding-row-30">
					<text class="u-font-34 font-weight">我的设备</text>
				</view>
			</u-navbar>
		</view> -->
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" >
			<view v-if="showMode == 0" class="u-m-t-20">
				<view v-for="(item,index) in list" :key="index" @click="toDetail(item)" class="orderItem">
					<view class="u-flex u-row-between u-p-b-30">
						<view class="u-font-24 text-333333">{{item.villageName}}</view>
						<!-- <view class="time ">
							{{item.createTime}}
						</view> -->
						
					</view>
					<view class="u-flex  u-col-top margin-col-20">
						<view class="" style="flex-shrink: 0;">
							<image class="picture" v-if="!$u.test.isEmpty(item.afterPic)" :src="xunHelper.detectUrl(item.afterPic)" mode="widthFix"></image>
							<image class="picture" v-else src="/static/empImg.png" mode="widthFix"></image>
						</view>
						
						<view class="u-font-24 font-weight text-333333 u-m-l-20">
							<view>位置名称：<text>{{item.position}}</text></view>
							<view>设备编号：<text>{{item.code}}</text></view>
							<view>设备地址：<text>{{item.villageAddress}}</text></view>
							<view>设备状态：<text>{{item.lineStatus==1?'在线':'离线'}}</text></view>
						</view>
					</view>
					<!-- <view class="u-flex u-row-right font-weight text-333333 u-col-bottom">
						<text class="u-font-36 u-m-b-10">￥</text>
						<text class="" style="font-size: 60rpx;">{{item.totalPrice}}</text>
					</view> -->
					<!-- <view class="u-flex u-row-right">
						<view class="detailBtn">查看订单详情</view>
					</view> -->
				</view>
			</view>

		</mescroll-body>
		<!-- <u-select v-model="showTime" :list="timeList" @confirm="confirmTime"></u-select> -->
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		deviceList,
	} from '@/api/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				timeName: '全部',
				timeValue: '',
				currentMenu: 0,
				menuList: [{
					name: '回收机',
					value: 0
				}, {
					name: "上门回收",
					value: 1
				}, ],
				showMode: 0,
				current: 0,
				list: [],
			}
		},
		onLoad() {},
		methods: {

			downCallback() { //下拉回调
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				let query = {
					pageSize: page.size,
					pageNum: page.num,
				}
				let apiUrl = deviceList
				apiUrl(query).then(res => {
					let curPageData = res.data ? res.data : res.rows
					if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(curPageData).map(item => {
						return {
							show: false,
							...item
						}
					}); //追加新数据
					this.mescroll.endByPage(curPageData.length, curPageData.length + 10);
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			change(index) {
				this.current = index;
				this.downCallback()
			},
		}
	}
</script>

<style lang="scss">
	.selectBtn {
		width: 174rpx;
		height: 64rpx;
		line-height: 62rpx;
		text-align: center;
		border: 1px solid #999;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #333;
	}

	.orderItem {
		// min-height: 500rpx;
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

	page {
		background-color: #F6F7FB;
	}

	.nav {
		margin: 0 100rpx;
	}

	.views {
		width: 100%;
		height: 242rpx;
	}

	.text {
		width: 100%;
		padding: 20rpx 0 0;
		border-top: 1rpx solid #e1e1e1;

		.text1 {
			width: 100%;
			padding: 20rpx;
			background-color: #e6fafe;
		}
	}

	.parent {
		width: 364rpx;
		height: 74rpx;
		margin: 30rpx auto;
		border-radius: 44rpx;
		border: solid 1px $theme-color;
		color: $theme-color;

		view {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 50%;
			height: 100%;
		}

		.left {
			border-top-left-radius: 44rpx;
			border-bottom-left-radius: 44rpx;
		}

		.right {
			border-top-right-radius: 44rpx;
			border-bottom-right-radius: 44rpx;
		}

		.active {
			color: #fff;
			background-color: $theme-color;
		}
	}

	.item {
		width: calc(100% - 60rpx);
		margin: auto;
		padding: 20rpx;
		margin-top: 20rpx;
		background-color: #ffffff;
		box-shadow: 0 0 8rpx 0 #e1e1e1;
		border-radius: 20rpx;

		.time {
			width: 100%;
			padding: 20rpx 0rpx 0;
			// border-top: 1rpx solid #e1e1e1;
			font-size: 28rpx;
			color: #999999;
		}

		.title {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.title-icon-image {
				width: 32rpx;
				height: 32rpx;
				-webkit-animation: animal 1s;
				-webkit-animation-fill-mode: forwards;
			}

			@-webkit-keyframes animal {
				0% {
					transform: rotate(0deg);
				}

				100% {
					transform: rotate(-180deg);
				}
			}

			.title-icon-image1 {
				-webkit-animation: animal1 1s;
				-webkit-animation-fill-mode: forwards;
			}

			@-webkit-keyframes animal1 {
				0% {
					-webkit-transform: rotate(-180deg);
				}

				100% {
					-webkit-transform: rotate(0deg);
				}
			}
		}

		.info {
			padding: 20rpx 0rpx;

			.info-item {
				width: 100%;
				display: flex;
				padding: 16rpx 0rpx;

				.info-item-label {
					width: 150rpx;
					font-size: 28rpx;
					color: #999999;
				}

				.info-item-name {
					width: calc(100% - 190rpx);
					font-size: 28rpx;
					color: #333333;
				}
			}
		}
	}
</style>