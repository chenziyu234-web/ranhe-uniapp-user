<template>
	<view class="">
		<view class="background">
			<image src="/pagesIndex/static/080416293721_060.png" mode="widthFix"></image>
		</view>
		<uni-nav-bar @clickLeft="toBack" leftIcon="left" color="#000" title="环保账单" statusBar></uni-nav-bar>
		<view class="u-flex u-row-between u-m-t-20">
			
			<view class="user u-flex u-m-l-30">
				<image :src="xunHelper.detectUrl(userInfo.avatar)"></image>
				<view class=" u-m-l-16">
					<view class="font-weight u-font-32">{{userInfo.nickname}}</view>
					<view class="u-font-20 u-p-t-10">累计减少了{{xunHelper.weightK(userinfo.deliverWeight)}}kg的碳排放</view>
				</view>
			</view>
			<view @click="likeShow = true" class="like u-flex u-row-center" style="max-width: 150rpx;">
				<u-icon name="heart"></u-icon>
				<text class="u-m-l-6">{{userinfo.likeNumber}}</text>
			</view>
			<view class="icon u-flex u-row-center " @click="jemp">
				<image src="/pagesIndex/static/58.png" mode=""></image>
				<text class="font-s24 u-m-l-6" style="color: #fff;">账单攻略</text>
			</view>
		</view>
		<view class="margin-row-30 u-flex u-row-between u-m-t-30">
			<view class="u-text-center">
				<view class="u-font-32">{{userinfo.registerDays}}</view>
				<view class="u-font-24">加入分类(天)</view>
			</view>
			<view class="u-text-center">
				<view class="u-font-32">{{userinfo.deliverEquipment}}</view>
				<view class="u-font-24">投递地点(个)</view>
			</view>
			<view class="u-text-center">
				<view class="u-font-32">{{userinfo.deliverNumber}}</view>
				<view class="u-font-24">积累投递(次)</view>
			</view>
			<view class="u-text-center">
				<view class="u-font-32">{{xunHelper.weightK(userinfo.deliverWeight)}}</view>
				<view class="u-font-24">积累重量(kg)</view>
			</view>
		</view>
		<view class="month-deliver">
			<view class="u-flex padding-row-30 u-row-between">
				<view class="u-text-center" style="margin-left: 270rpx;">
					<picker mode="date" :value="date" fields="month" :start="startDate" :end="endDate"
						@change="bindDateChange">
						<view class="u-text-center u-font-36 font-weight">{{date}}月 <u-icon name="arrow-down" size="28"
								color="#999"></u-icon>
						</view>
					</picker>
				</view>
				<view @click="billingDetails" class="color-999">账单明细</view>
			</view>
			<view class="u-flex u-row-around u-m-t-10 u-p-b-20 margin-row-30 borders">
				<view class="u-text-center">
					<view class="font-weight u-m-b-10" style="font-size: 48rpx;">
						{{info.totalNumber || 0}}
					</view>
					<view class="color-999 u-font-24">当月投递(次)</view>
				</view>
				<view class="u-text-center">
					<view class="font-weight u-m-b-10" style="font-size: 48rpx;">
						{{xunHelper.weightK(info.totalWeight)}}
					</view>
					<view class="color-999 u-font-24">当月重量(kg)</view>
				</view>
			</view>
			<view class="padding-row-30 u-m-t-26 u-flex">
				<view class="tab u-flex">
					<view @click="toNumber(true)" :class="switchTo ? 'active-left' : ''"
						class=" u-flex u-row-center u-font-22 color-999" style="width: 66rpx; height: 40rpx;">次数
					</view>
					<view @click="toNumber(false)" :class="!switchTo ? 'active-right' : ''"
						class=" u-flex u-row-center u-font-22 color-999" style="width: 66rpx; height: 40rpx;">重量
					</view>
				</view>
				<view class="u-font-32 font-weight" style="margin-left: 120rpx; color: #fdbf04;">环保排名</view>
			</view>
			<view class="housing u-text-center">
				<view class="ranking u-text-center u-p-t-60">
					<view class="u-font-22">-我的排名-</view>
					<view style="font-size: 58rpx;" v-if="selfRanking">第{{selfRanking}}名
					</view>
					<view style="font-size: 42rpx; line-height: 100rpx;" v-else>暂无排名</view>
				</view>
			</view>
			<view class="">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
					@scrolltolower="lower" @scroll="scroll">

					<view class="padding-row-30" style="height: 400rpx;" v-if="switchTo">
						<view class="u-flex u-row-between margin-col-20" v-for="(item,index) in numberList"
							:key="index">
							<view class="u-flex">
								<view v-if="index>=3" class="medal-view">{{index+1}}</view>
								<image v-if="index==0" class="medal u-m-r-28" src="/pagesIndex/static/24.png"></image>
								<image v-if="index==1" class="medal u-m-r-28" src="/pagesIndex/static/25.png"></image>
								<image v-if="index==2" class="medal u-m-r-28" src="/pagesIndex/static/26.png"></image>
								<image class="head-img u-m-r-18" :src="xunHelper.detectUrl(item.avatar)"></image>
								<view>
									<view class="">{{item.nickname}}</view>
									<view class="color-999 u-font-22">{{item.mobile}}</view>
								</view>
							</view>
							<view class=" u-flex">
								<view class="u-m-r-30 ranking-active">
									<text class="u-font-36 font-weight">{{item.totalNumber}}</text><text
										class="u-font-24">次</text>
								</view>
								<image v-if="item.likeNumber == 1" src="/pagesIndex/static/like.png" class="likeIcon">
								</image>
								<image v-else @click="likeMembers(item)" src="/pagesIndex/static/nolike.png"
									class="likeIcon"></image>
							</view>
						</view>
					</view>
					<view class="padding-row-30" style="height: 400rpx;" v-else>
						<view class="u-flex u-row-between margin-col-20" v-for="(item,index) in numberList"
							:key="index">
							<view class="u-flex">
								<view v-if="index>=3" class="medal-view">{{index+1}}</view>
								<image v-if="index==0" class="medal u-m-r-28" src="/pagesIndex/static/24.png"></image>
								<image v-if="index==1" class="medal u-m-r-28" src="/pagesIndex/static/25.png"></image>
								<image v-if="index==2" class="medal u-m-r-28" src="/pagesIndex/static/26.png"></image>
								<image class="head-img u-m-r-18" :src="xunHelper.detectUrl(item.avatar)"></image>
								<view>
									<view class="">{{item.nickname}}</view>
									<view class="color-999 u-font-22">{{item.mobile}}</view>
								</view>
							</view>
							<view class=" u-flex">
								<view class="u-m-r-30 ranking-active">
									<text
										class="u-font-36 font-weight">{{xunHelper.weightK(item.totalWeight)}}</text><text
										class="u-font-24">kg</text>
								</view>
								<image v-if="item.likeNumber == 1" src="/pagesIndex/static/like.png" class="likeIcon">
								</image>
								<image v-else @click="likeMembers(item)" src="/pagesIndex/static/nolike.png"
									class="likeIcon"></image>
							</view>
						</view>
					</view>
				</scroll-view>


				<view @click="share" class="btn-poster u-font-32 u-text-center" style="color: #fff;">我要晒账单</view>
			</view>
		</view>
		<!-- 被点赞记录 -->
		<view class="likes" v-if="likeShow" @click="likeShow = false">
			<view @click.stop class="like-record padding-row-30">
				<view class="u-font-32 u-text-center u-p-t-60 u-m-b-40">被点赞记录</view>
				<view class="u-flex u-row-between padding-col-20" v-for="(item,index) in likeList" :key="index">
					<view class="u-flex">
						<image class="head-img u-m-r-18" :src="xunHelper.detectUrl(item.avatar)"></image>
						<view>
							<view class="u-font-26">{{item.nickname}}</view>
							<view class="color-999 u-font-20">{{item.mobile}}</view>
						</view>
					</view>
					<view class="color-999">{{getTime(item.createTime)}}</view>
				</view>
			</view>
			<view @click.stop="likeShow = false" class="icon-show u-flex u-row-center"
				style="width: 60rpx; height: 60rpx; border-radius: 30rpx; border: 4rpx solid #fff;">
				<u-icon name="close" size="36" color="#fff"></u-icon>
			</view>
		</view>
		<share-popup ref="sharePopup" @share="shareSave"></share-popup>
		<save-popup ref="savePopup"></save-popup>
	</view>
</template>

<script>
	import {
		billMemberTotal,
		memberbillTotal,
		likeMemberList,
		likeMember
	} from '@/api/index.js'
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				userinfo: {},
				info: {},
				numberList: [],
				dwellingShow: false,
				switchTo: true, //切换重量 or 次数
				likeShow: false, //点击被点赞
				date: '',
				month: currentDate, //时间
				likeList: [], //被点赞记录
				selfRanking: ''
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.user.userInfo || {}
			},
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			menuButton() {
				return this.$store.state.user.menuButton || {}
			},
		},
		onLoad() {
			this.getList()
			this.getInfo()
			this.date = this.getDate('month');
		},
		methods: {
			likeMembers(item) { //点赞
				likeMember({
					memberId: item.memberId
				}).then(res => {
					uni.showToast({
						icon: "none",
						title: res.msg
					})
					this.getList()
					this.getInfo()
				})
			},
			getTime(val) { //计算时间差
				var old_date = new Date(val);
				return this.$u.timeFrom(old_date, false)
			},
			getList() { //排名
				memberbillTotal().then(res => {
					this.userinfo = res.data
				})
				likeMemberList({
					pageNum: 1,
					pageSize: 5
				}).then(res => {
					this.likeList = res.data
				})
			},
			getInfo() {
				billMemberTotal({
					month: this.month,
					sortField: this.switchTo ? 'total_number' : 'total_weight' //total_number投递次数 total_weight投递重量
				}).then(res => {
					this.selfRanking = res.selfRanking
					this.info = res.total
					this.numberList = res.data || []
				})
			},
			share() { //嗮账单按钮
				this.$refs.sharePopup.open()
			},
			shareSave() { //生成海报
				let info = {
					time: this.getDate('save'),
					...this.userinfo,
					selfRanking: this.selfRanking
				}
				uni.setStorageSync('saveInfo', info)
				setTimeout(() => {
					this.$refs.savePopup.buildPoster()
				}, 500)
			},
			bindDateChange(e) {
				this.month = e.target.value;
				let arr = e.target.value.split("-")
				this.date = arr[1];
				this.getInfo()
			},
			toNumber(num) {
				this.switchTo = num
				this.getInfo()
			},
			jemp() {
				uni.navigateTo({
					url: `/pages/singPage/singPage?id=${6}`
				})
			},
			billingDetails() { //账单明细
				uni.navigateTo({
					url: '/pagesIndex/greenBill/billDetail/billDetail'
				})
			},

			toBack() { //返回上一页
				uni.navigateBack({})
			},
			getDate(type) { //获取当前年月
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				month = month > 9 ? month : '0' + month;
				if (type === 'start') {
					year = year - 3;
				} else if (type === 'end') {
					year = year;
				} else if (type == 'save') {
					return `${year}年${month}月`
				}else if(type=="month"){
					return month
				}
				return `${year}-${month}`;
			},
		}
	}
</script>

<style lang="scss">
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
		min-height: 100vh;
		height: 100vh;
		width: 100%;
		position: absolute;
		z-index: -1;
	}

	.likeIcon {
		width: 40rpx;
		height: 40rpx;
	}

	.nav image {
		height: 58rpx;
		width: 58rpx;
	}

	.user {
		margin-right: 60rpx;

		image {
			width: 106rpx;
			height: 106rpx;
			background-color: #999999;
			// border: solid 2rpx #ffffff;
			border-radius: 50%;
		}
	}



	.borders {
		border-bottom: 1rpx dashed #e1e1e1;
	}

	.icon {
		width: 184rpx;
		height: 58rpx;
		background-color: $theme-color;
		border-radius: 28rpx 0 0 28rpx;
	}

	.icon image {
		height: 26rpx;
		width: 22rpx;
	}

	.like {
		min-width: 110rpx;
		height: 50rpx;
		border-radius: 30rpx;
		background-color: #fff;
		padding: 0 15rpx;
	}

	.month-deliver {
		width: 690rpx;
		min-height: 830rpx;
		background-color: #ffffff;
		border-radius: 40rpx;
		margin: 34rpx 30rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
	}

	.none image {
		width: 380rpx;
		height: 240rpx;
		margin: 90rpx auto 0;
	}

	.icon-show {
		margin: 28rpx auto;
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

	.housing {
		width: 307rpx;
		height: 250rpx;
		margin: 0rpx auto;
		background-image: linear-gradient(90deg, #ffffff 0%, #e9fafd 50%, #f4fdfe 75%, #ffffff 100%);
	}

	.ranking {
		width: 272rpx;
		height: 263rpx;
		background-image: url('/pagesIndex/static/63.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		margin: 30rpx auto 0;
	}

	.medal {
		width: 42rpx;
		height: 47rpx;
	}

	.head-img {
		width: 58rpx;
		height: 58rpx;
		border-radius: 50%;
	}

	.ranking-active {
		color: #fdbf04;
	}

	.btn-poster {
		width: 625rpx;
		height: 96rpx;
		background-color: $theme-color;
		border-radius: 20rpx;
		margin: 20rpx auto 0;
		line-height: 96rpx;
	}

	.likes {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
	}

	.like-record {
		width: 625rpx;
		height: 667rpx;
		background-color: #ffffff;
		border-radius: 40rpx;
		margin: 570rpx auto 0;
	}
</style>
