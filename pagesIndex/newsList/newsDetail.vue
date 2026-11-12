<template>
	<view class="u-p-30">
		<view class="font-s40 font-weight u-m-t-40">{{query.title}}</view>
		<view class="color-999 font-s24 u-p-t-14 u-p-b-60">{{query.createTime}}</view>
		<mp-html :content="query.content"></mp-html>
	</view>
</template>

<script>
	import {
		newsGet
	} from '@/api/index.js'
	export default {
		data() {
			return {
				query: {}
			}
		},
		onLoad(options) {
			this.getList(options.id)
		},
		methods: {
			getList(id) {
				newsGet({
					id: id
				}).then(res => {
					this.query = res.data
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
