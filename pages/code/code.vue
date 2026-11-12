<template>
	<view>
		<view class="title font-weight">请在回收机屏幕完成操作</view>
		<view class="font-weight u-font-36 u-text-center colors">以下物品严禁投递</view>
		<view class="font-weight u-font-24 u-text-center u-p-t-10 colors">违规投递将扣除当次金额，严重则封号</view>
		<view class="u-p-20 u-p-l-60 u-p-r-60 u-flex" style="flex-wrap: wrap">
			<view class="u-flex item" style="flex-direction: column;" v-for="(item,index) in list" :key="index">
				<image mode="widthFix" :src="xunHelper.detectUrl(item.picture)"></image>
				{{item.name}}
				<image class="prohibit" src="/static/index/prohibit.png"></image>
			</view>
		</view>
		<view class="btn">
			<view v-if="codesShow" class="button1" @click="sendOpens">已熟知，开始投递</view>
			<view class="button2" @click="toOut">返回首页</view>
		</view>
	</view>
</template>

<script>
	import {
		equipmentWaste,
		sendCommand,
		sendOpen
	} from '@/api/index.js'
	export default {
		data() {
			return {
				info: {},
				list: [],
				codes: '',
				codesShow: true
			}
		},
		onLoad(options) {
			this.getList()
			console.log(options);
			if (options.data) {
				this.codes = options.data
			}
		},
		methods: {
			sendOpens() {
				sendOpen({
					scanValue: this.codes
				}).then(res => {
					console.log(res);
					uni.showToast({
						icon: 'none',
						title: res.msg
					})
					if(res.code == 200){
						this.codesShow = false
					}
				})
			},
			toOut() {
				uni.navigateBack({})
			},
			getList() {
				equipmentWaste({}).then(res => {
					this.list = res.data
				})
			}
		}
	}
</script>

<style lang="scss">
	.title {
		padding: 30rpx 0rpx 40rpx;
		width: 100%;
		font-size: 48rpx;
		text-align: center;
	}

	.colors {
		color: #f52323;
	}

	.btn {
		width: 390rpx;
		margin: 40rpx auto 0;

		view {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 388rpx;
			height: 92rpx;
			border-radius: 46rpx;
			font-weight: bold;
		}

		.button1 {
			color: #fff;
			// border: solid 2px #4fdaf9;
			background-image: linear-gradient(90deg, #4ff5f9 0%, #4fdaf9 100%);
		}

		.button2 {
			margin-top: 20rpx;
			border: solid 2px #4fdaf9;
			color: #4fdaf9;
		}
	}

	.item {
		position: relative;
		width: 33%;
		margin-top: 60rpx;

		image {
			width: 120rpx;
		}

		.prohibit {
			position: absolute;
			right: 50rpx;
			bottom: 40rpx;
			width: 34rpx;
			height: 34rpx;
			animation: scaleDraw 2s ease-in-out 2;
		}

		@keyframes scaleDraw {

			/*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
			0% {
				transform: scale(1);
				/*开始为原始大小*/
			}

			25% {
				transform: scale(1.5);
				/*放大1.1倍*/
			}

			50% {
				transform: scale(1);
			}

			75% {
		 	transform: scale(1.5);
			}
		}
	}
</style>
