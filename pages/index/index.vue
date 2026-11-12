<template>
	<view class="index-view">
		<view class="banner-wrap">
			<image src="/static/homeV2/banner-top.png" mode="widthFix" style="width:100%;display:block"></image>
			<view class="banner-scan-btn" @click="scanOpenBox">扫码回收</view>
		</view>
		<view class="pos-r ">

			<view style="background-color: #fff;width: 702rpx;margin-left: 24rpx;border-radius: 24rpx;margin-top: -93rpx;position: relative;z-index: 2;">
				<view style="padding: 24rpx 24rpx 10rpx 24rpx;" v-if="deliverList.length > 0">
					<machine-list :list="deliverList"></machine-list>
				</view>
				<view style="padding: 24rpx 24rpx 0 24rpx;height: 180rpx;"
					class="u-font-28 text-999999 u-flex u-row-center u-col-center" v-else>
					<view v-if="location&&location.longitude">
						您的附近没有回收机~
					</view>
					<view class="location-empty" v-else>
						<image class="location-empty-icon" src="/static/Location.png"></image>
						<view class="text">请先授权位置信息。<text @tap="getLocation" class="location-empty-button"> 去授权> </text>
						</view>
					</view>
				</view>

				<view class="section-view">
					<view style="overflow:hidden;width:654rpx;height:170rpx;margin:5rpx auto 0;border-radius:16rpx 16rpx 0 0;">
						<map style="width:654rpx;height:170rpx;border-radius:16rpx 16rpx 0 0;" name=""
							:latitude="location.latitude" :longitude="location.longitude"></map>
					</view>
					<!-- <view class="u-font-24 text-666666 text-center u-m-t-30" @click="toMap">
						{{currentCity || '附近'}}将近<text class="text-theme">{{totalLength}}</text>台回收机
						<u-icon name="arrow-right"></u-icon>
					</view> -->
					<view class="u-font-24 text-center u-m-t-20" @click="toMap">
						<text style="color:#999;">附近有</text><text class="text-theme">{{totalLength}}</text><text style="color:#999;">台回收机</text>
						<u-icon name="arrow-right" color="#999" size="24"></u-icon>
					</view>
				</view>
			</view>

			<!-- 扫码开箱按钮 -->
		<view class="scan-btn" @click="scanOpenBox">
			<image class="scan-btn-icon" src="/static/homeV2/icon-scan.png" mode="aspectFit"></image>
			<text class="scan-btn-text">扫码开箱</text>
		</view>

		<!-- 8宫格分类（静态写死，不绑跳转） -->
		<view class="category-card">
			<view class="category-grid">
				<view class="category-item">
					<image class="category-icon" src="/static/homeV2/clothes.png" mode="aspectFit"></image>
					<text class="category-text">四季衣物</text>
				</view>
				<view class="category-item">
					<image class="category-icon" src="/static/homeV2/plush-toy.png" mode="aspectFit"></image>
					<text class="category-text">毛绒玩具</text>
				</view>
				<view class="category-item">
					<image class="category-icon" src="/static/homeV2/hat.png" mode="aspectFit"></image>
					<text class="category-text">帽子围巾</text>
				</view>
				<view class="category-item">
					<image class="category-icon" src="/static/homeV2/bedding.png" mode="aspectFit"></image>
					<text class="category-text">床上用品</text>
				</view>
				<view class="category-item">
					<image class="category-icon" src="/static/homeV2/shoes.png" mode="aspectFit"></image>
					<text class="category-text">鞋子包包</text>
				</view>
				<view class="category-item">
					<image class="category-icon" src="/static/homeV2/curtain.png" mode="aspectFit"></image>
					<text class="category-text">窗帘地毯</text>
				</view>
				<view class="category-item">
					<image class="category-icon" src="/static/homeV2/cushion.png" mode="aspectFit"></image>
					<text class="category-text">坐垫靠垫</text>
				</view>
				<view class="category-item">
					<image class="category-icon" src="/static/homeV2/fabric.png" mode="aspectFit"></image>
					<text class="category-text">日用织物</text>
				</view>
			</view>
		</view>

		<view style="height: 120rpx;"></view>

		<!-- 甲方需求：暂时隐藏关于我们宫格 2026-06 -->
			<!--
			<view class="  padding-20 u-m-b-30 margin-row-30" style="background-color: white;border-radius: 10rpx">
				<view class="font-weight text-333333 u-font-32">关于我们</view>
				<view class="u-flex u-row-between">
					<view class="u-flex-col  u-col-center u-p-t-20" @click="toSlot(4)">
						<image src="/static/index/17.png" style="width: 120rpx;height: 90rpx" mode="widthFix"></image>
						<text class="u-font-24 text-333333 u-p-t-10">关于我们</text>
					</view>
					<view class="u-flex-col  u-col-center u-p-t-20" @click="toSlot(23)">
						<image src="/static/index/18.png" style="width: 120rpx;height: 90rpx" mode="widthFix"></image>
						<text class="u-font-24 text-333333 u-p-t-10">产品介绍</text>
					</view>
					<view class="u-flex-col  u-col-center u-p-t-20" @click="toSlot(24)">
						<image src="/static/index/19.png" style="width: 120rpx;height: 90rpx" mode="widthFix"></image>
						<text class="u-font-24 text-333333 u-p-t-10">招商</text>
					</view>
				</view>
			</view>
			-->
		</view>
		<!-- 隐私政策 -->
		<!-- <CustomPrivacy isAutomatic></CustomPrivacy> -->
		<u-tabbar :list="tabbarList" active-color="#00B3E0"></u-tabbar>
		
		<!--弹窗-->
		<view class="tcBox" v-if="showTc == 2" @click="showTc = 3">
			<view class="imgCont">
				<image :src="tcData.cover" mode="widthFix" @click.stop="goNext"></image>
				<view class="" style="text-align: center; margin-top: 40rpx;">
					<uni-icons type="closeempty" color="#fff" size="50rpx" @click.stop="closeTc"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/config.js'
	const {
		mapkey
	} = config
	import {
		getDeliverList as getDeliverListApi,
		bannerList,
		addressEdit,
		recycleOrdertypeList,
		bindPublicityApi,
		getRecycleStatus,
		getAdByPosition
	} from '@/api/index.js'
	import {
		noReadCount
	} from '@/api/user.js'
	import {
		commonLocation
	} from "@/api/public.js"
	import {
		getDistance
	} from "@/common/utils/tools.js"
	import {
		consumePendingScan,
		scanFromCamera,
		startScanFlow
	} from '@/common/utils/scanFlow.js'
	// var QQMapWX = require('@/common/qqmap-wx/qqmap-wx-jssdk.js');
	// import {
	// 	QQMapWX
	// } from '@/common/qqmap-wx/qqmap-wx-jssdk.js';
	// var qqmapsdk;
	// qqmapsdk = new QQMapWX({
	// 	key: 'YF3BZ-ACILF-PPQJN-J6CUO-STNJK-WVBJD'
	// });
	export default {
		data() {
			return {
				blist: [],
				currentCity: '',
				geoInfo: {}, //高德逆地址结果
				recycleConfig: null,
				totalLength: 0,
				deliverList: [],
				showTc: false,
				background: {
					backgroundColor: 'transparent'
				},
				guideList: [{
						image: '/static/index2/c1.png',
						name: "在线预约"
					},
					{
						name: null
					},
					{
						image: '/static/index2/c2.png',
						name: "免费上门"
					},
					{
						name: ''
					},
					{
						image: '/static/index2/c3.png',
						name: "完成订单"
					},
					{
						name: ''
					},
					{
						image: '/static/index2/c4.png',
						name: "手机提现"
					},

				],
				noReadCount: 0,
				city: '',
				tcData:{},
				query: {
					tenantId: null,
					addressId: null, //地址id
					preWeight: null, //预估重量	”10-20“
					preTime: null, //预约上门时间	”2022-08-09 12：00“
					remarks: '', //备注	”东西很杂，需要分拣“
					enterDoor: null, //是否需要进门
					needBag: '2', //是否需要袋子或绳子
					recycleTypeIds: [], //多选类型
					recycleType: [] //暂存类型信息，页面展示使用，下单时删除
				},
				preWeight: '', //显示使用
				recycleType: '', //显示使用

				pickerValue: [0, 0, 0],
				// 分类选择
				typeList: [],
				// 重量选中
				weightList: [
					// {
					// 	label: '10~30公斤',
					// 	value: '10-30'
					// },
					{
						label: '30~50公斤',
						value: '30-50'
					},
					{
						label: '50~100公斤',
						value: '50-100'
					},
					{
						label: '100~200公斤',
						value: '100-200'
					},
					{
						label: '200公斤以上',
						value: '200-0'
					},
				],
				funList_2: [{
						icon: '/static/index2/f1.png',
						name: '纸壳类'
					},
					{
						icon: '/static/index2/f2.png',
						name: '纺织类回收'
					},
					{
						icon: '/static/index2/f3.png',
						name: '金属类回收'
					},
					{
						icon: '/static/index2/f4.png',
						name: '塑料回收'
					},
					{
						icon: '/static/index2/f5.png',
						name: '扫码投递',
						path: 'sancode'
					},
					{
						icon: '/static/index2/f6.png',
						name: '附近设备',
						path: '/pagesIndex/map/map'
					},
					{
						icon: '/static/index2/f7.png',
						name: '回收指南',
						path: "/pagesIndex/helpCenter/helpCenter"
					},
					{
						icon: '/static/index2/f8.png',
						name: '帮助中心',
						path: '/pagesIndex/helpCenter/helpCenter'
					},
				],
			}
		},
		onPageScroll(e) {
			let a = (1 - (100 - e.scrollTop) / 100).toFixed(2)
			this.background.backgroundColor = "rgba(255,255,255," + a + ")"
		},
		watch: {
			userInfo: {
				handler: function(val) {
					if (val && val.id) {
						let id = uni.getStorageSync('publicityId')
						console.log('userinfo监听，打印id', id);
						if (id) {
							this.bindPublicity(id)
						}
					}
				},
				immediate: true
			}
		},
		computed: {
			indexTitle() {
				return this.$store.getters.global.system && this.$store.getters.global.system.userTitle || ''
			},
			getMapKey() {
				const webkeys = this.$store.getters.global.maps?.webKeys
				if (webkeys) {
					const arr = webkeys.split(",")
					const randomKey = arr[Math.floor(Math.random() * arr.length)];
					return randomKey
				}
				return mapkey
			},
			getAllMoney() {
				let nowMoney = this.userInfo.nowMoney
				let checkMoney = this.userInfo.checkMoney
				let monney = (nowMoney + checkMoney).toFixed(2)
				if (isNaN(monney)) return '0.00'
				return monney
			},
			homeData() {
				return this.$store.state.user.homeData || {}
			},
			audit() {
				return this.$store.getters.global.online_audit?.alipayAuditOpen
			},
			menu() {
				return this.$store.state.user.menuButton || {}
			},
			navHeight() {
				return this.menu.bottom - this.menu.top
			},
			location() {
				return this.$store.state.user.location || {}
			},
			getrecycleType() {
				return this.recycleType.slice(0, 12) + "..."
			},
			loginStatus() {
				return this.$store.getters.loginStatus
			},
			userinfo() {
				return this.$store.state.user.userInfo || {}
			},
			publicityConfig(){
				return this.$store.state.user.publicityConfig
			},
			preTimeList() {
				let date = new Date()
				let years = date.getFullYear()
				let month = date.getMonth() + 1
				month = month < 10 ? '0' + month : month
				let days = date.getDate()
				days = days < 10 ? '0' + days : days
				let hours = date.getHours()
				hours = hours < 10 ? '0' + hours : hours
				let iLength = 0 //判断是否是晚上
				if (Number(hours) >= 22 || Number(hours) < 9) iLength = 1
				let dateList = [] //年月日处理
				for (let i = iLength; i < 3 + iLength; i++) {
					dateList.push({
						label: month + '月' + ((Number(days) + i) < 10 ? ('0' + (Number(days) + i)) : (
							Number(days) + i)) + '日',
						value: years + '-' + month + '-' + ((Number(days) + i) < 10 ? ('0' + (Number(days) + i)) :
							(Number(days) + i))
					})
				}
				let hoursList = [] //小时处理
				for (let i = 0; i < 12; i++) {
					hoursList.push({
						label: (i + 9) + '时',
						value: i == 0 ? '09' : i + 9
					})
				}
				let minuteList = [{
					label: '整点',
					value: '00'
				}] //分钟处理
				for (let i = 1; i < 6; i++) {
					minuteList.push({
						label: (i * 10) + '分',
						value: i * 10
					})
				}
				if (iLength == 0) {
					let arr = hoursList.filter(item => {
						return Number(item.value) > Number(hours)
					})
					let list0 = hoursList.forEach((item, index) => {
						if (Number(item.value) == Number(arr[0].value)) {
							this.pickerValue = [0, index, 0]
						}
					})
				}
				return [dateList, hoursList, minuteList]
			}
		},
		onShow() {
			this.getNearList()
			this.$nextTick(() => {
				consumePendingScan()
			})
			// 首页恢复时仅刷新已授权的位置，避免打断登录或扫码。
			this.getLocation(false)
		},
		onPullDownRefresh() {
			if (this.loginStatus) {
				this.$store.dispatch('user/getUserInfo')
				this.$store.dispatch('user/getHomeData')
				this.getLocation()
			}
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1500);
		},
		onLoad(option) {
			// console.log(option,'option11111111')
			this.getbannerList()
			const that = this
			var dataQc, dataUrl
			// #ifdef MP-WEIXIN
			dataQc = option
			dataUrl = option?.q
			// #endif
			// #ifdef MP-ALIPAY
			dataQc = getApp().globalData.qrcode?.query
			dataUrl = dataQc?.qrCode
			// #endif
			// console.log(dataQc, 'dataQc11111111')

			if (!dataQc) return

			if (dataQc.scene) { //通邀请人id绑定   微信小程序码进入
				let scene = decodeURIComponent(dataQc.scene)
				let memberId = scene.split("member_id=")[1]
				let publicityId = scene.split("publicity_id=")[1]
				let offline = scene.split("offline-promotion=")[1]
				// console.log(memberId,'memberId1111111111')
				// console.log(publicityId,'publicityId1111111111')
				// console.log(offline,'offline1111111111')
				if(memberId != undefined && memberId != null && memberId != ''){
					uni.setStorageSync('promoterId', memberId)
				}else if(publicityId != undefined && publicityId != null && publicityId != ''){
					uni.setStorageSync('publicityId', publicityId)
					// console.log('宣传人员id', publicityId);
				}else{
					uni.setStorageSync('offline', offline)
					// console.log('地推人员id', RpublicityId);	
				}
			}
			if (dataQc.member_id) { //通过右上角分享进入
				uni.setStorageSync('promoterId', dataQc.member_id)
			}
			const s = uni.getStorageSync("geoinfo")
			if (s && new Date().getTime() - s.time <= 10 * 60 * 1000) {
				that.geoInfo = s
			}
			// this.getbannerList()
			that.$nextTick(() => { // 微信普通 HTTPS 二维码进入，原始链接交给后端解析。
				if (dataUrl) {
					let scanValue = dataUrl
					try {
						scanValue = decodeURIComponent(dataUrl)
					} catch (error) {
						console.warn('二维码参数解码失败，使用原始值', error)
					}
					startScanFlow(scanValue)
				}
			})
		},
		methods: {
			goNext(){
				// console.log(999999999999999999)
				this.showTc = 3
				if(this.tcData.type == 2){
					uni.navigateTo({
						url: this.tcData.targetUrl
					})
				}else if(this.tcData.type == 1){
					wx.navigateToMiniProgram({
						appId: this.tcData.appId,
						path: this.tcData.targetUrl
					})
				}
			},
			closeTc(){
				this.showTc = 3
			},
			getTc(){
				// console.log(this.showTc,'showTc1111111111111111111111111')
				if(this.showTc == '3') return
				getAdByPosition({
					adPosition: 'home'
				}).then( res =>{
					if(res.data){
						this.tcData = res.data
						this.showTc = 2
					}
				})
			},
			toShop() {
				wx.navigateToMiniProgram({
					appId: 'wx45c77c751ce9365b'
				})
			},
			toTJ(){
				// console.log(this.userInfo,this.publicityConfig,'11111111111111')
				if(this.userInfo&&this.userInfo.publicityFlag == 1&&this.publicityConfig&&this.publicityConfig.isTuiJian==true){
					this.checkLogIn(() => {
						uni.navigateTo({
							url: '/pagesMy/myTuiJian/myTuiJian'
						})
					})
				}else{
					this.invite()
				}
			},
			invite() {
				uni.showToast({
					title: '功能即将上线,敬请期待！',
					icon: 'none'
				})
			},
			toSlot(id) {
				// #ifdef MP-ALIPAY
				if (id == '20' || id == '24') {
					if (this.audit != '1') {
						uni.navigateTo({
							url: `/pages/singPage/singPage?id=${id}`
						})
					} else {
						this.invite()
					}
				} else {
					uni.navigateTo({
						url: `/pages/singPage/singPage?id=${id}`
					})
				}
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: `/pages/singPage/singPage?id=${id}`
				})
				// #endif
			},
			// 轮播图
			getbannerList() {
				bannerList({
					categoryId: 2
				}).then(res => {
					this.blist = res.rows.map(item => {
						return {
							...item,
							image: this.xunHelper.detectUrl(item.image)
						}
					})
				})
			},
			toBalance() {
				uni.switchTab({
					url: '/pages/me/index'
				})
			},
			
			//获取上门回收状态
			getRecycle() {
				getRecycleStatus({
					...this.geoInfo,
					lon: this.$store.state.user.location.longitude,
					lat: this.$store.state.user.location.latitude
				}).then(res => {
					this.recycleConfig = res.data || {}
				})
			},
			geocode() {
				const recycleOpen = this.$store.getters.global?.system?.recycleOpen || false
				if (!recycleOpen || 'true' != recycleOpen) {
					return
				}
				const lon = this.$store.state.user.location.longitude
				const lat = this.$store.state.user.location.latitude
				if (this.geoInfo.township) {
					const distance = getDistance(this.geoInfo.lat, this.geoInfo.lon, lat, lon)
					if (distance < 50) {
						//50m内 不用再次请求
						this.getRecycle()
						return
					}
				}
				//调用逆地址解析
				uni.request({
					header: {
						'Content-Type': 'application/text',
					},
					//注意:这里的key值需要高德地图的 web服务生成的key  只有web服务才有逆地理编码
					url: 'https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=' +
						lon +
						',' +
						lat +
						'&key=' + this.getMapKey +
						'&radius=1000&extensions=all',
					timeout: 3000,
					success: res => {
						// console.log(res);
						if (res.statusCode === 200 && res.data.regeocode) {
							this.currentCity = res.data.regeocode.addressComponent.city
							const {
								province,
								city,
								district,
								township
							} = res.data.regeocode.addressComponent
							this.geoInfo = {
								province,
								city,
								district,
								township,
								lon: lon,
								lat: lat,
								time: new Date().getTime()
							}
							uni.setStorageSync("geoinfo", this.geoInfo)
						}
						this.getRecycle()
					},
					fail: e => {
						this.getRecycle()
					}
				})
			},
			getLocation(interactive = true) {
				uni.getSetting({
					success: (setting) => {
						var authStatus
						// #ifdef MP-WEIXIN
						authStatus = setting.authSetting['scope.userLocation'];
						if (authStatus === true) {
							// #endif
							// 已授权，
							uni.getLocation({ //获取位置
								// #ifdef MP-WEIXIN
								type: 'gcj02',
								// #endif
								success: (res) => {
									this.$store.commit('user/SET_LOCATION', {
										longitude: res.longitude,
										latitude: res.latitude,
										time: new Date().getTime()
									});
									this.getNearList()
									this.geocode()
								},
								fail: (error) => {
									console.warn("[location]", error.errMsg || "获取位置失败")
									if (interactive !== false) {
										uni.showToast({ title: "定位失败，请检查手机定位和微信位置权限", icon: "none" })
									}
								}
							});
							// #ifdef MP-WEIXIN
						} else if (authStatus === false) {
							// 已拒绝授权，需引导用户手动开启
							if (interactive !== false) this.openSetting(true)
						} else {
							// 未请求过权限，发起授权请求
							if (interactive !== false) this.openSetting(false)
						}
						// #endif
					},
					fail: (res) => {
						console.log(res, '获取地理位置失败')
					},
					complete: (res) => {
						console.log(res, '调用接口信息返回')
					}
				})

			},
			bindPublicity(id) {
				bindPublicityApi({
					publicityId: id
				}).then(res => {
					console.log('绑定', res);
				}).catch(e => {
					console.log('绑定错误信息', e);
				}).finally(() => {
					uni.setStorageSync('publicityId', '')
				})
			},
			toSlotPage() {
				uni.navigateTo({
					url: `/pages/singPage/singPage?id=3&type=2`
				})
			},
			getNearList() {
				getDeliverListApi({
					pageNum: 1,
					pageSize: 10,
					lon: this.$store.state.user.location.longitude,
					lat: this.$store.state.user.location.latitude,
					isAsc: 'ascending',
					orderByColumn: 'distance',
					distance: 10
				}).then(res => {
					this.deliverList = res.data
					this.totalLength = res.msg
					if (res.data.length == 0) {
						this.getHasList()
					}
					this.getTc()
				}).catch(() => {
					//联网失败, 结束加载
				})
			},
			getHasList() {
				getDeliverListApi({
					pageNum: 1,
					pageSize: 10,
					lon: this.$store.state.user.location.longitude,
					lat: this.$store.state.user.location.latitude,
					isAsc: 'ascending',
					orderByColumn: 'deliveryNumber',
				}).then(res => {
					this.deliverList = res.data
				}).catch(() => {
					//联网失败, 结束加载
				})
			},
			getDeliverList() {
				this.getNearList()
			},

			//回收
			orderSubmit() {
				if (!this.recycleConfig || !this.recycleConfig.tenantId) {
					uni.showToast({
						title: '暂未开放',
						icon: 'none'
					})
				} else {
					this.checkLogIn(res => {
						this.query = Object.assign({}, this.query, this.recycleConfig)
						this.$store.commit('user/SET_RECYCLEORDER', this.query)
						uni.navigateTo({
							url: '/pagesIndex/comeDoor/comeDoor'
						})
					})
				}
			},

			toMap() {
				uni.navigateTo({
					url: '/pagesIndex/map/map'
				})
			},

			// 扫码开箱：调起扫码 → sendCommand 拿 uuid/sn → 跳 code/index 投口选择页
			scanOpenBox() {
				scanFromCamera()
			},
			tap_function(item) {
				// this.checkLogIn(() => {
				if (item.path == 'shop') {
					uni.switchTab({
						url: '/pages/integralMall/integralMall'
					})
					return
				}
				if (item.path !== 'sancode') {
					uni.navigateTo({
						url: item.path
					})
					return
				}
				scanFromCamera()
				// })
			},
			// 打开小程序设置
			openSetting(toSetting = false) {
				uni.showModal({
					title: '授权提示',
					content: '请授权查询位置信息，用于查询在您附近的回收机',
					success: (res) => {
						if (res.confirm) {
							if (toSetting) {
								// #ifdef MP-WEIXIN
								wx.openSetting({
									success: (settingRes) => {
										if (settingRes.authSetting['scope.userLocation']) {
											this.getLocation()
										}
										// console.log(settingRes);
									},
								})
								// #endif
							} else {
								// #ifdef MP-WEIXIN
								wx.authorize({
									scope: 'scope.userLocation',
									success: () => {
										this.getLocation()
										console.log("success")
									},
									fail: (e) => {
										const message = String(e.errMsg || '')
										console.warn('[location-authorization]', { errMsg: message, errno: e.errno })
										const privacyError = String(e.errno) === '112' || /privacy|scope is not declared/i.test(message)
										uni.showModal({
											title: '位置授权未完成',
											content: privacyError
												? '微信隐私指引未声明位置用途，请管理员在公众平台更新并发布隐私指引。'
												: '微信未完成位置授权，请在小程序设置中允许位置信息，并确认手机定位已开启。',
											showCancel: false
										})
									}
								});
								// #endif
							}
						}
					}
				})
			},
			// 获取当前定位
			// getLocal() {
			// 	qqmapsdk.reverseGeocoder({
			// 		location: {
			// 			latitude: this.location.latitude,
			// 			longitude: this.location.longitude
			// 		},
			// 		success: (res) => {
			// 			// console.log(res)
			// 			this.city = res.result.ad_info.city + res.result.ad_info.district
			// 			this.address = res.result.address
			// 		},
			// 		fail: (err) => {
			// 			console.log(err)
			// 		}
			// 	})
			// },

			// 富文本
			// toSingPage(id, type) {
			// 	uni.navigateTo({
			// 		url: `/pages/singPage/singPage?id=${id}&type=${type}`
			// 	})
			// },

			// 跳转消息
			// toMsg() {
			// 	this.checkLogIn(() => {
			// 		uni.navigateTo({
			// 			url: '/pagesIndex/message/inform'
			// 		})
			// 	})
			// },

		},
	}
</script>

<style lang="scss">
	.tcBox{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.7);
		z-index: 999;
		.imgCont{
			width: 80%;
		}
	}
	.location-empty {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 0;

		.location-empty-icon {
			width: 100rpx;
			height: 100rpx;
		}

		.text {
			color: #999999;
			font-size: 24rpx;
			margin-top: 30rpx;

			.location-empty-button {
				color: $theme-color;
			}
		}
	}

	.section-view {
		width: 100%;
		border-radius: 0 0 24rpx 24rpx;
		background-color: #ffffff;
		padding: 0 0 30rpx 0;
	}

	.section-view2 {
		flex: 1;
		position: relative;
		padding: 30rpx;
		font-size: 44rpx;
		font-weight: bold;
		min-height: 330rpx;
		color: #767676;
		background-color: #fff;
		border-radius: 30rpx;
		flex-shrink: 1;

		.bottomImg {
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}

	.typePupop-view {
		width: 100%;
		height: 800rpx;
		background-color: #f2f2f2;
		padding: 20rpx 20rpx 40rpx;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			height: 102rpx;
			background-color: #ffffff;
			border-radius: 8rpx;
			margin-top: 20rpx;
			padding: 20rpx;
		}
	}

	.address-left-icon1 {
		width: 16rpx;
		height: 16rpx;
		margin-right: 20rpx;
		background-color: #ff7f3f;
		border-radius: 50%;
	}

	.address-left-icon2 {
		width: 16rpx;
		height: 16rpx;
		margin-right: 20rpx;
		background-color: $theme-color;
		border-radius: 50%;
	}

	.address-left-icon3 {
		width: 16rpx;
		height: 16rpx;
		margin-right: 20rpx;
		background-color: #fdc068;
		border-radius: 50%;
	}

	.center-view {
		width: 690rpx;
		// height: 432rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 6rpx 30rpx 0rpx rgba(104, 103, 103, 0.16);
		border-radius: 16rpx;
		margin-top: 30rpx;
		padding: 20rpx;

		.button {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 88rpx;
			background-color: $theme-color;
			border-radius: 44rpx;
			color: #ffffff;
			font-weight: bold;
			font-size: 30rpx;
		}

		.time-view {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding: 30rpx 0;

			.time-left {
				display: flex;
				align-items: center;

				.time-left-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 76rpx;
					height: 30rpx;
					background-color: #ff7f3f;
					border-radius: 20rpx;
					margin-left: 10rpx;
					font-size: 18rpx;
					color: #ffffff;
				}
			}

			.time-right {

				display: flex;
				align-items: center;

				.time-right-icon {
					width: 14rpx;
					height: 24rpx;
					margin-left: 12rpx;
				}
			}
		}

		.center-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx 0 30rpx;
			// border-bottom: 1rpx solid #e1e1e1;

			.address {
				display: flex;
				align-items: center;
				font-weight: bold;
				width: 100%;
				font-size: 32rpx;

				input {
					width: calc(100% - 60rpx);
					font-size: 28rpx;
				}



			}

			.address-right-icon {
				width: 34rpx;
				height: 34rpx;
			}
		}
	}

	.guide-view {
		width: 690rpx;
		padding: 30rpx;
		margin-top: 30rpx;
		background-color: #ffffff;
		border-radius: 8rpx;

		.info-view {
			display: flex;
			// align-items: center;
			justify-content: space-evenly;
			width: 100%;

			.item-view {

				.item-view1 {
					display: flex;
					flex-direction: column;
					align-items: center;
					// width: ;
				}

				.item-view2 {
					display: flex;
					align-items: center;
					justify-content: space-around;
					width: 42rpx;
					padding-top: 30rpx;

					view {
						width: 6rpx;
						height: 6rpx;
						background-color: $theme-color;
						border-radius: 50%;
					}
				}

			}
		}

		image {
			width: 72rpx;
			height: 72rpx;
		}
	}


	.title-view {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30rpx;

		.icon {
			width: 8rpx;
			height: 30rpx;
			background-color: $theme-color;
			margin-right: 10rpx;
			border-radius: 2px;
		}
	}

	.red {
		z-index: 10;
		position: absolute;
		top: 2rpx;
		left: 40rpx;
		width: 16rpx;
		height: 16rpx;
		background-color: #ff0000;
		border-radius: 50%;
	}


	.index-view {
		min-height: 100vh;
		background-color: #F7F7F7;
	}

	.nav-view {
		width: calc(100% - 200rpx);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.swiper {
		width: 690rpx;
		height: 280rpx;
		border-radius: 12rpx;
	}

	.function-view {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 20rpx;
		padding: 5rpx;

		.function-item {
			display: flex;
			align-items: center;
			flex-direction: column;
			width: 25%;
			margin-top: 20rpx;

			image {
				width: 96rpx;
				height: 96rpx;
			}

			text {
				margin-top: 12rpx;
				letter-spacing: 0px;
				font-size: 24rpx;
				color: #333333;
				text-align: center;
			}
		}
	}

	/* banner 容器 + 叠加扫码回收按钮 */
	.banner-wrap {
		position: relative;

		.banner-scan-btn {
			position: absolute;
			left: 40rpx;
			top: 314rpx;
			width: 200rpx;
			height: 64rpx;
			line-height: 64rpx;
			border-radius: 32rpx;
			background: transparent;
			border: 1rpx solid #ffffff;
			color: #ffffff;
			font-size: 26rpx;
			text-align: center;
		}
	}

	/* 扫码开箱按钮 */
	.scan-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 702rpx;
		height: 100rpx;
		margin: 24rpx auto;
		border-radius: 16rpx;
		background: linear-gradient(90deg, #4E80FF, #30C3F7);

		.scan-btn-icon {
			width: 40rpx;
			height: 40rpx;
			margin-right: 12rpx;
		}

		.scan-btn-text {
			color: #ffffff;
			font-size: 30rpx;
			font-weight: bold;
		}
	}

	/* 8宫格分类白卡 */
	.category-card {
		width: 702rpx;
		margin: 0 auto 24rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx 0;
	}

	.category-grid {
		display: flex;
		flex-wrap: wrap;

		.category-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 25%;
			padding: 16rpx 0;

			.category-icon {
				width: 96rpx;
				height: 96rpx;
			}

			.category-text {
				margin-top: 12rpx;
				font-size: 24rpx;
				color: #333333;
			}
		}
	}
</style>
