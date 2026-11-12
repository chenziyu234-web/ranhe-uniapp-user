<template>
	<view class="background over-hidden">
		<!-- #ifdef MP-WEIXIN -->
		<nav-bg-fit title="帮助中心"></nav-bg-fit>
		<!-- #endif -->
		<view class="content margin-row-30 u-flex u-row-between">
			<view class="help-box u-flex-col u-row-center u-text-center" @click="newsList(85)">
				<image src="/pagesIndex/static/31.png" mode="widthFix"></image>
				<view class="u-m-t-20" :style="{fontWeight: id==85?'bold':''}">投递规范</view>
			</view>
			<view class="help-box u-flex-col u-row-center u-text-center" @click="newsList(86)">
				<image src="/pagesIndex/static/32.png" mode="widthFix"></image>
				<view class="u-m-t-20" :style="{fontWeight: id==86?'bold':''}">账户与提现</view>
			</view>
			<view class="help-box u-flex-col u-row-center u-text-center" @click="newsList(87)">
				<image src="/pagesIndex/static/33.png" mode="widthFix"></image>
				<view class="u-m-t-20" :style="{fontWeight: id==87?'bold':''}">回收机</view>
			</view>
		</view>
		<view class="issue u-m-l-30 u-m-t-26 padding-row-30 u-p-t-40" style="margin-bottom: 150rpx;">
			<view class="titless u-font-32 font-weight">
				<text class="u-m-l-20">常见问题</text>
			</view>
			<view class="u-flex u-row-between u-p-t-36 u-p-b-36" :style="{borderTop: index==0?'':'1rpx solid #e1e1e1'}"
				v-for="(item,index) in list" :key="index" @click="todetail(item)">
				<view class="">{{item.title}}</view>
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view style="position: fixed; bottom: 54rpx; left: 50%; transform: translateX(-50%);">
			<view class="service u-flex u-row-center">
				<image src="/pagesIndex/static/78.png" mode="widthFix"></image>
				<text class="u-m-l-10 text-theme" @click="open">客服帮助</text>
			</view>
			<view class="u-font-24 u-m-t-10">
				<text>服务时间：{{info.serviceTime}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		newsList
	} from '@/api/index.js'
	export default {
		data() {
			return {
				list: [],
				id: null
			}
		},
		computed: {
			info() {
				return this.$store.state.settings.global.system || {}
			},
		},
		onLoad() {
			this.newsList(85)
		},
		methods: {
			open() {
				uni.makePhoneCall({
					phoneNumber:this.info.phone
				})
				return
				uni.showModal({
					title: '联系客服',
					showCancel: false,
					content: '客服电话： ' + this.info.phone,
					success: (res => {})
				});
			},
			newsList(id) {
				this.id = id
				newsList({
					categoryId: id,
					pageNum: 1,
					pageSize: 100
				}).then(res => {
					this.list = res.rows
				})
			},
			toBack() {
				uni.navigateBack({})
			},
			todetail(item) {
				uni.navigateTo({
					url: `/pages/singPage/singPage?id=${item.id}&type=2`
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}
	
	.content {
		position: relative;
		z-index: 1;
		margin-top: -100rpx;
		background-color: #fff;
		border-radius: 8rpx;
		/* #ifdef MP-ALIPAY */
		margin-top: 40rpx;
		/* #endif */
	}

	.help-box {
		width: 205rpx;
		height: 185rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
	}
	.titless{
		display: flex;
		align-items: center;
		height: 30rpx;
		margin: 0 0 20rpx;
		border-left: 10rpx solid $theme-color;
	}
	.help-box image {
		margin: 0 auto;
		height: 60rpx;
		width: 60rpx;
	}

	.issue {
		width: 690rpx;
		// padding: 20r;
		background-color: #ffffff;
		border-radius: 8rpx;
	}

	.service image {
		width: 32rpx;
		height: 32rpx;
	}
</style>
