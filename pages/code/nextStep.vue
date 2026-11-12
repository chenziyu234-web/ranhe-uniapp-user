<template>
	<view class="bgImg main">
		<view class="mainhead contentbox">
			<text class="font-s30 color-666 padding-20">本次投递收益</text>
			<view class="padding-30">
				<text class="font-s70" style="color: #fd391f;">{{pageData.price}}</text>
				<text class="font-s24 color-666">元</text>
			</view>
			<view class="font-s30">订单审核中，收益24小时内入账</view>
			<view class="mainBox">
				<view class="mainBoxView">
					<text>回收价</text>
					<text>{{pageData.weight}}/kg × {{pageData.waste?.basePrice}}元/kg</text>
					<text>{{pageData.basePrice || ''}}元</text>
				</view>
				<view class="mainBoxView">
					<text>环保补贴</text>
					<text>{{pageData.weight}}/kg × {{pageData.waste?.bonusPrice}}元/kg</text>
					<text>{{pageData.bonusPrice || ''}}元</text>
				</view>
			</view>
			<view class="">
				{{pageData.waste.tips2}}
				<!-- (温馨提示：环保补贴会有浮动) -->
			</view>
			<view class="getback" @click="toIndex">
				回到首页
			</view>
		</view>
	</view>
	<!-- <view class="bgImg">
		<view class="contentbox">
			<view class="">本次投递重量：{{xunHelper.weightK(pageData.weight)}}KG</view>
			<view class="">此次投递获得金额：{{pageData.price}}元</view>
		</view>
		<view class="boxView"  v-if="active[0] !== ''">
			<view class="Boxtit">恭喜获得以下优惠</view>
			<view class="boxCenter">
				<view class="contentItem">
					<view class="boxItem">
						<view>
							<image :src="active[0]?.cover" mode="widthFix" class="imgContent"></image>
						</view>
						<view>
							<text>{{active[0]?.description}}</text>
						</view>
					</view>
					<view class="btnT" @click="goToN">领取当前优惠</view>
				</view>
			</view>
		</view>
		<view @click="toIndex" class="btnT btnT2">返回首页</view>
	</view> -->
</template>

<script>
	import { getActive,getResult } from "@/api/index"
	export default{
		
		data(){
			return{
				pageData: {},
				active: '',
			}
		},
		onLoad(options) {
			const data = JSON.parse(options.data)
			this.pageData = data
			// this.getActive()
		},
		methods:{
			getActive(){
				getActive({searchType: 1}).then(res =>{
					console.log(res,'res11111')
					this.active = res.data
				})
			},
			goToN(){
				wx.navigateToMiniProgram({
					appId: this.active[0].appId,
					path: this.active[0].link
				})
			},
			toIndex(){
				uni.switchTab({
					url: "/pages/index/index"
				})
			}
		},
		
	}
</script>

<style lang="scss">
	.getback{
		width: 450rpx;
		padding: 20rpx 0;
		margin: 200rpx auto 0; 
		border: 2rpx #00B3E0 solid;
		border-radius: 40rpx;
		font-size: 40rpx;
		text-align: center;
		color: #00B3E0;
	}
	.mainBox{
		border: 2rpx #f1f1f1 solid;
		border-radius: 5rpx;
		width: 80%;
		margin: 20rpx auto;
		padding: 30rpx;
		.mainBoxView{
			display: flex;
			justify-content: space-between;
			padding: 20rpx 0;
		}
	}
	.bgImg{
		padding-top: 100rpx;
		height: 100vh;
		background-image: url("/pagesIndex/static/080416293721_060.png");
		// background-color: #ccc;
		background-size: 100% 100%;
	}
	.contentbox {
		padding-top: 150rpx;
		text-align: center;

	}
	.boxView{
		padding: 60rpx 20rpx;
		.Boxtit{
			text-align: center;
			font-size: 36rpx;
			color: #d51114;
			font-weight: bold;
			margin-bottom: 30rpx;
		}
		.boxCenter{
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
	}
	.imgContent{
		width: 200rpx;
		height: 230rpx;
		margin-top: 25rpx;
	}
	.boxItem {
		width: 265rpx;
		height: 341rpx;
		border: 8rpx #4d82d5 solid;
		border-radius: 16rpx;
		text-align: center;
	}
	.btnT{
		font-size: 30rpx;
		color: $theme-color;
		padding: 15rpx 0;
		margin-top: 30rpx;
		border-radius: 6rpx;
		text-align: center;
		background-image: linear-gradient(0deg, #c9daf6 0%, #ffffff 100%);
		box-shadow: 0rpx 14rpx 18rpx 0rpx rgba(188, 212, 250, 0.42);
		border-radius: 60rpx;
	}
	.btnT2{
		width: 400rpx;
		padding: 20rpx 0;
		margin: 0 auto;
		background-image: linear-gradient(0deg, #4d82d5 0%, #ffffff 100%);
		color: #fff;
	}
</style>