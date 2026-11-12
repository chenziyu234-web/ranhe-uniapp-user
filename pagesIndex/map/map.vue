<template>
	<view class="map-content">
		<view class="nav" :style="{paddingTop: menuButton.top + 'px'}">
			<!-- #ifdef MP-WEIXIN -->
			<image @click="toback" class="map-back" src="/static/16.png"></image>
			<!-- #endif -->
			<view class="switch" :style="{ '--translatex': translatex }">
				<view class="switch-left" @click="switchType(0)" :style="{color: show ? '#fff':''}">列表</view>
				<view class="switch-right" @click="switchType(1)" :style="{color: !show ? '#fff':''}">地图</view>
			</view>
		</view>
		<view class="list" v-if="show">
			<u-tabs active-color="#000" bar-width="76" bg-color="#F6F7FB" :list="list" :is-scroll="false" :current="current" @change="change">
			</u-tabs>
			<view v-if="current==0" class="swiper-box">
				<mescroll-comp-item ref="mescrollItem" type="distance"></mescroll-comp-item>
			</view>
			<view v-else class="swiper-box">
				<mescroll-comp-item ref="mescrollItem" type="deliveryNumber"></mescroll-comp-item>
			</view>
		</view>
		<view class="map" style="position: relative;" v-show="!show">

			<map id="map" class="map" style="width: 750rpx;" :style="{height: height}" :latitude="latitude"
				:longitude="longitude" :markers="markers" :show-compass="true" @regionchange="regionchange"
				@markertap="anchorpointtap">
				
			</map>
			<view class="status">
				<view class="status-item">
					<!-- <view class="status-item-spot"></view> -->
					<image src="../static/19.png" class="mapicon" mode="widthFix"></image>
					<view>可投</view>
				</view>
				<view class="status-item">
					<!-- <view class="status-item-spot backColorY"></view> -->
					<image src="../static/17.png" class="mapicon" mode="widthFix"></image>
					<view>即将满仓</view>
				</view>
				<view class="status-item">
					<!-- <view class="status-item-spot backColorY"></view> -->
					<image src="../static/manyi.png" class="mapicon" mode="widthFix"></image>
					<view>满仓</view>
				</view>
				<view class="status-item">
					<!-- <view class="status-item-spot backColorR"></view> -->
					<image src="../static/18.png" class="mapicon" mode="widthFix"></image>
					<view>不可投</view>
				</view>
			</view>
			<view class="info" :style="{height: marInfo.id ? '' : '150rpx'}">
			
				<view class="icons">
					<view class="location"
						@click="aim({latitude: userLocation.latitude,longitude: userLocation.longitude})">
						<image src="/pagesIndex/static/dw.png" mode="widthFix"></image>
					</view>
					<view class="gohere" v-show="marInfo.id" @click="toMap">
						<image src="/pagesIndex/static/20.png" mode="widthFix"></image>
						到这去
					</view>
				</view>
				<view class="robot" v-show="marInfo.id" @click="toDetail">
					<view class="robot-left">
						<machine-status :status="marInfo.useStatus || 5" :lineStatus="marInfo.lineStatus"></machine-status>
						<view v-show="marInfo.deliveryNumber!=0&&marInfo.deliveryNumber"
							class="u-font-20 u-m-l-10 u-p-t-10" style="color: red;">
							投过{{marInfo.deliveryNumber}}次</view>
					</view>
					<view class="robot-right">
						<view class="u-line-2 u-font-36 font-weight">
							{{marInfo.villageName+marInfo.position}}
						</view>
						<view class="u-flex u-row-between u-m-t-28 u-m-b-30" style="color: #666;">
							<text class="u-m-r-20">{{marInfo.parentsName}}</text>
							<text>{{marInfo.distanceText}}</text>
						</view>
						<view class="u-flex u-row-between" style="color: #999;">
							<view>
								<text :style="{color: marInfo.useStatus!=1&&marInfo.useStatus!=2 ? 'red':''}">
									{{xunHelper.useStatus(marInfo.useStatus,marInfo.lineStatus)}}</text>
							</view>
							<view v-show="marInfo.lineStatus != 2 && (marInfo.useStatus == 1 || marInfo.useStatus == 2)" @click.stop="boxTo" class="u-flex u-row-center font-weight button" :style="{border: marInfo.useStatus!=1&&marInfo.useStatus!=2 ? '1px solid #333':'',
									color:marInfo.useStatus!=1&&marInfo.useStatus!=2 ? '#333':''}">
								{{xunHelper.useStatusBtn(marInfo.useStatus)}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="main-view">
				<image src="/static/index/12.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import MescrollCompMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-comp.js";
	import {
		getDeliverList
	} from '@/api/index.js'
	const iCsure = '/pagesIndex/static/17.png'
	const iCsoon = '/pagesIndex/static/18.png'
	const iCnot = '/pagesIndex/static/19.png'
	const iCmanyi = '/pagesIndex/static/manyi.png'
	export default {
		mixins: [MescrollCompMixin], // 使用mixin
		data() {
			return {
				translatex: "0rpx", //列表tips
				latitude: null,
				longitude: null,
				markers: [], //地图标记点
				marInfo: {}, //地图设备详情
				current: 0,
				show: true,
				list: [{
					name: '附近的回收机'
				}, {
					name: '投过的回收机'
				}],
				flog: true,
				userLocation: {
					latitude: null,
					longitude: null,
				}
			}
		},
		computed: {
			menuButton() {
				return this.$store.state.user.menuButton || {}
			},
			height() {
				let nav = this.menuButton.top + this.menuButton.height + 15
				return 'calc(100vh - ' + nav + 'px)'
			}
		},
		async onLoad() {
			uni.getLocation({
				// #ifdef MP-WEIXIN
				type: 'gcj02', //国测局坐标
				// #endif
				success: (res) => {
					// this.longitude = '114.23087'
					// this.latitude = '22.730498'
					// this.userLocation = {
					// 	longitude: '114.23087',
					// 	latitude: '22.730498'
					// }
					this.longitude = res.longitude
					this.latitude = res.latitude
					this.userLocation = {
						longitude: res.longitude,
						latitude: res.latitude
					}
				}
			});
			this.getMap()
		},
		onReady() {
			this._mapContext = uni.createMapContext("map", this);
		},
		methods: {
			regionchange(e) { //地图视野发生变化
				// console.log(e);
				// if (this.flog && e.type == 'end' && e.causedBy !== "update" && this.current == 0) { //视野移动
				// 	console.log('111');
				// 	uni.showLoading({
				// 		title: '加载中..'
				// 	})
				// 	this.flog = false
				// 	this.longitude = e.detail.centerLocation.longitude
				// 	this.latitude = e.detail.centerLocation.latitude
				// 	this.getMap()
				// 	uni.hideLoading()
				// 	setTimeout(() => {
				// 		this.flog = true
				// 	}, 1000)
				// }
			},
			boxTo() {
				if (this.marInfo.useStatus == '1' || this.marInfo.useStatus == '2') {
					this.toMap()
				} else {
					this.toDetail()
				}
			},
			toDetail() { //跳转详情页
				uni.navigateTo({
					url: `/pagesIndex/deviceDetail/deviceDetail?id=${this.marInfo.id}&lon=${this.marInfo.lon}&lat=${this.marInfo.lat}`,
					fail: (e) => {
						console.log(e);
					}
					
				})
			},
			toMap() {
				if (!this.marInfo.id) return this.$u.toast('请先选择回收机')
				let obj = {
					name: this.marInfo.parentsName+this.marInfo.villageName+this.marInfo.position,
					lat: this.marInfo.lat,
					lon: this.marInfo.lon
				}
				console.log(obj,'2222222222222222')
				this.xunHelper.toMap(obj)
			},
			// tab栏切换
			change(index) {
				if (index === 1) {
					this.checkLogIn(() => {
						this.current = index;
					})
					return
				}
				this.current = index;
			},
			anchorpointtap(e) { //点击标记点
				console.log(e.type);
				if (e.type == "markertap" || e.type == "markerTap") { //点击标记点
					uni.showLoading({
						title: '加载中..'
					})
					setTimeout(() => {
						let index = e.markerId - 1 //点击标记点的下标
						this.marInfo = this.markers[index].obj //下方设备信息框赋值
						uni.hideLoading()
					}, 600)
				}
				if (this.flog && e.type == 'end' && e.causedBy !== "update" && this.current == 0) { //视野移动
					uni.showLoading({
						title: '加载中..'
					})
					this.flog = false
					this.longitude = e.detail.centerLocation.longitude
					this.latitude = e.detail.centerLocation.latitude
					this.getMap()
					uni.hideLoading()
					setTimeout(() => {
						this.flog = true
					}, 1000)
				}
			},
			toback() { //返回
				uni.navigateBack({})
			},
			switchType(index) { //switch切换
				if (index === 0) {
					this.translatex = `0px`;
					this.show = true
					this.current = 0
				} else if (index === 1) {
					this.getMap()
					this.translatex = `150rpx`;
					this.show = false
				}
			},
			aim(obj) { //将屏幕中心定在点位上
				this._mapContext.moveToLocation({
					longitude: Number(obj.longitude),
					latitude: Number(obj.latitude),
					success: (res => {})
				})
			},
			getMap() { //获取设备位置
			const that = this
				getDeliverList({
					pageNum: 1,
					pageSize: 2000,
					lon: this.longitude,
					lat: this.latitude,
					isAsc: 'ascending',
					orderByColumn: 'distance' //'deliveryNumber'
				}).then(res => {
					let arr = res.data //数组去重
					// let arr = this.unique(res.data, 'lat', 'lon') //数组去重
					let mar = [] //map.markers需要直接赋值，push数据可能不生效
					arr.forEach((item, index) => {
						let obj = {
							id: index + 1, //id
							latitude: item.lat, //纬度
							longitude: item.lon, //经度
							title: item.villageName + item.position,
							iconPath: that.iconShow(item), //显示的图标
							width: 23,
							height: 44,
							// callout: {
							// 	display: "BYCLICK",
							// 	content: item.villageName + item.position,
							// 	padding: 10,
							// 	textAlign: 'center'
							// },
							obj: { //设备信息
								...item
							}
						}
						mar.push(obj)
					})
					this.markers = mar
				})
			},
			iconShow(data){
				// console.log(data,'dta')
				if(data.lineStatus == 2){
					return iCsoon
				}else{
					// const IconUrl = data.useStatus == 1 ? iCnot : data.useStatus == 2 ? iCsure : iCsoon
					if (data.useStatus == 1) {
						return iCnot
					} else if(data.useStatus == 2){
						return iCsure
					}else if( data.useStatus == 3){
						return iCmanyi
					}else{
						return iCsoon
					}
					
				}
			},
			unique(arr, val, val2) { //数组去重
				const res = new Map()
				return arr.filter((item) =>
					(!res.has(item[val]) && !res.has(item[val2])) &&
					(res.set(item[val], 1) && res.set(item[val2], 1))
				)
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F6F7FB;
	}

	.map,
	.map-content {
		flex: 1;

		.main-view {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 70rpx;
			height: 70rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.nav {
		padding: 0 20rpx 30rpx;
		width: 500rpx;
		display: flex;
		justify-content: space-between;
		/* #ifdef MP-ALIPAY */
		width: 100%;
		justify-content: center;
		padding-top: 40rpx;
		/* #endif */

		.switch {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 300rpx;
			height: 70rpx;
			background-color: #fff;
			border-radius: 40rpx;
			text-align: center;
			position: relative;
			box-shadow: 0rpx 0rpx 8rpx 0rpx #a3a3a3;


			.switch-left,
			.switch-right {
				width: 50%;
				z-index: 1;
			}
		}
	}

	.switch::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		background-color: $theme-color;
		border-radius: 35rpx;
		width: 150rpx;
		height: 70rpx;
		transform: translateX(var(--translatex));
		transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
		z-index: 0;

	}


	.status {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		width: 180rpx;
		height: 290rpx;
		background-color: rgba(255, 255, 255, .7);
		border-radius: 20rpx;
		padding: 20rpx;
		font-size: 24rpx;
		float: right;
		box-shadow: 0rpx 0rpx 8rpx 0rpx #a3a3a3;

		.status-item {
			width: 100%;
			display: flex;
			align-items: center;
			padding: 10rpx 0rpx;

			.status-item-spot {
				width: 30rpx;
				height: 30rpx;
				background-color: $theme-color;
				border: solid 1rpx #333333;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			.mapicon{
				width: 22rpx;
				height: 44rpx;
				margin-right: 8rpx;
			}

			.backColorY {
				background-color: #FFCC02;
			}

			.backColorR {
				background-color: #FE4258;
			}
		}
	}

	.info {
		width: 750rpx;
		height: 500rpx;
		position: fixed;
		bottom: 10rpx;
		padding: 0rpx 30rpx;

		.icons {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;

			.location {
				width: 80rpx;
				height: 80rpx;
				background-color: #ffffff;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				box-shadow: 0rpx 0rpx 8rpx 0rpx #a3a3a3;

				image {
					width: 60rpx;
					height: 60rpx;
				}
			}

			.gohere {
				width: 136rpx;
				height: 136rpx;
				background-color: #ffffff;
				border-radius: 20rpx;
				box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(0, 0, 0, 0.16);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				image {
					width: 44rpx;
					height: 44rpx;
				}
			}
		}


		.robot {
			width: 100%;
			height: 300rpx;
			max-height: 340rpx;
			background-color: #ffffff;
			border-radius: 8rpx;
			display: flex;
			padding: 40rpx 30rpx;
			margin-top: 20rpx;
			box-shadow: 0rpx 0rpx 8rpx 0rpx #a3a3a3;

			.robot-left {
				padding: 0rpx 20rpx 0rpx 4rpx;

			}

			.robot-right {
				width: calc(100% - 100rpx);
			}
		}
	}

	.swiper-box {
		padding: 0rpx 30rpx 0rpx;

		.machine {
			display: flex;
			padding: 40rpx 30rpx 30rpx;
			width: 690rpx;
			background-color: #ffffff;
			border-radius: 20rpx;
			margin-top: 20rpx;

			.machine-right {
				width: calc(100% - 100rpx);
				padding-left: 30rpx;

				.item-button {
					border: 1rpx solid #4fdaf9;
					border-radius: 15rpx;
					color: #4fdaf9;
					width: 200rpx;
					height: 60rpx;
				}
			}
		}

	}

	.button {
		border: 1px solid $theme-color;
		border-radius: 8rpx;
		color: $theme-color;
		width: 200rpx;
		height: 60rpx;
	}

	.map-back {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		box-shadow: 0rpx 0rpx 8rpx 0rpx #a3a3a3;
	}
</style>
