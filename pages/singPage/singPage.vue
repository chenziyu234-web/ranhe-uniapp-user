<template>
	<view class="over-hidden">
		<!-- #ifdef MP-WEIXIN -->
		<uni-nav-bar @clickLeft="toBack" leftIcon="left" :title="info.title" statusBar></uni-nav-bar>
		<!-- #endif -->
		<view class="u-p-30" style="margin-bottom: 120rpx;position: relative;">
			<mp-html :content="info.content"></mp-html>
			<!-- #ifdef MP-ALIPAY -->
			<view class="zgbg" v-if="audit == '1'"></view>
			<!-- #endif -->
		</view>
		<view v-if="id == '24'" class="fixedBtn u-row-between width-100 u-col-center">
			<view class="u-font-28 text-333333">申请成为合伙人</view>
			<view>
				<u-button @click="toSlot(22)" :hairLine="false" hover-class="none" shape="circle" :customStyle="{width:'300rpx',height:'88rpx',background:'#00B3E0',color:'#fff'}">我要合作</u-button>
			</view>
		</view>
		
	</view>

</template>

<script>
	import {
		contentpage,
		newsGet
	} from '@/api/index.js'
	export default {
		data() {
			return {
				info: {},
				id:''
			}
		},
		onLoad(options) {
			console.log(options);
			this.id = options.id
			this.getList(options.id, options.type || null)
		},
		computed: {
			menuButton() {
				return this.$store.state.user.menuButton || {}
			},
			audit(){
				return this.$store.getters.global.online_audit?.alipayAuditOpen
			},
		},
		methods: {
			toSlot(id) {
				uni.navigateTo({
					url: `/pagesMy/postAgent/index`
				})
			},
			toBack() {
				uni.navigateBack({})
			},
			getList(id, type) {
				if (!type) {
					contentpage({
						id: id
					}).then(res => {
						this.info = res.data
					})
				} else if (type == 2) {
					newsGet({
						id: id
					}).then(res => {
						this.info = res.data
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	.nav {
		.nav-name {
			width: 400rpx;
		}

		image {
			height: 58rpx;
			width: 58rpx;
		}
	}
	.fixedBtn{
		position: fixed;
		background-color: #fff;
		bottom: 0;
		display: flex;
		width: 100%;
		padding: 30rpx;
	}
	.zgbg{
		position: absolute;
		background-color: #fff;
		width: 100%;
		height: 350rpx;
		bottom: 328rpx;
	}
</style>
