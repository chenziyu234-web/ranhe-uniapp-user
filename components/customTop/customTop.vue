<template>
	<view class="pos-r" :style="{paddingTop:navbarHeight+'px'}" >
		<u-navbar title-width="400" :title-bold="true" :title-color="titleColor" title-size="32" :background="bg" :title="title" :isFixed="true"
			:immersive="true" :borderBottom="false" :isBack="isBack" :backIconColor="titleColor">
				<slot name="diy"></slot>
			</u-navbar>
		<view class="topBg" :style="{height:bgHeight}" v-if="bgSrc!=''" >
			<image :src="bgSrc" mode="" class="head-bg" ></image>
		</view>
	</view>
</template>

<script>
	let systemInfo = uni.getSystemInfoSync();
	export default {
		name: "customTop",
		data() {
			return {
				statusBarHeight: systemInfo.statusBarHeight,
			};
		},
		props: {
			titleColor:{
				type: String,
				default: '#333'
			},
			bgSrc: {
				type: String,
				default: ''
			},
			bgHeight: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			isBack: {
				type: Boolean,
				default: false
			},
			bg: {
				type: Object,
				default () {
					return {}
				}
			},
			background:{
				type:String,
				default:'linear-gradient(180deg, #F8FAFC 0%, #FBE4D4 27%, #FFFFFF 100%)'
			}
		},
		computed: {
			// 转换字符数值为真正的数值
			navbarHeight() {
				// #ifdef APP-PLUS || H5
				return 44 + this.statusBarHeight;
				// #endif
				// #ifdef MP
				// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
				// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
				// return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
				let height = systemInfo.platform == 'ios' ? 44 : 48;
				return height + this.statusBarHeight;
				// #endif
			},
		},
		methods:{
			asd(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.topBg {
		position: absolute;
		width: 100%;
		top: 0;
	}
	.head-bg{
		width: 100%;
		height: 100%
	}
</style>