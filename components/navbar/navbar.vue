<template>
	<view>
		<view :style="{height: menuButton.top + 'px',background:backColor}"></view>
		<view class="nav u-p-l-30 u-flex" :style="{background:backColor}">
			<image @click="toBack" src="/static/16.png" mode=""></image>
			<text class="u-font-36 u-m-l-20 font-weight">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "navbar",
		data() {
			return {

			};
		},
		computed: {
			menuButton() {
				return this.$store.state.user.menuButton || {}
			}
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			backColor: {
				type: String,
				default: ''

			}
		},
		methods: {
			toBack() {
				uni.navigateBack({})
			}
		}

	}
</script>

<style lang="scss">
	.nav image {
		height: 58rpx;
		width: 58rpx;
	}
</style>
