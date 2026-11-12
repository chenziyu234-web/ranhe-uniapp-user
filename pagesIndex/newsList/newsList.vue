<template>
	<view class="u-p-30">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view @click="toDetail(item)" class="news-item u-p-30 align-center row-between" v-for="(item,index) in reslutList"
				:key="item.id">
				<view style="width: calc(100% - 240rpx);">
					<view class="u-line-1 font-weight font-s28 u-p-b-20">{{item.title}}</view>
					<view class="u-line-2 font-s24 text-666666">{{item.description}}</view>
					<view class="color-999 font-s20 u-p-t-20">
						<text class="u-m-r-20">{{ item.hitNumber }}阅读</text>
						<text>{{ item.createTime }}</text>
					</view>
				</view>
				<image :src="xunHelper.detectUrl(item.feature ? item.feature.image : '')" style="width: 228rpx;height: 166rpx; "></image>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {
		newsList
	} from '@/api/index.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				reslutList: []
			}
		},
		methods: {
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				let pageNum = page.num; // 页码
				let pageSize = page.size; // 页长
				newsList({
					categoryId: 88,
					pageNum,
					pageSize
				}).then(res => {
					let list = res.rows
					if (pageNum == 1) this.reslutList = []
					this.reslutList = this.reslutList.concat(list);
					this.mescroll.endBySize(list.length, list.length + 10);
				}).catch(e => {
					this.mescroll.endErr()
				})
			},
			toDetail(item) {
				uni.navigateTo({
					url: './newsDetail?id='+item.id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}

	.news-item {
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 12rpx;

		image {
			// margin-left: 10rpx;
			border-radius: 10rpx;
		}
	}
</style>
