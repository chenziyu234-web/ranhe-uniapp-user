<template>
	<view>
		<mescroll-body @init="mescrollInit" :up="upOption" @down="downCallback" @up="upCallback">
			<view class="content">
				<view class="address padding-20" v-for="(item,index) in dataList" :key='item.id'
					@click="choseAddress(item)">
					<view class="u-m-r-10">
						<u-icon name="map" size="34" :color="themeColor"></u-icon>
						<!-- <image style="width: 34rpx; height: 34rpx;margin-top: 6rpx;" src="/pagesMy/static/addicon.png"></image> -->
					</view>
					<view style="width: calc(100% - 50rpx);">
						<view style="min-height: 84rpx;">
							<u-tag v-if="item.isDefault == 1" text="默认" mode="dark" size="mini" />
							<!--   :bg-color="themeColor" -->
							<text class="u-m-l-10">{{item.province}}{{item.city}}{{item.county}}</text>
						</view>
						<view class="u-tips-color u-p-t-20 u-p-b-10">
							{{item.recipientAddress}}
						</view>
						<view class="u-flex u-row-between">
							<view class="u-tips-color">
								<text class="u-m-r-10">{{item.recipientName}}</text><text>{{item.recipientPhone}}</text>
							</view>
							<image @click.stop="address('edit',item)" class="editicon" src="/static/70.png">
							</image>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
		<view class="button" @click="address('add')">
			<u-icon name="/pagesMy/static/add.png" size="40"></u-icon>
			<text class="u-m-l-10">新增回收地址</text>
		</view>
	</view>
</template>

<script>
	import {
		addressList,
		addressDetail,
		addressEdit,
		addressDelete
	} from '@/api/index.js'
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				dataList: [],
				mode: '',
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
						icon: '/static/address-kong.png',
						tip: "暂无收货地址",
						desc: '点击下方按钮新增地址！',
					},
				},
			}
		},
		onShow() {
			setTimeout(()=>{
				this.mescroll.resetUpScroll()
			},200)
		},
		onLoad(options) {
			this.mode = options.mode
		},
		methods: {
			/* 选择地址 */
			choseAddress(item) {
				console.log(item)
				if (this.mode == 'select') {
					this.$store.commit('user/SET_ADDRESS',item)
					uni.navigateBack({})
				}else{
					this.address('edit',item)
				}
			},
			address(type,item) {
				uni.navigateTo({
					url: `/pagesMy/address/addressEdit?type=${type}&id=${item ? item.id : ''}`
				})
			},
			downCallback() { //下拉回调
				this.mescroll.resetUpScroll()
			},
			upCallback(page) {
				//联网加载数据
				let pageSize = page.size
				let pageNum = page.num
				addressList({
					pageNum,
					pageSize
				}).then(res => {
					let curPageData = res.rows
					if (page.num == 1) this.dataList = [];
					this.dataList = this.dataList.concat(curPageData);
					this.mescroll.endByPage(curPageData.length, curPageData.length + 10);
				}).catch(() => {
					this.mescroll.endErr();
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.content {
		width: calc(100% - 60rpx);
		margin: auto;

		.address {
			display: flex;
			margin: auto;
			width: 690rpx;
			min-height: 236rpx;
			border-radius: 8rpx;
			background-color: #fff;
			margin-top: 20rpx;
		}
	}

	.u-tag {
		background-color: $theme-color !important;
	}

	.editicon {
		width: 48rpx;
		height: 48rpx;
	}

	.button {
		position: fixed;
		bottom: 100rpx;
		left: 195rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 380rpx;
		height: 84rpx;
		background-color: $theme-color;
		box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(4, 203, 199, 0.5);
		border-radius: 50rpx;
		font-size: 32rpx;
		color: #fff;
	}
</style>
