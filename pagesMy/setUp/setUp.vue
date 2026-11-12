<template>
	<view>
		<view class="item u-flex u-row-between u-p-t-60" @click="jemp('1')">
			<view class="u-font-28">用户协议</view>
			<view><u-icon name="arrow-right" color="#999"></u-icon></view>
		</view>
		<view class="item u-flex u-row-between u-border-bottom u-border-top" @click="jemp('2')">
			<view class="u-font-28">隐私政策</view>
			<view><u-icon name="arrow-right" color="#999"></u-icon></view>
		</view>
		<!-- <view v-if="userInfo&&userInfo.publicityFlag == 1" class="item u-flex u-row-between" @click="openTuiGuang">
			<view class="u-font-28">推广码</view>
			<view><u-icon name="arrow-right" color="#999"></u-icon></view>
		</view> -->
		<!-- <view class="item u-flex u-row-between" @click="toFeedback">
			<view class="u-font-28">意见反馈</view>
			<view><u-icon name="arrow-right" color="#999"></u-icon></view>
		</view> -->
		<view class="u-p-30">
			<button @click="outLogin">退出登录</button>
		</view>
		
		<u-modal v-model="showCodeUrl" title="宣传码">
			<view class="slot-content u-flex u-row-center u-col-center margin-col-20">
				<image style="width: 400rpx;height: 400rpx" :src="codeUrl" mode=""></image>
			</view>
		</u-modal>
		
	</view>
</template>

<script>
	import{		xuanChaunCodeApi} from '@/api/index.js'
	export default {
		data() {
			return {
				codeUrl: '',
				showCodeUrl: false,
			}
		},
		methods: {
			openTuiGuang() {
				xuanChaunCodeApi().then(res => {
					if (res.code == 200) {
						this.codeUrl = this.xunHelper.detectUrl(res.data)
						this.showCodeUrl = true
					}
				})
			},
			jemp(id){
				uni.navigateTo({
					url:'/pages/singPage/singPage?id='+id
				})
			},
			toFeedback(){
				uni.navigateTo({
					url: '../feedback/feedback'
				})
			},
			outLogin(){
				uni.showModal({
					content:'确定退出登录？',
					success: (res) => {
						if(res.confirm){
							this.$store.dispatch('user/logOut')
							// #ifdef MP-WEIXIN
							uni.switchTab({
								url: '/pages/index/index'
							})
							// #endif
							// #ifdef MP-ALIPAY
							uni.reLaunch({
								url: '/pages/index/index'
							})
							// #endif
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f4f4f4;
	}
	.item{
		width: 100%;
		padding: 30rpx 30rpx;
		background-color: #fff;
	}
	button{
		background-color: #4E80FF;
		border-radius: 50rpx;
		color: #fff;
	}
</style>
