<template>
	<view class="box over-hidden">
		<!-- #ifdef MP-WEIXIN -->
		<view>
			<customTop :bg="background" title="回收机站点详情" :isBack="true" bgHeight="800rpx"
				bgSrc='/static/newStatic/5.png'></customTop>
		</view>
		<!-- #endif -->
		
		<view class="pos-r margin-row-30" style="margin-bottom: 100rpx;" v-if="loading">
			<view class="top-view u-flex u-row-center u-col-center u-m-b-20">
				<image :src="topBanner.image" mode="widthFix"></image>
			</view>

			<view class="section-view">
				<view class="u-flex u-row-between u-col-top">
					<machine-status :status="map.useStatus"></machine-status>
					<view class="u-flex-col u-row-between u-m-l-20" style="min-height: 160rpx;">
						<view class="u-line-2 u-font-32 text-333333 font-weight">{{map.villageName+map.position}}</view>
						<view>
							<view class="u-font-24 text-333333 u-m-b-10"><text>{{map.parentsName}}</text><text
									class="u-m-l-10">{{map.villageName}}</text></view>
							<view class="u-font-20" style="color: #2A9F4E;">快去投递吧</view>
						</view>
					</view>
					<view class="u-flex-col u-col-center u-row-center" style="flex-shrink: 0;" @click="toMap">
						<view style="background-color: #FD542D;border-radius: 20rpx;padding: 5rpx 10rpx;"
							class="u-font-20 font-weight text-white">{{map.distanceText}}</view>
						<view class="u-flex u-row-center u-col-center u-m-t-10"
							style="width: 48rpx;height: 48rpx;border-radius: 50%;background-color: #F6F6F6">
							<image src="/static/newStatic/10.png" style="width: 24rpx;height: 24rpx" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<view class="section-content-view u-m-t-20" @click="jemp">
					<view class="u-flex u-row-between u-m-b-20">
						<text class="u-font-28 text-333333 font-weight">回收指南-我们回收那些</text>
						<view class="u-font-24" style="color: #7B7B7B;">
							<text>分类小科普</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="u-flex u-row-between">
						<!-- <view class="card-item u-flex-col u-row-between" v-for="(item,index) in cardList">
							<text>{{item.name}}</text>
							<image src="/static/newStatic/4.png" style="width: 22rpx;height: 22rpx" mode=""></image>
							<image class="image" src="/static/newStatic/2.png" mode=""></image>
						</view> -->
						<image :src="centerBanner.image" style="width: 100%;height: 160rpx" mode="widthFix"></image>
					</view>
				</view>

				<view class="serve u-flex-col u-m-t-30" v-for="(item,index) in priceParam" :key="index">
					<view class=" font-weight ">
						<view class="u-flex u-row-between">
							<text>服务时间：</text>
							<text>00:00 ~ 24:00</text>
						</view>
					</view>
					<view class="u-flex u-row-between u-m-t-30">
						<view class="font-weight">回收价格<text class="u-font-22 u-m-l-10">{{item.title}}</text></view>
						<view class=""><text class="u-font-36 font-weight">{{item.price}}</text><text
								class="u-font-24">元1千克</text>
						</view>
					</view>
				</view>
			</view>

			<view class="section-view u-flex u-row-between u-m-t-20">
				<text>我在此累计投递</text>
				<view><text class="u-font-32 font-weight">{{map.memberDeliverNumber}}</text>次 <text
						class="margin-row-10">|</text><text
						class="u-font-32 font-weight">{{xunHelper.weightK(map.memberDeliverWeight)}}</text>千克
				</view>
			</view>

			<view class="help u-flex u-row-center u-m-t-30 u-p-b-60" @click="toInfo">
				<image src="/static/me/47.png" mode="widthFix"></image>
				<text class="u-font-24 u-m-l-6 text-666666">查看帮助中心</text>
			</view>
		</view>
		<view class="fixedBtn" v-if="!$u.test.isEmpty(map)">
			<view class="button" @click="scan" :style="{backgroundColor: (map.useStatus <3 || map.lineStatus!=2)  ?'#00B3E0':'#666'}">
				{{(map.useStatus <3 || map.lineStatus!=2) ?'扫码开门':'不可投'}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDeliverDetail,
		bannerList
	} from '@/api/index.js'
	import { scanFromCamera } from '@/common/utils/scanFlow.js'
	export default {
		data() {
			return {
				background: {
					backgroundColor: 'transparent'
				},
				loading: false,
				cardList: [{
						name: '纸'
					},
					{
						name: '金属'
					},
					{
						name: '塑料'
					},
					{
						name: '织物'
					}
				],
				img: [{
						url: '/pagesIndex/static/76.png',
						name: '纸板'
					},
					{
						url: '/pagesIndex/static/74.png',
						name: '金属'
					},
					{
						url: '/pagesIndex/static/75.png',
						name: '塑料'
					},
					{
						url: '/pagesIndex/static/77.png',
						name: '织物'
					},
				],
				map: {},
				priceParam: [],
				q: '',
				topBanner: [],
				centerBanner: []
			}
		},
		onPageScroll(e) {
			let a = (1 - (100 - e.scrollTop) / 100).toFixed(2)
			this.background.backgroundColor = "rgba(255,255,255," + a + ")"
		},
		onLoad(option) {
			this.getBannerList()
			uni.getLocation({ //获取位置
				success: (res) => {
					this.longitude = res.longitude
					this.latitude = res.latitude
					let query = {
						lon: res.longitude,
						lat: res.latitude
					}
					if (option.q) {
						this.q = option.q
						query.equipmentId = decodeURIComponent(option.q).split("?id=")[1]
						this.getDeliverDetail(query)
						return
					}
					query.equipmentId = option.id
					this.getDeliverDetail(query)
				}
			});

		},
		computed: {
			menuButton() {
				return this.$store.state.user.menuButton || {}
			}
		},
		methods: {
			getBannerList() {
				bannerList({
					categoryId: 7
				}).then(res => {
					if (res.rows.length > 0) {
						this.topBanner = res.rows[0]
					}
				})
				bannerList({
					categoryId: 8
				}).then(res => {
					if (res.rows.length > 0) {
						this.centerBanner = res.rows[0]
					}
				})
			},
			scan() {
				if (this.map.useStatus > 2 || this.map.lineStatus == 2) return
				scanFromCamera()
			},
			toMap() {
				let obj = {
					name: this.map.parentsName + this.map.villageName + this.map.position,
					lat: this.map.lat,
					lon: this.map.lon
				}
				this.xunHelper.toMap(obj)
			},
			getDeliverDetail(query) {
				uni.showLoading({

				})
				getDeliverDetail(query).then(res => {
					uni.hideLoading()
					this.loading = true
					this.map = res.data
					this.priceParam = this.map.priceParam
				}).catch(e => {
					uni.hideLoading()
				})
			},
			toMachineDetails() {
				// return
				// this.checkLogIn(() => {
				// 	uni.navigateTo({
				// 		url: `/pagesIndex/community/community?id=${this.map.id}&lon=${this.map.lon}&lat=${this.map.lat}`
				// 	})
				// })
			},
			jemp() {
				uni.navigateTo({
					url: `/pages/singPage/singPage?id=${7}`
				})
			},
			toInfo() {
				uni.navigateTo({
					url: '/pagesIndex/helpCenter/helpCenter'
				})
			},
			toBack() {
				if (this.q) {
					uni.switchTab({
						url: '/pages/index/index'
					})
					return
				}
				uni.navigateBack({})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F6F5F5;
	}


	.button {
		display: inline-block;
		width: 345rpx;
		height: 88rpx;
		border-radius: 50rpx;
		margin: auto;
		text-align: center;
		line-height: 88rpx;
		color: #fff;
		font-size: 32rpx;
		margin-top: 10rpx;
	}

	.fixedBtn {
		display: flex;
		position: fixed;
		bottom: 0;
		height: 120rpx;
		background-color: #fff;
		width: 100%;
		justify-content: space-between;
		align-items: center;
	}

	.card-item {
		padding: 10rpx 20rpx;
		width: 142rpx;
		height: 150rpx;
		background: #FFFFFF;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		opacity: 1;
		position: relative;

		.image {
			position: absolute;
			width: 98rpx;
			height: 60rpx;
			right: 0;
			bottom: 0;
		}
	}

	.top-view {
		width: 690rpx;
		// height: 240rpx;
		background: #FFFFFF;
		border-radius: 30rpx 30rpx 30rpx 30rpx;
		opacity: 1;
		border-radius: 20rpx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
		}
	}

	.section-view {
		width: 690rpx;
		min-height: 60rpx;
		background: #FFFFFF;
		border-radius: 30rpx 30rpx 30rpx 30rpx;
		opacity: 1;
		padding: 38rpx 22rpx;

		.section-content-view {
			background: #F6F6F6;
			padding: 22rpx 18rpx;
			border-radius: 20rpx;
		}
	}


	.btm-view {
		position: relative;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 20rpx auto;
		width: 224rpx;
		height: 72rpx;
		border-radius: 8rpx;
		border: solid 2rpx rgba(255, 255, 255, 0.5);
		color: #fff;
	}

	.nav-view {
		position: relative;
		width: 100%;
		border-bottom-left-radius: 120rpx;

		image {
			position: absolute;
			top: 0;
			width: 100%;
		}
	}

	.recoverable-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 20rpx;

		image {
			width: 78rpx;
			height: 78rpx;
		}
	}

	.record {
		padding-left: 30rpx;

		.img-margin {
			margin-left: -20rpx;
		}

		image {
			width: 46rpx;
			height: 46rpx;
		}
	}

	.detail {
		position: relative;
		z-index: 11;
	}

	.status-sure {
		height: 162rpx;
		background-color: $theme-color;
	}

	.status-not {
		height: 162rpx;
	}

	.color-fff {
		color: #fff;
	}

	.status-red {
		// height: 484rpx;
		background-color: #FE475E;
	}

	.nav image {
		width: 58rpx;
		height: 58rpx;
	}

	.operation {
		width: 202rpx;
		height: 59rpx;
		border-radius: 8rpx;
		border: solid 2rpx #ffffff;
	}

	.location {
		margin: 0 30rpx;
		width: 690rpx;
		background-color: #fff;
		border-radius: 8rpx;
		padding-bottom: 40rpx;
	}

	.goThe {
		width: 120rpx;
		height: 120rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
		border: solid 2rpx #333333;
	}

	.goThe image {
		height: 37rpx;
		width: 37rpx;
	}

	.color {
		color: #666;
	}

	.margin {
		margin-bottom: 10rpx;
	}

	.serve {
		min-height: 102rpx;
		background-color: #ffffff;
	}

	.recoverable {
		padding: 40rpx 30rpx 0;
		margin: 20rpx 0 0 30rpx;
		width: 690rpx;
		height: 297rpx;
		background-color: #ffffff;
		border-radius: 8rpx;
	}

	.help image {
		height: 30rpx;
		width: 30rpx;
	}
</style>
