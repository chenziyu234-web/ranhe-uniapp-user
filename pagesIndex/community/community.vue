<template>
	<view class="">
		<view class="background">
			<image src="/pagesIndex/static/28.png" mode=""></image>
		</view>
		<view class="" style="height: 100rpx;"></view>
		<view class="nav u-m-l-30">
			<image @click="goBack" src="/static/16.png" mode=""></image>
		</view>
		<view class="u-text-center">
			<view class="u-m-b-20" style="font-size: 48rpx; color: #000000;">{{map.villageName}}</view>
			<view class="u-font-24">{{map.parentsName}}</view>
			<view class="u-flex u-row-center u-m-t-35">
				<view class="u-flex">
					{{rankConfig?.name}}
					<!-- <view class="box-day" v-for="(item,index) in numberDay" :key="index">{{item || '0'}}</view> -->
				</view>
			</view>
		</view>
		<view class="ranking">
			<view class="deliver">
				<view class="uni-list-cell-db" style="height: 35rpx;">
					<picker mode="date" :value="date" fields="month" @change="bindDateChange" v-if="type !== '4'">
						<view class="uni-input u-text-center u-font-28 font-weight">{{date ? date.substring(5) : ''}}月
							<u-icon name="arrow-down" size="28"></u-icon>
						</view>
					</picker>
					<view style="color: #fff; text-align: center;" v-else>
						<text @click="getWeekDates" v-if="!week">上一周</text>
						<text @click="getWeekDates" v-else>本周</text>
					</view>
				</view>
				<view class="u-flex u-m-t-38 u-row-around">
					<view class=""  style="color: #fff;">
						<view class="font-s60" style="width: 179rpx; word-break: keep-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{info?.memberName}}</view>
						<view class="u-font-24">{{info?.memberMobile}}</view>
					</view>
					<view class=""  style="color: #fff;">
						<view class="font-s60">{{info?.rank}}</view>
						<view class="u-font-24">当前排名</view>
					</view>
					<view style="color: #fff;" v-if="info?.rankType == '1'">
						<view style="font-size: 60rpx;">{{info?.totalCount}}</view>
						<view class="u-font-24">小区投递次数</view>
					</view>
					<view style="color: #fff;" v-else>
						<view style="font-size: 60rpx;">{{info?.totalWeight}}</view>
						<view class="u-font-24">小区投递重量(kg)</view>
					</view>
					<view style="color: #fff;">
						<!-- <view style="font-size: 60rpx;">{{info?.totalWeight}}</view> -->
						<view class="u-font-24 gift" @click="getGift">领取奖励</view>
					</view>
				</view>
			</view>
			<view class="u-text-center padding-row-30 u-m-t-20">
				<!-- <view class="tab u-flex">
					<view class=" u-flex u-row-center u-font-22" style="width: 66rpx; height: 40rpx;"
						:class="switchTo ? 'active-left' : ''" @click="toNumber(true)">次数
					</view>
					<view class=" u-flex u-row-center u-font-22" style="width: 66rpx; height: 40rpx;"
						:class="!switchTo ? 'active-right' : ''" @click="toNumber(false)">重量</view>
				</view> -->
				<view class="u-font-32 font-weight" style="text-align: center;">环保排名</view>
			</view>
			<view class="my-deliver margin-row-30 u-m-t-20" v-if="info?.rank == '0' || info?.rank == null">
				<!-- <view @click="toBill" class="u-font-24 u-flex u-row-center">
					<text style="line-height: 79rpx;">我在该小区本月暂无投递，<text style="color: #4fdaf9;">查看我的环保账单</text></text>
					<u-icon name="arrow-right" color="#4fdaf9"></u-icon>
				</view> -->
				<view class="u-font-24 u-flex u-row-center">
					<text style="line-height: 79rpx;">我在该小区本月暂无投递~</text>
					<!-- <u-icon name="arrow-right" color="#4fdaf9"></u-icon> -->
				</view>
			</view>
			<view class="padding-row-30" v-if="info?.rankType == '1'">
				<view class="u-flex u-row-between margin-col-20" v-for="(item,index) in numberList" :key="index">
					<view class="u-flex">
						<view v-if="index!=0&&index!=1&&index!=2" class="medal-view">{{index+1}}</view>
						<image v-if="index==0" class="medal u-m-r-28" src="/pagesIndex/static/24.png"></image>
						<image v-if="index==1" class="medal u-m-r-28" src="/pagesIndex/static/25.png"></image>
						<image v-if="index==2" class="medal u-m-r-28" src="/pagesIndex/static/26.png"></image>
						<image class="head-img u-m-r-18" :src="xunHelper.detectUrl(item.memberAvatar)"></image>
						<view class="">
							<view class="">{{item.memberName}}</view>
							<view class="color-999 u-font-22">{{item.memberMobile}}</view>
						</view>
					</view>
					<view class="ranking-active"><text
							class="u-font-36 font-weight">{{item.totalCount}}</text><text class="u-font-24">次</text>
					</view>
				</view>
			</view>
			<view class="padding-row-30" v-else>
				<view class="u-flex u-row-between margin-col-20" v-for="(item,index) in numberList" :key="index">
					<view class="u-flex">
						<view v-if="index!=0&&index!=1&&index!=2" class="medal-view">{{index+1}}</view>
						<image v-if="index==0" class="medal u-m-r-28" src="/pagesIndex/static/24.png"></image>
						<image v-if="index==1" class="medal u-m-r-28" src="/pagesIndex/static/25.png"></image>
						<image v-if="index==2" class="medal u-m-r-28" src="/pagesIndex/static/26.png"></image>
						<image class="head-img u-m-r-18" :src="xunHelper.detectUrl(item.memberAvatar)"></image>
						<view class="">
							<view class="">{{item.memberName}}</view>
							<view class="color-999 u-font-22">{{item.memberMobile}}</view>
						</view>
					</view>
					<view class=" ranking-active">
						<text class="u-font-36 font-weight">{{item.totalWeight}}</text><text class="u-font-24">kg</text>/
						<text class="u-font-36 font-weight">{{item.totalCount}}</text><text class="u-font-24">次</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDeliverDetail,
		DeliverSubscribe,
		billMemberTotal,
		memberbillTotal,
		getActive,
		getActivityList
	} from '@/api/index.js'
	export default {
		data() {
			return {
				switchTo: true, //切换重量 or 次数
				map: {},
				numberDay: [],
				numberList: [],
				info: {},
				date: null,
				rankConfig: '',
				startTime: '',
				endTime: '',
				type: '',
				week: false,
				id :''
			}
		},
		onLoad(options) {
			const posData = JSON.parse(options.item)
			console.log(posData,'options1111')
			this.startTime = posData.startTime
			this.endTime = posData.endTime
			this.type = posData.type
			this.id = posData.id
			let year = posData.startTime.substring(0,4)
			let month = posData.startTime.substring(5,7)
			this.date = `${year}-${month}`;
			// this.getDate()
			this.getList()
		},
		methods: {
			//本周
			getWeekDates() {
			  const today = new Date();
			  const dayOfWeek = today.getDay();
			  const startOfWeek = new Date(today);
			  if(this.week == true){
				  this.week = false
				  startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
			  }else{
				  this.week = true
				  startOfWeek.setDate(today.getDate() - dayOfWeek - 6);
			  }
			  
			  const weekDates = [];
			  for (let i = 0; i < 7; i++) {
			    const date = new Date(startOfWeek);
			    date.setDate(startOfWeek.getDate() + i);
			    weekDates.push(date.toISOString().split('T'));
			  }
			  this.startTime = weekDates[0][0] + ' 00:00:00'
			  this.endTime = weekDates[6][0] + ' 23:59:59'
			  this.getList()
			},
			//下一周
			nextWeek(){
				let start, end
				start = this.startTime.slice(8,10)
				end = Number(start)-1
				start = Number(this.startTime.slice(8,10))-7
				console.log(start,end)
				if(start > 0){
					this.startTime = this.startTime.slice(0,8) + start + ' 00:00:00'
					this.endTime = this.endTime.slice(0,8) + end + ' 23:59:59'
					console.log(this.startTime,this.endTime,'22222222222')
					this.getList()
				}
			},
			//领取礼品
			getGift(){
				if(this.info?.coupon != null){
					wx.navigateToMiniProgram({
						appId: this.info.coupon.appId,
						path: this.info.coupon.link
					})
				}else{
					uni.showToast({
						title: '暂未达标,请继续努力~',
						icon:'none'
					})
				}
			},
			getDeliverDetail(options) {
				getActive({
					type:'5'
				}).then(res => {
					this.map = res.data
					this.getList()
					const splitToDigit = n => (n + '').split('').map(Number)
					this.numberDay = splitToDigit(this.map.runDay)
				})
			},
			//获取排行榜
			getList() {
				getActive({
					type: this.type,
					startTime: this.startTime,
					endTime:  this.endTime,
					activityId: this.id
					// rankType: this.switchTo ? '1' : '2', //total_number投递次数 total_weight投递重量
				}).then(res => {
					this.info = res.data?.currentInfo
					this.numberList = res.data?.rankList?.slice(0,10) || []
					this.rankConfig = res.data?.rankConfig[0]
				})
			},
			getDate() {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				// month = month > 9 ? month : '0' + month;
				// let dat = new Date(year, month, 0).getDate()
				// this.startTime = `${year}-${month}-01 00:00:00`
				// this.endTime = `${year}-${month}-${dat} 24:00:00`
				this.date = `${year}-${month}`;
			},
			bindDateChange(e) {
				console.log(e,'datamonth')
				this.date = e.target.value
				let year = this.date.substring(0,4)
				let month = this.date.substring(5)
				let dat = new Date(year, month, 0).getDate()
				this.startTime = `${year}-${month}-01 00:00:00`
				this.endTime = `${year}-${month}-${dat} 23:59:59`
				this.id = ''
				this.getList()
			},
			toNumber(num) {
				this.switchTo = num
				this.id = ''
				this.getList()
			},
			goBack() {
				uni.navigateBack()
			},
			toBill() {
				uni.navigateTo({
					url: '/pagesIndex/greenBill/greenBill'
				})
			}
		}
	}
</script>

<style lang="scss">
	.gift{
		padding: 14rpx 20rpx;
		border: 1rpx #f1f1f1 solid;
		border-radius: 10rpx;
		color: #fff;
	}
	.getgift{
		border-color: #00B3E0;
		color: #00B3E0;
	}
	.medal-view {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 42rpx;
		height: 47rpx;
		margin-right: 30rpx;
		border: 1px solid #e1e1e1;
		border-radius: 50%;
	}
	.background image {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		z-index: -1;
	}

	.nav image {
		width: 58rpx;
		height: 58rpx;
	}

	.box-day {
		width: 47rpx;
		height: 47rpx;
		line-height: 47rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		margin: 0 4rpx;
	}

	.ranking {
		margin: 36rpx auto 0;
		width: 690rpx;
		height: 1050rpx;
		padding-bottom: 20rpx;
		background-color: #ffffff;
		border-radius: 40rpx;
		opacity: 0.9;
		overflow-y: scroll;
	}

	.deliver {
		background-image: url('/pagesIndex/static/23.png');
		width: 100%;
		height: 264rpx;
		background-size: 100%;
		background-repeat: no-repeat;
	}

	.tab {
		width: 132rpx;
		height: 40rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		border: solid 1rpx #e1e1e1;
	}

	.active-left {
		background-color: #a9a9a9;
		border-radius: 20rpx 0 0 20rpx;
		color: #fff;
	}

	.active-right {
		background-color: #a9a9a9;
		border-radius: 0 20rpx 20rpx 0;
		color: #fff;
	}

	.my-deliver {
		width: 625rpx;
		height: 79rpx;
		background-color: #eff6f8;
		border-radius: 20rpx;
	}

	.medal {
		width: 42rpx;
		height: 47rpx;
	}

	.head-img {
		width: 58rpx;
		height: 58rpx;
	}

	.ranking-active {
		color: #fdbf04;
	}

	.ranking-number {
		color: #333;
	}
</style>
