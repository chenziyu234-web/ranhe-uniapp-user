<template>
	<view class="view">
		<view :style="{height: menu.top + 'px'}"></view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="nav-view padding-row-30 u-font-32 text-white" :style="{height: navHeight + 'px' || '42px'}">
			<view class="center">
				<u-icon @click="toBack" name="arrow-left" size="36" color="#000"></u-icon>
				<text @click="toBack" class="font-s36 text-333333 u-m-l-10">投口选择</text>
			</view>
		</view>
		<!-- #endif -->
		

		<view class="content">
			<view v-for="(item,index) in list" :key="index" @click="setIndex(item)" class="item"
				:class="item.status!='1'?'bg-hui':''">
				<view class="left-label" :class="item.status!='1'?'bg-red':''">{{getStatusLabel(item)}}</view>
				<image v-if="getIndex(item)" class="active" src="../../static/index/35.png"></image>
				<view class="item-center" :class="item.status!='1'?'bg-hui':''">
					<image :src="xunHelper.detectUrl(item.logo)"></image>
					<text class="u-m-t-20">{{item.name}}</text>
					<text class="u-m-t-10"><text style="color: #FF8245;">{{item.price}}元</text> / 千克</text>
				</view>
			</view>
		</view>

		<view class="btn-view u-flex-col">
			<!-- :class="showOpen?'disabled':''" -->
			<view class="btn" @tap="sendOpens">
				<image src="../../static/index/144.png"></image><text>点击开门</text>
			</view>
			<view class="btn2 u-m-t-30" @tap="sendClose">
				<image src="../../static/index/144.png"></image><text>立即关门</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		equipmentOutlet,
		sendOpen,
		getResult,
		sendClose as sendCloseApi,
	} from '@/api/index.js'
	export default {
		data() {
			return {
				showOpen:false,
				list: [],
				numbers: [],
				codes: '',
				uuid: '',
				sn: '',
				SetTime: null
			}
		},
		computed: {
			menu() {
				return this.$store.state.user.menuButton || {}
			},
			navHeight() {
				return this.menu.bottom - this.menu.top
			}
		},
		onLoad(options) {
			const {
				uuid,
				data,
				sn
			} = options;
			const decodeRouteParam = value => {
				try {
					return decodeURIComponent(value || '')
				} catch (error) {
					return value || ''
				}
			}
			this.codes = decodeRouteParam(data);
			this.uuid = decodeRouteParam(uuid);
			this.sn = decodeRouteParam(sn) || this.uuid;
			this.getList(this.uuid)
			this.SetTime = setTimeout(()=>{
				this.seachSn()
			},40000)
		},
		beforeUnmount() {
			clearTimeout(this.SetTime)
			this.SetTime = null
		},
		onUnload(){
			clearTimeout(this.SetTime)
			this.SetTime = null
		},
		onHide(){
			clearTimeout(this.SetTime)
			this.SetTime = null
		},
		methods: {
			seachSn(){
				clearTimeout(this.SetTime)
				this.SetTime = null
				getResult({sn:this.sn}).then(res=>{
					if(res.code == 200){
						const data = res.data
						if(data.result == 1){
							if(!data.isException && this.sn == data.sn){
								const op = JSON.stringify(data)
								uni.navigateTo({
									url: '/pages/code/nextStep?data=' + op
								})
							}else{
								uni.showModal({
									title: '温馨提示',
									content: '未检测到有效投递重量',
									success() {
										uni.reLaunch({
											url: '/pages/index/index'
										})
									}
								})
							}
						}else{
							this.SetTime = setTimeout(()=>{
								this.seachSn()
							},3000)
						}
					}else{
						//非200响应：继续轮询，避免设备无响应时页面卡死
						this.SetTime = setTimeout(()=>{
							this.seachSn()
						},3000)
					}
				}).catch(err => {
					//请求失败：继续轮询，避免设备无响应时页面卡死
					this.SetTime = setTimeout(()=>{
						this.seachSn()
					},3000)
				})
			},
			setIndex(item) {
				if (!item || String(item.status) !== '1') return;
				let find = this.numbers.findIndex((items, index) => items == item.numbers)
				if (find == -1) {
					// this.numbers = [...this.numbers, item.numbers]
					this.numbers = [item.numbers]
				} else {
					this.numbers.splice(find, 1)
				}
				// this.sendOpens()
			},
			getIndex(item) {
				let find = this.numbers.filter(items => items == item.numbers);
				if (find[0]) return true;
				return false;
			},
			getStatusLabel(item) {
				if (item.status == '1') return "正常";
				return "满仓"
			},
			getList(uuid) {
				equipmentOutlet({
					uuid
				}).then(res => {
					const list = Array.isArray(res.data) ? res.data : [];
					this.list = list;
					this.numbers = [];
					if (list.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '该设备暂无可用投口'
						})
						return;
					}
					this.$nextTick(() => {
						this.setIndex(list[0])
					})
				}).catch(err => {
					this.list = [];
					this.numbers = [];
					this.logError(err)
					uni.showToast({
						icon: 'none',
						title: '投口加载失败，请重试'
					})
				})
			},
			sendOpens() {
				if(this.showOpen){
					return 
				}
				if (this.$u.test.isEmpty(this.numbers)) {
					uni.showToast({
						icon: 'none',
						title: "请选择投递的投口"
					})
					return
				}
				console.log(this.numbers);
				console.log(this.codes);
				sendOpen({
					scanValue: this.codes,
					numbers: this.numbers,
					lon: this.$store.state.user.location.longitude,
					lat: this.$store.state.user.location.latitude
				}).then(res => {
					uni.showToast({
						icon: 'none',
						title: res.msg
					})
					if (res.code == 200) {
						this.codesShow = false
						// uni.showModal({
						// 	title:'提示',
						// 	content:'投递成功',
						// 	success: (item) => {
						// 		if(item.confirm){
						// 			uni.navigateTo({
						// 				url:'/pagesMy/myOrder/myOrder'
						// 			})
						// 		}else{
						// 			uni.navigateBack()
						// 		}
						// 	}
						// })
					}
				}).catch(err => {
					this.logError(err)
				})
			},
			sendClose() {
				if (this.$u.test.isEmpty(this.numbers)) {
					uni.showToast({
						icon: 'none',
						title: "请选择关闭的投口"
					})
					return
				}
				sendCloseApi({
					scanValue: this.codes,
					numbers: this.numbers,
					lon: this.$store.state.user.location.longitude,
					lat: this.$store.state.user.location.latitude
				}).then(res => {
					uni.showToast({
						icon: 'none',
						title: res.msg
					})
					if (res.code == 200) {
						this.showOpen = true
						this.codesShow = false
						this.seachSn()
					}
				}).catch(err => {
					this.logError(err)
				})
			},
			toBack() {
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss">
	.view {
		width: 100%;
		height: 100vh;
		background-image: url('../../static/28.png');
		background-size: 100% 100%;

		.btn-view {
			width: 100%;
			padding: 120rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 437rpx;
				height: 118rpx;
				background-image: linear-gradient(0deg, #c9daf6 0%, #ffffff 100%);
				box-shadow: 0rpx 14rpx 18rpx 0rpx rgba(188, 212, 250, 0.42);
				border-radius: 60rpx;
				font-size: 48rpx;
				color: $theme-color;

				image {
					width: 52rpx;
					height: 49rpx;
					margin-right: 6rpx;
				}
			}
			.disabled{
				background-image: linear-gradient(0deg, #575e6a 0%, #c2c2c2 100%);
			}

			.btn2 {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 437rpx;
				height: 118rpx;
				background-image: linear-gradient(0deg, #20A465 0%, #ffffff 100%);
				// box-shadow: 0rpx 14rpx 18rpx 0rpx rgba(188, 212, 250, 0.42);
				// background-color: #4D82D5;
				border-radius: 60rpx;
				font-size: 48rpx;
				color: $theme-color;
				// color: #fff;

				image {
					width: 52rpx;
					height: 49rpx;
					margin-right: 6rpx;
				}
			}
		}

		.content {

			display: flex;
			align-items: center;
			justify-content: space-around;
			width: 100%;
			padding: 200rpx 30rpx 0;

			.active {
				position: absolute;
				right: 0;
				top: 0;
				width: 97rpx;
				height: 88rpx;
			}

			.bg-hui {
				background-color: #B0C5C5 !important;
			}

			.item {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 265rpx;
				height: 341rpx;
				background-color: #4d82d5;
				border-radius: 30rpx;

				.left-label {
					position: absolute;
					left: 0;
					top: 0;
					z-index: 2;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100rpx;
					height: 50rpx;
					background-color: #20a465;
					border-top-left-radius: 30rpx;
					border-bottom-right-radius: 30rpx;
					color: #ffffff;
				}

				.bg-red {
					background-color: #fe4157;
				}

				.item-center {
					width: 246rpx;
					height: 322rpx;
					background-color: #ffffff;
					border-radius: 30rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					image {
						width: 174rpx;
						height: 132rpx;
					}
				}
			}
		}
	}
</style>
