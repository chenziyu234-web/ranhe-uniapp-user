<template>
	<view class="box">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="message-lists">
				<view class="message-list u-m-t-30" v-for="(item,index) in list" :key="index">
					<view class="u-flex u-border-bottom u-p-b-30">
						<view class="font-weight ">{{item.title}}</view>
						<!-- <view></view> -->
					</view>
					<view class="u-font-26 color-999 u-line-2 u-p-t-30" style="width: 626rpx;">{{item.content}}</view>
					<view class="u-flex u-font-22 u-m-t-30" style="color: #c1c1c1;">
						<view class="">时间：{{item.createTime}}</view>
					</view>
				</view>
			</view>
		</mescroll-body>

	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		messageList
	} from '@/api/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				type: '',
				list: [],
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10, // 每页数据的数量,默认10
					},
					noMoreSize: 5,
					textNoMore: '--我也是有底线的--',
					empty: {
						use: true,
						icon: '/static/msg-kong.png',
						tip: "哎呀，暂无消息",
						desc: '不如尝试下拉刷新一下～',
					},
				},
			}
		},
		onLoad(options) {
			this.type = options.type

		},
		methods: {
			toBack() {
				uni.navigateBack({})
			},
			downCallback() { //下拉回调
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				//联网加载数据
				let pageSize = page.size
				let pageNum = page.num
				messageList({
					pageNum,
					pageSize,
					types: this.type
				}).then(res => {
					let curPageData = res.data
					if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
					this.list = this.list.concat(curPageData); //追加新数据
					this.mescroll.endByPage(curPageData.length, curPageData.length + 10);
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fafafa;
	}

	.nav image {
		height: 58rpx;
		width: 58rpx;
	}

	.order image {
		margin: 400rpx auto 0;
		height: 240rpx;
		width: 380rpx;
	}
	.message-lists{
		width: 750rpx;
		padding: 30rpx;
	}
	.message-list {
		width: 690rpx;
		// height: 286rpx;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
	}
</style>
