<template>
	<view style="overflow: hidden;">
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view style="width: 100%;height:400rpx ">
				<image :src="getImg()" style="width: 100%;height:400rpx " mode="widthFix"></image>
			</view>
			<view class="margin-30" style="margin-bottom: 170rpx;">
				<view class="section">
					<view class="u-flex u-row-around">
						<view class="u-flex u-row-between">
							<view class="u-flex-col u-col-center">
								<text class="price u-p-b-10"
									style="font-size: 44rpx;">{{topData.totalCount || 0}}</text>
								<text class="txt2 u-font-24">推荐好友(人)</text>
							</view>
						</view>
						<view style="width: 1px;height:72rpx;background-color: rgba(42,159,78,0.1);"></view>
						<view class="u-flex u-row-between">
							<view class="u-flex-col u-col-center">
								<text class="price u-p-b-10"
									style="font-size: 44rpx;">{{topData.totalMoney || 0}}</text>
								<text class="txt2 u-font-24">我的收益(元)</text>
							</view>
						</view>
					</view>
					<view class="u-m-t-30"
						style="background: linear-gradient( 180deg, #E2FEEB 0%, #C8F8D7 100%);border-radius: 30rpx;padding: 20rpx 20rpx;">
						<image src="/pagesMy/static/bg2.png" style="width: 580rpx;height: 106rpx" mode="widthFix">
						</image>
					</view>
				</view>

				<view class="section2">
					<u-tabs :list="tabList" bgColor="transparent" :activeItemStyle="activeItemStyle" activeColor="#333"
						inactiveColor="#999999" fontSize="32" :is-scroll="true" :current="current"
						@change="change"></u-tabs>

					<view class="u-m-t-20">
						<view v-for="(item,index) in list" :key="index"
							class="item u-flex u-row-between u-col-center u-border-bottom padding-col-20">
							<view class="u-flex u-col-center">
								<u-avatar :src="item.avatar" size="64"></u-avatar>
								<view class="text-333333 font-weight u-font-32 u-m-l-10 u-p-b-10">{{item.nickname}}
								</view>
							</view>
							<view class="u-font-28 text-333333" v-if="current == 0">
								{{item.createTime}}
							</view>
							<view class="u-font-28 text-333333" v-if="current == 1">
								获得奖励：<text class="price">+{{item.totalMoney || 0}}</text>
							</view>
						</view>
					</view>
				</view>

			</view>
			<view class="btn">
				<u-button shape="square" hoverClass="none" @click="openPoster"
					:customStyle="customStyle">生成专属海报</u-button>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		publicityListApi,
		publicityDataApi
	} from '@/api/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				list: [],
				topData: {},
				current: 0,
				tabList: [{
						name: '推荐记录',
						value: ''
					},
					{
						name: '奖励记录',
						value: '3'
					}
				],

				customStyle: {
					backgroundColor: '#2A9F4E',
					color: '#fff',
					height: '92rpx',
					width: '644rpx'
				},
				activeItemStyle: {
					fontWeight: 'bold',
					fontSize: '36rpx'
				}
			}
		},
		onLoad() {
			this.publicityData()
		},
		methods: {
			getImg() {
				const imgUrl = this.publicityConfig.ossPublicityImg || this.publicityConfig.publicityImg ||
					""
					console.log(this.publicityConfig)
				return imgUrl ? this.xunHelper.detectUrl(imgUrl) : ""  
			},


			openPoster() {
				uni.navigateTo({
					url: '/pagesMy/poster/poster'
				})
			},
			publicityData() {
				publicityDataApi({}).then(res => {
					if (res.code == 200) {
						this.topData = res.data
					}
				})
			},
			downCallback() { //下拉回调
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				let pageSize = page.size
				let pageNum = page.num
				publicityListApi({
					pageNum,
					pageSize,
					status: this.tabList[this.current].value
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
			change(e) {
				this.current = e
				this.downCallback()
			}
		},
		computed: {
			publicityConfig() {
				return this.$store.state.user.publicityConfig || {}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FAFAFA;
	}

	.price {
		color: #FF2D46;
	}

	.txt2 {
		color: #935D3C;
	}

	.section {
		background: #FCFEFD;
		border-radius: 30rpx 30rpx 30rpx 30rpx;
		padding: 30rpx;
	}

	.section2 {
		padding: 30rpx 20rpx;
		background-color: #fff;
		border-radius: 30rpx;
		margin-top: 30rpx;
	}

	.btn {
		position: fixed;
		background-color: #fff;
		width: 100%;
		padding: 30rpx 50rpx;
		bottom: 0;
		z-index: 99;
	}

	.item {}
</style>