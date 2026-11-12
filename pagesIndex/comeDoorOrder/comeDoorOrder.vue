<template>
	<view style="padding-bottom: 200rpx;">
		<view class="address-view">
			<view class="display padding-col-20">
				<view class="vw50">
					<u-icon name="map" size="34" :color="themeColor"></u-icon>
				</view>
				<view v-if="!address.id" class="calc-w70 u-flex u-row-between" @click="selectAddress">
					<text>我的上门回收地址</text>
					<u-icon name="arrow-right" color="#919191"></u-icon>
				</view>
				<view v-else class="calc-w70">
					<view class="u-line-2 u-font-30 font-weight">
						{{address.province}}{{address.city}}{{address.county}}
					</view>
					<view class=" u-flex u-m-t-20 u-row-between">
						<view class="color-999 u-font-28">
							<view>{{address.recipientAddress}}</view>
							<view class="u-p-t-10">
								<text>{{address.recipientName}}</text><text>{{address.recipientPhone}}</text>
							</view>
						</view>
						<view class="address-button display text-white" @click="selectAddress">
							<u-icon name="/pagesIndex/static/1.png" size="34"></u-icon>
							<text>地址簿</text>
						</view>
					</view>
				</view>
			</view>
			<image src="/static/bg-btn.png" class="addres-image" mode="widthFix"></image>
		</view>

		<view class="view">
			<view class="item-view u-flex u-row-between" :style="{borderTop: index==0?'0':'1px solid #e1e1e1'}"
				v-for="(item,index) in order.recycleType" :key="index">
				<text class="font-weight">{{item.name}}</text>
				<text
					style="color: #ff7f3f;">{{userInfo.roleType==1?item.price:item.companyPrice}}元/{{item.unit}}</text>
			</view>
		</view>

		<view class="view u-flex u-row-between">
			<text class="color-999">预估重量</text>
			<text>{{order.preWeight}}公斤</text>
		</view>

		<view class="view">
			<view class="padding-col-20 u-flex u-row-between border-btm">
				<text class="color-999">预约时间</text>
				<picker :value="pickerValue" @columnchange="columnchange" mode="multiSelector" :range="preTimeList"
					range-key="label" @change="pickerChange">
					<text v-if="preTime" class="spacing2">{{ preTime }}</text>
					<text v-else class="color-999">请选择预约时间</text>
					<u-icon name="arrow-right" color="#999"></u-icon>
				</picker>
			</view>
			<view class="padding-col-10 u-flex u-row-between">
				<text class="color-999">进门回收</text>
				<switch @change="switchChange" :checked="enterDoor" style="transform: scale(0.7);" :color="themeColor">
				</switch>
			</view>
		</view>

		<view class="view">
			<view class="u-tips-color u-font-28 ">备注信息</view>
			<view class="u-m-t-20 remarks">
				<textarea v-model="remarks" class="u-font-26 u-p-10 vh120" placeholder="请描述物品或您的需求"></textarea>
				<view>
					<u-upload width="140" height="140" :action="action" ref="uUpload" :header="request_heard"
						:max-count="6">
					</u-upload>
				</view>
			</view>
			<view class="remarks-text-title">快捷标签</view>
			<view class="remarks-text">
				<view class="item" v-for="(item,index) in dictdata.user_remarks_common_terms" :key="index"
					@click="setRemarks(item)">{{item.label}}</view>
			</view>
		</view>

		<view class="view">
			<view class="u-tips-color u-font-28 u-p-b-10">预约须知:</view>
			<view class="u-tips-color u-font-20">
				<view>1.免费上门收取，不另外外加费用</view>
				<view class="padding-col-10">2.旧物请自行打包，方便回收人员上门收取</view>
				<view>3.预估价仅为参考，回收价格以回收人员上门评估为准</view>
			</view>
		</view>

		<view class="flex-bottom-view">
			<view @click="submit" class="button flex-center">马上预约</view>
			<view class="display  u-m-r-20">
				<view class="u-font-28">预估价格</view>
				<view class="u-p-l-10">
					<view style="color: #ff7f3f;">
						<text class="u-font-20">￥</text>
						<text class="spacing2 u-font-28">{{predictPrice}}</text>
						<!-- <text class="u-font-24">元</text> -->
					</view>
					<view class="u-font-20 color-999">成交价格以实际评估为准</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		recycleOrdertypeList,
		recycleOrderCreate
	} from '@/api/index.js'
	export default {
		data() {
			return {
				typeList: [],
				remarks: '',
				enterDoor: true,
				preTime: null,
				pickerValue: [0, 0, 0],
				remarksMode: false
			}
		},
		computed: {
			dictdata() {
				// user_remarks_common_terms 常用语
				return this.$store.state.settings.dictdata || {}
			},
			order() { //vuex缓存的订单信息
				return this.$store.state.user.recycleOrder || {} //SET_RECYCLEORDER
			},
			address() { //回收地址
				return this.$store.state.user.address || {}
			},
			action() { //上传图片地址
				return this.$store.state.config.baseURL + 'api/common/public/upload'
			},
			request_heard() { //上传图片请求头
				return this.$store.getters.requestHeader
			},
			predictPrice() { //预估价格
				// 单个计价总价格
				let singlePrice = 0
				let single = this.order.recycleType.filter(item => {
					return item.unit == '个'
				}).map(query => {
					return this.userInfo.roleType == 1 ? query.price : query.companyPrice
				})
				for (let i = 0; i < single.length; i++) {
					singlePrice = singlePrice + Number(single[i])
				}
				// 公斤计价总价格
				let arr = this.order.recycleType.filter(item => {
					return item.unit == '公斤'
				}).map(query => {
					return this.userInfo.roleType == 1 ? query.price : query.companyPrice
				})
				let first = 0
				let last = 0
				let firstNumber = Number(this.order.preWeight.split('-')[0])
				let lastNumber = Number(this.order.preWeight.split('-')[1])
				if (arr.length >= 1) { //解决只有以单位计价的运算报错
					arr.sort((a, b) => a - b)
					first = Number(arr[0]) * firstNumber
					last = Number(arr[arr.length - 1]) * lastNumber
				}
				if (lastNumber == 0) {
					return (first + singlePrice) + '元及以上'
				}
				return (first + singlePrice) + ' ~ ' + (last + singlePrice) + '元'
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
		onLoad() {
			this.$nextTick(()=>{
				this.getDate()
			})
		
		},
		methods: {
			getDate() {
				const recycleTimeMin=this.order&&this.order.tenantId&&this.order.time?parseInt(this.order.time):30
				let data = new Date().getTime() + (1000 * 60 * recycleTimeMin)
				let oDate = new Date(data)
				let oYear = oDate.getFullYear(),
					oMonth = oDate.getMonth() + 1,
					oDay = oDate.getDate(),
					oHour = oDate.getHours(),
					oMin = oDate.getMinutes()
				this.preTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay) + ' ' + this
					.addZero(
						oHour) +
					':' + this.addZero(oMin)
			},
			addZero(num) {
				if (parseInt(num) < 10) {
					num = "0" + num
				}
				return num
			},
			
			setRemarks(item) {
				console.log(item);
				this.remarks = item.label || ''
			},

			columnchange(e) { //限制时间选择
				this.pickerValue[e.detail.column] = e.detail.value
				let date = new Date()
				let hours = date.getHours()
				let hoursList = this.preTimeList[1]
				let arr = hoursList.filter(item => {
					return Number(item.value) > hours
				})
				// 判断目前时几点，如选择今天，就限制不可以选择已过去时间
				// >= ：不可这当前日期的小时段，如要可选择当前小时，改为>即可
				if (hours >= Number(this.preTimeList[1][this.pickerValue[1]].value)) {
					if (e.detail.column == 0 && e.detail.value == 0) {
						let list = hoursList.forEach((item, index) => {
							if (Number(item.value) == Number(arr[0].value)) {
								this.pickerValue = [0, index, 0]
							}
						})
					} else if (e.detail.column == 1 && this.pickerValue[0] == 0) {
						this.pickerValue = [1, e.detail.value, 0]
					}
				}

			},
			pickerChange(e) { //预约时间选择
				let index = e.detail.value
				this.preTime = this.preTimeList[0][index[0]].value + ' ' + this.preTimeList[1][index[1]].value + ':' + this
					.preTimeList[2][index[2]].value + ':00'
			},
			selectAddress() { //选择地址
				uni.navigateTo({
					url: '/pagesMy/address/address?mode=select'
				})
			},
			switchChange(e) { //是否可进门
				this.enterDoor = !this.enterDoor
			},
			submit() {
				if (!this.address.id) return this.$u.toast('请选择回收地址')
				if (!this.preTime) return this.$u.toast('请选择预约时间')
				let query = {
					...this.order,
					addressId: this.address.id,
					enterDoor: this.enterDoor ? '1' : '2',
					remarks: this.remarks,
					preTime: this.preTime,
					images: [],
					referrerId: uni.getStorageSync('promoterId') || ''
				}
				delete query.recycleType
				let files = this.$refs.uUpload.lists.filter(item => {
					return item.progress == 100
				}).map(query => {
					return query.response.fileName
				})
				query.images = files
				recycleOrderCreate(query).then(res => {
					this.$u.toast(res.msg)
					if (res.code == 200) {
						uni.removeStorageSync("promoterId")
						const url = `./orderSuccess?id=${res.data.id}`
						// wx.requestSubscribeMessage({
						// tmplIds: ['qQzHEoDY2IFXjFQp6nmdNU9R1vDk5yx90OU5UbL1bRc'],
						// complete: (messageRes) => {
						const pagesList = getCurrentPages()
						if (pagesList[pagesList.length - 1].route ===
							'pagesIndex/comeDoorOrder/comeDoorOrder') {
							uni.redirectTo({
								url
							})
						} else {
							uni.navigateTo({
								url
							})
						}
						// }
						// })
					}
				}).catch(err => {
					this.logError(err)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}

	.remarks {
		background-color: #f8f8f8;
		border-radius: 10rpx;
		padding: 10rpx;
		// min-height: 300rpx;
	}

	.remarks-text-title {
		width: 100%;
		padding: 20rpx 0 0;
		font-size: 24rpx;
		color: #999;
	}

	.remarks-text {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;

		.item {
			width: max-content;
			padding: 6rpx 10rpx;
			margin: 20rpx 16rpx 0 0;
			border-radius: 8rpx;
			font-size: 20rpx;
			border: 1rpx solid #999;
			color: #626262;
			font-family: STHeiti;
		}
	}

	.flex-bottom-view {
		position: fixed;
		bottom: 0;
		display: flex;
		flex-direction: row-reverse;
		width: 100%;
		background-color: #fff;
		padding: 10rpx 30rpx 60rpx;
		box-shadow: 0 0 20rpx 0 #e1e1e1;

		.button {

			width: 200rpx;
			height: 70rpx;
			background-color: $theme-color;
			box-shadow: 0rpx 6rpx 12rpx 0rpx #e1e1e1;
			border-radius: 44rpx;
			color: #fff;
		}
	}

	.view {
		width: 690rpx;
		border-radius: 12rpx;
		background-color: #ffffff;
		margin: 20rpx auto 0;
		padding: 20rpx;

		.item-view {
			width: 100%;
			padding: 20rpx 0;
		}
	}

	.address-view {
		position: relative;
		width: 690rpx;
		// height: 252rpx;
		margin: 20rpx auto 0;
		padding: 20rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(0, 0, 0, 0.16);
		border-radius: 8rpx;

		.address-button {
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 86rpx;
			height: 86rpx;
			background-color: $theme-color;
			border-radius: 10rpx;
			font-size: 22rpx;
		}

		.addres-image {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 690rpx;
			height: 16rpx;
		}
	}
</style>
