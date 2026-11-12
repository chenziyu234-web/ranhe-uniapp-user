<template>
	<view class="nav-bg-fit-view" :style="{height: height}">
		<!-- <image class="nav-bg-fit-view-bgImg" src="/static/072814115009_0nav.png" mode="widthFix"></image> -->
		<view class="nav-bg-fit-content">
			<uni-nav-bar @clickLeft="toBack" leftIcon="left" color="#fff" :title="title" statusBar></uni-nav-bar>
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		name: "nav-bg-fit",
		data() {
			return {

			};
		},
		props:{
			height:{
				type:String,
				default: '368rpx'
			},
			title:{
				type:String,
				default: '乐驿分'
			}
		},
		methods:{
			toBack(){
				uni.navigateBack({})
			}
		}
	}
</script>

<style lang="scss">
	.nav-bg-fit-view {
		width: 100%;
		position: relative;
		background-color: $theme-color;
		color: #FFF;
		border-bottom-left-radius: 100rpx;

		.nav-bg-fit-view-bgImg {
			width: 100%;
			position: absolute;
			top: 0;
		}

		.nav-bg-fit-content {
			position: absolute;
			top: 0rpx;
			width: 100%;
			height: 100%;
		}
	}
</style>
