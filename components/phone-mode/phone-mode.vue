<template>
	<u-modal v-model="showPhone" :show-title="false" show-cancel-button confirm-color="#2A9F4E" @confirm="confirm">
		<view class="u-flex-col u-row-center u-col-center phone-view">
			<image src="/static/me/call.png" class="phone-icon"></image>
			<view class="u-m-t-50 u-font-32">点击拨打 {{ mobile || phoneNumber}}</view>
		</view>
	</u-modal>
</template>

<script>
	export default {
		name: "phone-mode",
		data() {
			return {
				showPhone: false,
				mobile: ''
			};
		},
		computed: {
			phoneNumber() {
				return this.$store.state.settings.global.system.phone || ''
			}
		},
		methods: {
			open(val) {
				if(val){
					this.mobile = val
				}
				this.showPhone = true
			},
			confirm() {
				console.log(this.phoneNumber);
				uni.makePhoneCall({
					phoneNumber: this.mobile ? this.mobile : this.phoneNumber
				})
			}
		}
	}
</script>

<style lang="scss">
	.phone-view {
		height: 310rpx;

		.phone-icon {
			width: 114rpx;
			height: 114rpx;
		}
	}
</style>
