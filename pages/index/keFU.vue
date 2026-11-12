<template>
	<view>
		<u-cell-item  title="客服电话" @click="telPhone(phone)">
			{{ phone || (loading ? '正在加载客服信息…' : '客服电话暂未配置') }}
		</u-cell-item>
		<view v-if="loadFailed" class="service-notice">
			客服信息加载失败，请稍后重试。
			<text class="service-retry" @click="loadServiceConfig">重新加载</text>
		</view>
		<u-cell-item v-if="giftServiceEnabled" title="客服领取礼品" @click="showGiftService">
			领取条件及客服联系方式
		</u-cell-item>
		<!-- 在线客服临时下线，代码保留待后续重新启用 -->
		<u-cell-item v-if="false" title="在线客服">
			<u-button @click="wxkefu" :customStyle="{border:'none'}" plain :hair-line="false" hover-class="none"></u-button>
		</u-cell-item>
		<u-tabbar :list="tabbarList" active-color="#00B3E0"></u-tabbar>
	</view>
</template>

<script>
	import config from '@/config.js'
	import { getConfig } from '@/api/public.js'

	export default {
		data() {
			return {
				giftServiceEnabled: config.giftServiceEnabled === true,
				loading: false,
				loadFailed: false
			}
		},
		computed:{
			phone(){
				const globalConfig = this.$store.state.settings.global || {}
				const phone = globalConfig.system && globalConfig.system.phone
				return typeof phone === 'string' || typeof phone === 'number' ? String(phone).trim() : ''
			}
		},
		onShow() {
			this.loadServiceConfig()
		},
		methods: {
			async loadServiceConfig() {
				if (this.loading) return
				this.loading = true
				this.loadFailed = false
				try {
					const res = await getConfig()
					this.$store.commit('settings/SET_GLOBAL', res.data)
				} catch (error) {
					this.loadFailed = true
				} finally {
					this.loading = false
				}
			},
			showGiftService(){
				uni.showModal({
					title: '客服领取礼品',
					content: '请先确认符合活动领取条件，再联系客服登记领取。客服电话：' + (this.phone || '暂未配置'),
					confirmText: '联系客服',
					cancelText: '知道了',
					success: (res) => {
						if (res.confirm && this.phone) this.telPhone(this.phone)
					}
				})
			},
			wxkefu(){
				wx.openCustomerServiceChat({
					extInfo:{url:'https://work.weixin.qq.com/kfid/kfcc49c9c37e37db499'},
					corpId: 'ww92000dab4403c271',
					success(res) {
						console.log(res,'客服跳转成功')
					}
				})
			},
			telPhone(data){
				if (!data) {
					uni.showToast({ title: '客服电话暂未配置，请稍后再试', icon: 'none' })
					return
				}
				uni.makePhoneCall({
					phoneNumber: data
				})
			}
		}
	}
</script>

<style lang="scss">
	.service-notice { padding: 24rpx 32rpx; color: #666; font-size: 26rpx; }
	.service-retry { margin-left: 16rpx; color: #00B3E0; }
</style>
