<template>
	<view>
		<u-swiper2 height="180" :autoplay="false" mode="rect" :list="list" bgColor="transparent"></u-swiper2>
	</view>
</template>

<script>
	export default {
		name: "machine-list",
		data() {
			return {
			};
		},
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			}
		},
		methods: {
			todetail(item) {
				uni.navigateTo({
					url: `/pagesIndex/deviceDetail/deviceDetail?id=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	
</style>