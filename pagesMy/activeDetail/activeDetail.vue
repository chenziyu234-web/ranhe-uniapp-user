<template>
	<view>
		<view class="headImg">
			<u-swiper border-radius="0" :list="activeList" height="400"></u-swiper>
			<!-- <image :src="'http://192.168.2.106' + pgdata.cover" mode="widthFix"></image> -->
		</view>
		<view class="main">
			<view class="tit">
				<view class="bigtit">{{pgdata.Name}}</view>
				<view class="smalltit">
					<text class="padding-right10">发布时间：{{pgdata.onlineTime}}</text>
					<text>浏览量：{{UV}}</text>
				</view>
			</view>
		</view>
		<view class="mainBody">
			<mp-html :content="pgdata.description"></mp-html>
		</view>
		<view class="btn">
			<button open-type="share" class="share">分享活动</button>
			<text class="share bmActive" @click="getApply" v-if="pgdata.needEnroll">{{pgdata.isRegistered == 1 ? '已报名' : '报名活动'}}</text>
		</view>
	</view>
</template>

<script>
	import {
		getActivityList,
		activityApply,
		activityView,
		activityViewTotal
	} from '@/api/index.js'
	export default {
		data() {
			return {
				pgdata:'',
				id: '',
				UV: '',
				activeList: ''
			}
		},
		onLoad(option) {
			this.id = option.data
			this.getDetail()
			this.activityView()
			this.activityViewTotal()
			console.log(option)
		},
		onShareAppMessage() {
			return{
				title: this.pgdata.name,
				path: '/pagesMy/activeDetail/activeDetail?data=' + this.id
			}
		},
		onShow() {
			
		},
		methods: {
			//查看
			activityViewTotal(){
				activityViewTotal({activityId:this.id}).then( res =>{
					this.UV = res.data.totalViews
				})
			},
			//新增活动浏览量
			activityView(){
				activityView({activityId:this.id}).then( res =>{
					console.log(res)
				})
			},
			//活动信息
			getDetail(){
				getActivityList({activityId:this.id}).then( res =>{
					if(res.data == undefined || res.data == null || res.data == ''){
						uni.showModal({
							title: "暂无参与资格",
							success:function(){
								uni.navigateBack()
							}
						})
						return
					}
					const data = res.data[0]
					this.pgdata = data
					uni.setNavigationBarTitle({
						title: data.name
					})
					if(data.pics != null && data.pics != ''){
						this.activeList = data.pics.map(item => {
							return {
								...item,
								image: this.xunHelper.detectUrl(item)
							}
						})
					}else{
						this.activeList = [this.xunHelper.detectUrl(data.cover)]
					}
				})
			},
			getApply(){
				activityApply({activityId:this.id}).then( resa =>{
					this.getDetail()
					console.log(resa,'222222')
				})
			}
		}
	}
</script>

<style lang="scss">
	.headImg{
		image{
			width: 100%;
		}
	}
	.main{
		padding: 30rpx 20rpx 5rpx;
	}
	.mainBody{
		padding: 40rpx 30rpx 120rpx;
	}
	.tit{
		border-bottom: 1rpx #f1f1f1 solid;
		.bigtit{
			font-size: 36rpx;
			color: #333;
		}
		.smalltit{
			text-align: right;
			font-size: 26rpx;
			color: #999;
			padding-bottom: 10rpx;
		}
	}
	.btn{
		position: fixed;
		display: flex;
		width: 100%;
		bottom: 40rpx;
		justify-content: center;
		align-items: center;
		
		.share{
			width: 200rpx;
			height: 80rpx;
			margin: 0 40rpx 0 0;
			line-height: 80rpx;
			background: #fff;
			font-size: 36rpx;
			color: #666;
		}
		.bmActive{
			width: 300rpx;
			background-color: #0084c1;
			color: #fff;
			text-align: center;
			border-radius: 10rpx;
		}
	}
</style>