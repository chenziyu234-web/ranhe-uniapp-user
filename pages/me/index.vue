<template>
	<view class="me-view">
		<!-- #ifdef MP-WEIXIN -->
		<customTop title="" bgHeight="800rpx" ></customTop>
		<!-- #endif -->
		<view class="content pos-r">
			<view class="u-flex u-p-l-30 u-p-r-30 text-333333">
				<u-avatar :src="userInfo.avatar" size="118"></u-avatar>
				<view @click="handlePop()" v-if="userInfo.id" style="width: calc(100% - 350rpx);" class="u-m-l-20">
					<view class="u-flex u-font-36 font-weight">
						{{userInfo.nickname}}
						<u-icon class="u-m-l-10" name="edit-pen-fill" size="38"></u-icon>
					</view>
					<view class="u-p-t-10 u-font-24 text-999999">账号：{{userInfo.mobile }}</view>
				</view>
				<view class="u-m-l-20" @click="getLogin()" v-else
					style="width: calc(100% - 300rpx);z-index: 10;position: relative;">
					<view class="u-flex">注册/登录</view>
					<view class="u-p-t-10 u-font-24">登录享受更多权益</view>
				</view>
				<view class="u-flex" style="width: 200rpx;" v-if="userinfo.agentFlag == 1" @click="changeAgentShow">
					<view v-if="!agentShow" class="text-666666">切换至代理商</view>
					<view v-else class="text-666666">切换至用户</view>
					<u-icon class="u-m-1-10" name="arrow-right" size="20"></u-icon>
				</view>
			</view>

			<view class="account-view text-white">
				<image class="account-bg-img" src="/static/me/account-bg.png" mode="aspectFill"></image>
				<view class="u-flex u-row-between">
					<view class="u-font-28">
						<text class="">我的账户(元)</text>
						<text v-if="!agentShow" style="opacity: 0.8;">(满{{withdraw.minMoney||'0.00'}}元可提现)</text>
						<text v-else class="" style="opacity: 0.8;">(满{{tipsMin||'0.00'}}元可提现)</text>
					</view>

				</view>
				<view class="u-flex u-col-top u-row-between u-m-t-10 u-m-b-10">
					<text v-if="!agentShow" class="font-weight" style="font-size: 80rpx;">{{getAllMoney}}</text>
					<text v-else class="font-weight" style="font-size: 80rpx;">{{Allmonney}}</text>
					<view @click="toAccound">
						<text>去提现</text>
						<u-icon name="arrow-right" size="24"></u-icon>
					</view>
				</view>
				<view class="tags">
					<view class="tags-view u-font-24" @click="openShowAuditList" v-if="!agentShow">
						<text class="font-weight">含待入账金额(元)：</text>{{userInfo.checkMoney || '0.00'}}
						<u-icon name="arrow-right" size="20"></u-icon>
					</view>
					<view class="tags-view u-font-24" @click="openShowAuditList" v-else>
						<text class="font-weight">已提现金额(元)：</text>{{withdrawnAmount || '0.00'}}
						<u-icon name="arrow-right" size="20"></u-icon>
					</view>
				</view>

				<view class="u-flex u-row-right">
					<view class="questionBtn" @click="toQuestion">
						<u-icon name="question-circle"></u-icon>
						常见问题
					</view>
				</view>
			</view>
			<view class="agentListdata account-view text-white" v-if="agentShow">
				<image class="account-bg-img" src="/static/me/account-bg.png" mode="aspectFill"></image>
				<view class="u-flex u-flex-wrap u-p-15">
					<view class="agentListCont u-border-right">
						<view>{{agentEq.total}}</view>
						<view>设备数量</view>
					</view>
					<view class="agentListCont">
						<view>{{agentEq.offlineCount}}</view>
						<view>离线设备</view>
					</view>
				</view>
				<view class="u-flex u-flex-wrap u-m-t-20 u-p-30 u-border-top">
					<view class="agentListCont u-border-right">
						<view>{{statistics.totalWeight}}</view>
						<view>今日回收总量</view>
					</view>
					<view class="agentListCont">
						<view>{{statistics.totalAward}}</view>
						<view>今日累计收益</view>
					</view>
				</view>
			</view>
			<!--菜单-->
			<view class="menu-list">
				<view class="menu-cell" v-for="(item,index) in regionList" :key="index" @click="jemp(item.path)">
					<view class="menu-cell-left">
						<uni-icons :type="item.icon" size="22" color="#333333"></uni-icons>
						<text class="menu-cell-text">{{item.name}}</text>
					</view>
					<u-icon name="arrow-right" color="#cccccc" size="16"></u-icon>
				</view>
				<view class="menu-cell" v-if="agentShow" @click="jemp('/pagesMy/eq/eq')">
					<view class="menu-cell-left">
						<uni-icons type="shop" size="22" color="#333333"></uni-icons>
						<text class="menu-cell-text">我的设备</text>
					</view>
					<u-icon name="arrow-right" color="#cccccc" size="16"></u-icon>
				</view>
			</view>
			<u-gap></u-gap>
			<!-- 活动模块暂不使用：当前后端未提供活动相关接口，保留页面代码便于后续恢复 -->
			<view class="" style="margin: 0 30rpx; border-radius: 20rpx;" v-if="false">
				<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :date="infoData.date" :selected="infoData.selected"
					:insert="infoData.insert" :lunar="infoData.lunar" :startDate="infoData.startDate" :endDate="infoData.endDate"
					:range="infoData.range" @confirm="confirm" @monthSwitch="chooseMon" />
			</view>
			<u-gap></u-gap>
			<view class="activeAll" v-if="false">
				<view class="activeHead">活动</view>
				<view class="flex listItem" v-for="item in listActive" :key="item.index" >
					<view class="">
						<image :src="xunHelper.detectUrl(item.cover)" mode="widthFix" style="width: 200rpx; height: 200rpx;"></image>
					</view>
					<view class="listItemR">
						<view class="font-s30 blue"  @click="goDetail(item.id)">
							{{item.name}}
						</view>
						<view class="font-s20">
							活动时间：{{item.startTime.substring(0,10) + '至' + item.endTime.substring(0,10)}}
						</view>
						<!-- <view class="font-s24 padding-top20">{{item.name}}</view> -->
						<view class="u-padding-top-12"  @click="goDetail(item.id)">
							<view class="font-s24" >{{item.remark}}</view>
							<!-- <text class="blue font-s24">查看详情</text> -->
							<!-- <mp-html :content="item.remark" class="font-s24 "></mp-html> -->
						</view>
						
						<view class="felx activeDiv" v-if="item.type == '3'">
							<view class="activeWrap ">
								<view class="activeTips">
									<text v-if="item.showEnd" class="">活动已结束</text>
									<text v-else-if="item.stageProgress.currentValue / item.stageProgress.totalTarget >= 1" @click="getGift(item)" class="goGift">领取</text>
									<view class="flex" style="justify-content: space-around;" v-else>
										<text class="font-s20" v-if="item.stageProgress.targetWeight != '0' && item.stageProgress.targetWeight != ''">重量：{{ item.stageProgress.weight +'/'+ item.stageProgress.targetWeight}}</text>
										<text class="font-s20" v-if="item.stageProgress.targetCount != '0' && item.stageProgress.targetCount != ''">次数：{{item.stageProgress.count +'/'+ item.stageProgress.targetCount}}</text>
										<text class="font-s20" v-if="item.stageProgress.targetDays != '0' && item.stageProgress.targetDays != ''">天数：{{item.stageProgress.days +'/'+ item.stageProgress.targetDays}}</text>
									</view>
								</view>
								<view v-if="!item.showEnd" class="activeProgress" :style="{width: Number(item.stageProgress.currentValue / item.stageProgress.totalTarget) >= 1 ? '100%' : Number(item.stageProgress.currentValue / item.stageProgress.totalTarget)*100 + '%'}"></view>
							</view>
						</view>
						<view @click="toCharts(item)" class="margin-top30" v-else>
							<view class="phb">查看排行榜</view>
						</view>
					</view>
				</view>
			</view>
			<!--活动结束-->
		</view>

		<u-modal title="剩余可投重量" v-model="show" :content="info" :confirm-color="themeColor"></u-modal>
		<!-- <phone-mode ref='phoneMode'></phone-mode> -->
		<u-popup v-if="false" v-model="showActiveTooilp" mode="center" width="650" border-radius="20" :zIndex="999">
			<view class="padding-30 activeView">
				<view class="u-font-28 text-333333 font-weight padding-col-30 text-center">选择进入的活动</view>
				<view class="activeList" v-for="(item,index) in listActive" :key="index" @click="toCharts(item)">
					{{item.name}}
				</view>
			</view>
		</u-popup>
		<u-popup v-model="showTooilp" mode="center" width="650" borderRadius="20" :zIndex="999">
			<view class="padding-30">
				<view class="u-font-32 text-333333 font-weight padding-col-30 text-center">生活杂物回收金额说明</view>
				<view class="text-999999 u-font-26" style="line-height: 34rpx;letter-spacing: 2rpx;">
					我们专业人员每天对订单进行检查，一旦检查到不可投递物，平台会扣除本次订单金额，且不会退还任何投递物。
				</view>
				<view :style="confirmStyle" class="u-m-l-40 u-m-t-30" @click="showTooilp = false">确定</view>
			</view>
		</u-popup>
		<u-popup v-model="showAuditList" mode="bottom" :closeable="true">
			<view style="height: 1000rpx;">
				<view class=" u-flex-col  padding-row-30" style="background-color:#F2F3F7;">
					<view class="font-weight text-center u-p-t-30 u-font-28">
						待入账金额明细
					</view>
					<view class="u-flex u-row-between u-font-32 font-weight padding-col-30">
						<view class="u-flex u-col-center" @click="showTooilp = true">
							<text class="u-m-r-10">待入账金额(元)</text>
							<u-icon color="#666" size="32" class="u-p-t-6" name="question-circle"></u-icon>
						</view>
						<text>{{userInfo.checkMoney || 0}}</text>
					</view>
				</view>
				<view class="pop-view  u-m-b-40" style="padding-bottom: 100rpx;">
					<view v-for="(item,index) in deliveryList" :key="index"
						class="u-flex u-row-between u-col-center u-m-b-30">
						<view>
							<view class="u-font-28 text-333333">预付款入账</view>
							<view class="u-font-24 padding-col-10" style="color:#7B7B7B ;">{{item.createTime}}</view>
							<view @click="toOrderDetail(item.id)" class="u-font-20">订单号：<text
									style="color: #608BB6;">{{item.orderSn}}</text></view>
						</view>
						<view class="text-right">
							<view class="u-font-28 tex-333333 font-weight">+￥{{item.totalPrice}}</view>
							<view class="u-font-26 font-weight" style="color: #F9B908;">审核中</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>

		<get-info-pop ref="infoPop" content="完善您的头像和昵称"></get-info-pop>

		<u-tabbar :list="tabbarList" active-color="#00B3E0"></u-tabbar>
	</view>
</template>

<script>
	
	import {
		UserApplyGet,
		memberDeliveryList,
		xuanChaunCodeApi,
		getAccount,
		getWallet,
		getActive,
		getActivityList,
		getActivityListWithInfo
	} from '@/api/index.js'
	export default {
		data() {
			return {
				confirmStyle: {
					width: '520rpx',
					height: '88rpx',
					background: '#1890ff',
					textAlign: 'center',
					lineHeight: '88rpx',
					borderRadius: '44rpx',
					color: '#fff',
					fontWeight: 'bold',
					fontSize: '32rpx'
				},
				infoData: {
					lunar: false,
					range: false,
					insert: true,
					selected: []
				},
				showTooilp: false,
				deliveryList: [],
				showAuditList: false,
				regionList: [
					{
						name: '投递记录',
						icon: 'cloud-upload',
						path: '/pagesMy/myOrder/myOrder'
					},
					{
						name: '提现记录',
						icon: 'wallet',
						path: '/pagesMy/withdrawalList/memberWithdrawalList'
					},
					// {
					// 	name: '我的设备',
					// 	icon: '/static/me/11.png',
					// 	path: '/pagesMy/eq/eq'
					// },
					// {
					// 	name: '兑换记录',
					// 	icon: '/static/me/2.png',
					// 	path: '/pagesMall/exchangeRecord/exchangeRecord'
					// },
					// {
					// 	name: '我的发布',
					// 	icon: '/static/me/3.png',
					// 	path: '/pagesMarket/myRelease/myRelease'
					// },
					// {
					// 	name: '回收地址',
					// 	icon: '/static/me/5.png',
					// 	path: '/pagesMy/address/address'
					// },
					// {
				// 	name: '申请商户',
				// 	icon: 'shop',
				// 	path: '/pagesMy/recruit/recruit'
				// },
					// {
					// 	name: '推广海报',
					// 	icon: '/static/me/7.png',
					// 	path: '/pagesMy/myPoster/myPoster'
					// },
					// {
					// 	name: '推广收益',
					// 	icon: '/static/me/8.png',
					// 	path: '/pagesMy/extension/extension'
					// },
					// {
					// 	name: '立即分享',
					// 	icon: '/static/me/14.png',
					// 	path: 'share'
				// },
				// {
				// 	name: '消息中心',
				// 	icon: '/static/me/12.png',
				// 	path: '/pagesIndex/message/inform'
				// },
					// {
					// 	name: '联系客服',
					// 	icon: '/static/me/10.png',
					// 	path: 'phone'
					// },
					{
						name: '系统设置',
						icon: 'gear',
						path: '/pagesMy/setUp/setUp'
					}
				],
				show: false,
				userInfoData: {},
				Allmonney: '',
				info: "当前为本周您还能投递的重量，每周一凌晨我们会重新评估您在下一周期的可投重量",
				agentShow: false,
				withdrawnAmount: '',
				tipsMin: '',
				agentEq: {},
				statistics: {},
				showActive: false,
				progress: '',
				active: '',
				listActive: [],
				showActiveTooilp: false,
				startTime: '',
				endTime: '',
			}
		},
		onShareTimeline() { //分享到朋友圈
			return {
				path: `/pages/index/index`
			}
		},
		onShareAppMessage() { //分享到好友聊天界面
			return {
				path: `/pages/index/index`,
			}
		},
		computed: {
			getAllMoney() {
				let nowMoney = this.userInfo.nowMoney
				let checkMoney = this.userInfo.checkMoney
				let monney = (nowMoney + checkMoney).toFixed(2)
				if (isNaN(monney)) return '0.00'
				return monney
			},
			global() {
				return this.$store.state.settings.global || {}
			},
			withdraw() {
				return this.global.withdraw || {} //autoTransfer
			},
			menuButton() {
				return this.$store.state.user.menuButton || {}
			},
			homeData() {
				return this.$store.state.user.homeData || {}
			},
			userinfo() {
				return this.$store.state.user.userInfo || {}
			},
			publicityConfig(){
				return this.$store.state.user.publicityConfig
			}
		},
		onReady() {
			this.reloadInfo()
		},
		onPullDownRefresh() {
			this.reloadInfo()
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1500);
		},
		methods: {
			//活动详情
			goDetail(item){
				uni.navigateTo({
					url: '/pagesMy/activeDetail/activeDetail?data=' + item
				})
			},
			//活动列表
			getActiveInfo(){
				getActivityListWithInfo({startTime: this.startTime,
					endTime: this.endTime}).then( res => {
					const len = res.data.length
					if(len > 0){
						this.listActive = res.data.map(item => {
							if(item.receiveHideTime == null || item.receiveHideTime == ''){
								return {
									...item,
									showEnd: false
								}
							}else{
								if(new Date().getTime() < new Date(item.receiveHideTime).getTime()){
									return {
										...item,
										showEnd: false
									}
								}else{
									return {
										...item,
										showEnd: true
									}
								}
							}
						})
						this.active = true
					}else{
						this.active = false
						this.listActive = ''
					}
					
					
				}).finally( rec => {
					console.log(rec)
					uni.hideLoading()
				})
			},
			//获取活动列表
			getActivityList(){
				getActivityList({startTime: this.startTime,
					endTime: this.endTime}).then( res => {
					// this.listActive = res.data
					// uni.hideLoading()
				})
			},
			//跳转领取优惠券
			getGift(item){
				console.log(item,'item')
				console.log(item.stageProgress.stages[0].achieved,'achieved')
				const isToNext = item?.stageProgress?.stages[0]?.achieved
				if(isToNext == true){
					wx.navigateToMiniProgram({
						appId: item.stageProgress.stages[0].coupon.appId,
						path: item.stageProgress.stages[0].coupon.link
					})
				}else{
					uni.showToast({
						title: '暂未达标,请继续努力~',
						icon:'none'
					})
				}
			},
			change(){
				console.log(1)
			},
			confirm(e) { 
				console.log('confirm 返回:', e)
			},
			chooseMon(e) {
				const year = e.year
				const month = e.month
				let dat = new Date(year, month, 0).getDate()
				this.startTime = `${year}-${month}-01 00:00:00`
				this.endTime = `${year}-${month}-${dat} 23:59:59`
				// 活动模块暂不使用，禁止请求后端未实现的活动接口
				// this.getActiveData()
				console.log('monthSwitchs 返回:', this.endTime,this.startTime)
			},
			reloadInfo() {
				if (this.loginStatus) {
					this.$store.dispatch('user/getUserInfo')
					this.$store.dispatch('user/getHomeData')
					if (this.agentShow) {
						this.getAgentInfo()
					}
					// 活动模块暂不使用，禁止进入“我的”页面时自动请求 getActivityInfo
					// this.getActiveData()
				}
			},
			//跳转排行榜
			toCharts(item){
				console.log(item,'item')
				let data = {
					startTime: item.startTime,
					endTime: item.endTime,
					type: item.type,
					id: item.id
				} 
				
				console.log(data)
				uni.navigateTo({
					url: '/pagesIndex/community/community?item=' + JSON.stringify(data)
				})
				this.showActiveTooilp = false
			},
			//获取活动信息
			getActiveData(){
				uni.showLoading()
				getActive({
					type: "3",
					startTime: this.startTime,
					endTime: this.endTime
				}).then( res => {
					if(res.code == 200){
						var dataList = [], num
						const progress = res.data?.progress
						console.log(progress,'progress')
						if(progress){
							const len = progress.length -1
							console.log(len,'len')
							num =  Number(progress[len]?.currentValue)/Number(progress[len]?.totalTarget)
							this.progress = num >= 1 ? '100%' : (Number(num) * 100) + '%'
							// this.active = res.data?.progress[len]
						}else{
							this.progress = ''
							// this.active = ''
						}

						// foreach
						res.data?.dailyRecords?.forEach( (item,index) =>{
							dataList[index] ={
								date: item.date,
								info: '已打卡'
							}
						})
						this.infoData.selected = dataList
						this.showActive = true
						// this.getActivityList()
						this.getActiveInfo()
						console.log(this.active,'this.active ')
					}

				}).catch( err => {
					console.error('获取活动信息失败', err)
					this.showActive = false
					this.active = ''
					uni.hideLoading()
				})
			},
			handlePop() {
				this.$refs.infoPop.open()
			},
			toMyTuiJian() {
				this.checkLogIn(() => {
					uni.navigateTo({
						url: '/pagesMy/myTuiJian/myTuiJian'
					})
				})
			},
			toOrderDetail(id) {
				uni.navigateTo({
					url: '/pagesMy/myOrder/orderDetail?id=' + id
				})
			},
			toQuestion() {
				uni.navigateTo({
					url: '/pagesIndex/helpCenter/helpCenter'
				})
			},
			toAccound() {
				if (!this.agentShow) {
					uni.navigateTo({
						url: '/pagesMy/accound/accound'
					})
				} else {
					uni.navigateTo({
						url: '/pagesMy/agentAccound/agentAccound'
					})
				}
			},
			openShowAuditList() {
				// this.showTooilp = true
				// return
				if (!this.agentShow) {
					uni.navigateTo({
						url: '/pages/deliverList/deliverList'
					})
				} else {
					uni.navigateTo({
						url: '/pagesMy/withdrawalList/withdrawalList'
					})
				}
				// this.showAuditList = true
				// this.getMemberDeliveryList()
			},
			//获取待入账金额列表
			getMemberDeliveryList() {
				memberDeliveryList({
					pageNum: 1,
					pageSize: 100,
					sendStatus: '1',
					status: '1'
				}).then(res => {
					if (res.code == 200) {
						this.deliveryList = res.data
					}
				})
			},
			Jemps(url) {
				this.checkLogIn(() => {
					uni.navigateTo({
						url: url
					})
				})
			},
			getLogin() {
				uni.showLoading({
					title: '加载中~'
				})
				this.$store.dispatch('user/wxUserLogin').then(res => {
					uni.hideLoading()
				}).catch(e => {
					uni.navigateTo({
						url: '/pages/login/index'
					})
					uni.hideLoading()
				})
			},
			changeAgentShow() {
				this.agentShow = !this.agentShow
				if (this.agentShow) {
					this.getAgentInfo()
				}
			},
			//获取代理商信息
			getAgentInfo() {
				getAccount().then(res => {
					if (res.code == 200) {
						const dataMsg = res.data
						let monney = dataMsg.balances.availableAmount
						this.withdrawnAmount = dataMsg.balances.withdrawnAmount
						this.agentEq = res.data.equipments
						this.statistics = res.data.statistics
						if (isNaN(monney) || monney == 0) {
							this.Allmonney = '0.00'
						} else {
							this.Allmonney = monney
						}
					}
				})
				getWallet().then(resa => {
					if (resa.code == 200) {
						this.tipsMin = resa.data.withdrawConfig.minMoney
						uni.setStorageSync('agentMsg', resa.data)
					}
				})
			},
			getDa() { //获取当前月份
				return new Date().getMonth() + 1;
			},
			jemp(path) { //页面跳转
				if (path == 'phone') {
					this.$refs.phoneMode.open()
					return
				}
				if (path == 'helpCenter') {
					uni.navigateTo({
						url: '/pagesIndex/helpCenter/helpCenter'
					})
					return
				}
				if (path == 'share') {
					return
				}
				if(path=='/pagesMy/withdrawalList/memberWithdrawalList'&&this.agentShow){
					path='/pagesMy/withdrawalList/withdrawalList'
				}
				this.checkLogIn(() => {
					uni.navigateTo({
						url: path
					})
				})
			},
		},
	}
</script>

<style lang="scss">
	.goGift{
		display: block;
		width: 100%;
	}
	.phb{
		width: 200rpx;
		padding: 15rpx 20rpx;
		border: 1rpx #00B3E0 solid;
		border-radius: 10rpx;
		color: #00B3E0;
	}
	.activeView{
		.activeList{
			padding: 20rpx 0;
			text-align: center;
			color: #0084c1;
			border-bottom: 1rpx #f1f1f1 solid;
			font-size: 26rpx;
		}
		:last-of-type{
			border: none;
		}
	}
	.felx{
		display: flex;
	}
	.activeAll{
		background-color: #fff;
		border-radius: 20rpx;
		margin: 0 30rpx;
		padding: 30rpx 20rpx 35rpx;
		.activeHead{
			border-bottom: 1rpx #f1f1f1 solid;
			padding-bottom: 10rpx;
		}
		.listItem{
			padding: 30rpx 10rpx;
			border-bottom: 1rpx #f1f1f1 solid;
			.listItemR{
				padding-left: 20rpx;
			}
		}
		.activeDiv{
			display: flex;
			height: 50rpx;
			width: 400rpx;
			background-color: #ddd;
			border-radius: 30rpx;
			margin-top: 40rpx;
			line-height: 50rpx;
			::after{
				content: '';
				display: block;
				clear: both;
			}
		}
		.activeWrap{
			position: relative;
			width: 100%;
			height: 50rpx;
			// margin: 30rpx 0rpx;
			background-color: #ddd;
			border-radius: 30rpx;
			.activeProgress{
				width: 0%;
				height: 50rpx;
				background-color: #ffa200;
				border-radius: 30rpx;
				
			}
			.activeTips{
				width: 100%;
				position: absolute;
				text-align: center;
				color: #fff;
				top: 0;
				left: 0;
				z-index: 2;
			}
		}
		.getUrl{
			height: 50rpx;
			text-align: center;
			padding:0 20rpx;
			background-color: #ffa200;
			line-height: 50rpx;
			border-radius: 30rpx 0 0 30rpx;
			// margin: 30rpx 0;
			text{
				// margin: 10rpx 20rpx;
				// padding: 14rpx 20rpx;
				// border: 1rpx #f1f1f1 solid;
				border-radius: 10rpx;
				color: #fff;
			}
		}
		.getActive{
			text{
				// border-color: #00B3E0;
				// color: #00B3E0;
			}
		}
	}
	.blue{
		color: #00B3E0;
	}
	.uni-calendar--hook{
		display: flex;
		flex-direction: column;
	}
	.agentListdata {
		width: 690rpx;
		margin: 20rpx auto;
		padding: 40rpx;
		background-color: #ddd;
		border-radius: 20rpx;

	}

	.agentListCont {
		width: 50%;
		text-align: center;
		justify-content: center;
		align-items: center;
		// border-right: 1rpx #ccc solid;
	}

	page {
		background-color: #f1f1f1;
	}

	button[class="button"]::after {
		border: 0;
	}

	.pop-view {
		background-color: #fff;
		border-radius: 30rpx;
		padding: 30rpx 20rpx;
	}

	.questionBtn {
		margin-top: 50rpx;
		width: 156rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		border-radius: 26rpx;
		background: rgba(255, 255, 255, 0.5);
		font-size: 24rpx;
	}

	.tags {
		position: relative;

		.tags-view {
			position: absolute;
			background: rgba(255, 255, 255, 0.5);
			left: -30rpx;
			border-radius: 0 30rpx 30rpx 0;
			padding: 10rpx 30rpx;
		}
	}

	.nav {
		width: 100%;
		height: 536rpx;
		background-color: $theme-color;
		border-bottom-left-radius: 100rpx;
	}

	.content {
		width: 100%;
		padding-bottom: 80rpx;

		.numberButton {
			display: flex;
			align-items: center;
			justify-content: center;

			width: 100rpx;
			padding: 6rpx 0;
			border-radius: 30rpx;
			background-color: #fff;
			color: $theme-color;
			margin-left: 6rpx;
			font-size: 22rpx;
		}

		.avatar {
			width: 118rpx;
			height: 118rpx;
			border: 2px solid #333;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.auto {
			width: calc(100% - 60rpx);
			margin: auto;
			margin-top: 20rpx;
		}

		.region {

			background-color: #fff;
			border-radius: 20rpx;
			padding: 0 20rpx;
			display: flex;

			.region-item {
				width: 100%;
				padding: 34rpx 0;
				font-size: 30rpx !important;

				.button {
					width: 100%;
					padding: 0 !important;
					margin: 0 !important;
					border: #ffffff 0px !important;
					border-radius: 0 !important;
					background-color: #ffffff !important;
					line-height: normal !important;
					font-size: 28rpx !important;

					::after {
						border: none !important;
					}
				}


			}

			.item-1 {
				width: 100%;
				// display: flex;
				// align-items: center;
				// justify-content: space-between;
			}

			.region-item view:first-child {
				// display: flex;
				text-align: center;
				font-size: 28rpx;
				text{
					padding-top: 10rpx;
				}
			}
		}

		.menu-list {
			width: calc(100% - 60rpx);
			margin: 20rpx auto 0;
			background-color: #fff;
			border-radius: 20rpx;
			overflow: hidden;

			.menu-cell {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx;
				border-bottom: 1rpx solid #f0f0f0;

				&:last-child {
					border-bottom: none;
				}

				.menu-cell-left {
					display: flex;
					align-items: center;
				}

				.menu-cell-text {
					font-size: 30rpx;
					color: #333333;
					margin-left: 20rpx;
				}
			}
		}

	}

	// 环保账单
	.save {
		height: 220rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		margin-top: 40rpx;

		.save-right-nav {
			font-size: 24rpx;
			padding-right: 20rpx;
			color: $theme-color;
		}

		.save-num {
			width: 100%;
			display: flex;
			justify-content: space-around;
			padding: 20rpx 30rpx;

			.save-num-f view:first-child {
				font-size: 32rpx;
				color: #333333;
				line-height: 60rpx;
			}

			.save-num-f view:last-child {
				font-size: 24rpx;
				color: #999999;
			}
		}



		.save-title {
			width: 330rpx;
			height: 60rpx;
			background-color: #353b54;
			border-top-right-radius: 30rpx;
			border-bottom-right-radius: 30rpx;
			border-top-left-radius: 20rpx;
			text-align: center;
			line-height: 60rpx;
			font-size: 32rpx;
			color: #ffffff;
		}
	}

	// 广告图
	.ad {
		height: 132rpx;
		margin-top: 20rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.status {
		font-size: 28rpx;
		color: #fff;
		display: flex;
		align-items: center;
		padding: 0rpx 0rpx 20rpx;
	}

	.status text {
		margin-right: 6rpx;
	}

	.tuiGuangBtn {
		width: 156rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		border-radius: 26rpx;
		background: #fff;
		font-size: 24rpx;
		color: #2A9F4E;
	}

	.account-view {
		width: 690rpx;
		height: 328rpx;
		position: relative;
		overflow: hidden;
		border-radius: 30rpx 30rpx 30rpx 30rpx;
		opacity: 1;
		margin: 30rpx;
		padding: 36rpx 28rpx;
	}

	.account-bg-img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}
	.account-view > view:not(.account-bg-img) {
		position: relative;
		z-index: 1;
	}
</style>
