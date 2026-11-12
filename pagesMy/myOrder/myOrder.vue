<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="nav u-m-b-30">
			<u-navbar :background="{background:'#F6F7FB'}" :borderBottom="false" :customBack="{fontWeight:'bold'}">
				<view class="u-flex padding-row-30">
					<text class="u-font-34 font-weight">投递记录</text>
					<view class="selectBtn u-m-l-30" @click="openTime">
						{{timeName}}
						<u-icon name="arrow-down"></u-icon>
					</view>
				</view>
			</u-navbar>
			<u-tabs bgColor="#F6F7FB" active-color="#000" bar-width="60" bar-height="2" name="cate_name"
				:list="menuList" :is-scroll="false" :current="showMode" @change="showModeChange" />
		</view>
		<!-- #endif -->
		
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view>
			<view v-for="(item,index) in list" :key="index" @click="toDetail(item)" class="orderItem">
				<!-- 第一层：卡片头部 -->
				<view class="u-flex u-row-between card-header">
					<view class="time">{{item.createTime}}</view>
					<view class="status-text">{{item.sendStatusText}}</view>
				</view>
				<!-- 第二层：卡片主体，左图右文 -->
				<view class="u-flex u-col-top card-body">
					<view style="flex-shrink: 0;">
						<image class="picture" v-if="!$u.test.isEmpty(item.afterPic)"
							:src="xunHelper.detectUrl(item.afterPic)" mode="aspectFill"></image>
						<image class="picture" v-else src="/static/empImg.png" mode="aspectFill"></image>
					</view>
					<view class="card-info">
						<view class="card-title u-line-2">{{item.villageName}}</view>
						<view class="u-flex u-row-between u-col-center card-bottom">
							<view class="price">
								<text class="price-symbol">￥</text>
								<text class="price-num">{{item.totalPrice}}</text>
							</view>
							<view class="detailBtn">查看订单详情</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		</mescroll-body>
		<u-select v-model="showTime" :list="timeList" @confirm="confirmTime"></u-select>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		memberDeliveryList
	} from '@/api/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				timeName: '全部',
				timeValue: '',
				showTime: false,
				currentMenu: 0,
				menuList: [{
				name: '回收机',
				value: 0
			}],
				showMode: 0,
				current: 0,
				list: [],
				timeList: [{
					label: '全部',
					value: ''
				}, {
					label: '最近三个月',
					value: '3'
				}]
			}
		},
		onLoad() {},
		methods: {
			toDetail(item) {
				uni.navigateTo({
					url: '/pagesMy/myOrder/orderDetail?id=' + item.id
				})
			},
			confirmTime(e) {
				this.timeName = e[0].label
				this.timeValue = e[0].value
				this.downCallback()
			},
			openTime() {
				this.showTime = true
			},
			showModeChange(type) {
				this.showMode = type
				this.downCallback()
			},

			downCallback() { //下拉回调
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
			let query = {
				pageSize: page.size,
				pageNum: page.num,
				lastMonth: this.timeValue
			}
			memberDeliveryList(query).then(res => {
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
		width: 690rpx;
		padding: 24rpx 30rpx;
		background-color: #fff;
		border-radius: 30rpx;
		margin-left: 30rpx;
		margin-bottom: 24rpx;

		.card-header {
			margin-bottom: 24rpx;
		}

		.time {
			color: #999;
			font-size: 24rpx;
		}

		.status-text {
			font-size: 24rpx;
			color: #4E80FF;
		}

		.picture {
			width: 128rpx;
			height: 128rpx;
			border-radius: 16rpx;
			margin-right: 20rpx;
		}

		.card-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			min-height: 128rpx;
		}

		.card-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}

		.card-bottom {
			margin-top: 16rpx;
		}

		.price {
			color: #FF4D4F;

			.price-symbol {
				font-size: 24rpx;
			}

			.price-num {
				font-size: 36rpx;
				font-weight: bold;
			}
		}

		.detailBtn {
			background-color: #4E80FF;
			color: #fff;
			font-size: 24rpx;
			border-radius: 999rpx;
			padding: 8rpx 24rpx;
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