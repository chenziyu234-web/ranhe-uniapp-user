<template>
	<view>
		<uni-nav-bar @clickLeft="toBack" leftIcon="left" :title="info.title" statusBar></uni-nav-bar>
		<view class="u-p-30">
			<mp-html :content="info.content"></mp-html>
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
				info: {}
			}
		},
		onLoad(options) {
			this.getList(options.id)
		},
		computed: {
			menuButton() {
				return this.$store.state.user.menuButton || {}
			}
		},
		methods: {
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
</style>
