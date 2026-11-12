<template>
	<view>
		<mescroll-body ref="mescrollRef" top="20" @init="mescrollInit" @down="downCallback" @up="upCallback"
			:up="upOption">
			<!-- <machine-list v-if="location&&location.longitude" :list="list"></machine-list> -->
			<view v-if="location&&location.longitude">
				<view v-for="(item,index) in list" :key="index">
					<machine-view :item="item"></machine-view>
				</view>
			</view>
			<view v-else class="location-empty">
				<image class="location-empty-icon" src="/static/Location.png"></image>
				<view class="text">请先授权位置信息。<text @tap="getLocation" class="location-empty-button"> 去授权> </text></view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		getDeliverList
	} from '@/api/index.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin
		name: "mescroll-comp-item",
		data() {
			return {
				list: [],
				upOption: {
					empty: {
						use: false,
					}
				},
			};
		},
		props: {
			type: {
				type: String,
				default: 'deliveryNumber'
			}
		},
		computed: {
			location() {
				return this.$store.state.user.location || {}
			},
		},
		methods: {
			getLocation() {
				uni.getSetting({
					success: (setting) => {
						if (setting.authSetting['scope.userLocation']) {
							uni.getLocation({ //获取位置
								type: 'gcj02',
								success: (res) => {
									this.$store.commit('user/SET_LOCATION', {
										longitude: res.longitude,
										latitude: res.latitude
									});
									this.downCallback()
								}
							});
						} else {
							this.openSetting()
						}
					}
				})
			
			},
			// 打开小程序设置
			openSetting() {
				uni.showModal({
					title: '授权提示',
					content: '请授权查询位置信息，用于查询在您附近的回收机',
					success: (res) => {
						if (res.confirm) {
							wx.openSetting({
								success: (settingRes) => {
									if (settingRes.authSetting['scope.userLocation']) {
										uni.getLocation({
											success: (res) => {
												this.$store.commit(
													"user/SET_LOCATION", {
														latitude: res.latitude,
														longitude: res.longitude
													})
												this.downCallback()
											}
										})
									}
								},
							})
						}
					}
				})
			},
			// 打开小程序设置
			downCallback() { //下拉回调
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
				if (!this.location && !this.location.longitude) return
				//联网加载数据
				let pageSize = page.size
				let pageNum = page.num
				getDeliverList({
					pageNum,
					pageSize,
					lon: this.$store.state.user.location.longitude,
					lat: this.$store.state.user.location.latitude,
					isAsc: 'ascending',
					orderByColumn: this.type
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
	.location-empty {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 0;

		.location-empty-icon {
			width: 200rpx;
			height: 200rpx;
		}

		.text {
			color: #999999;
			font-size: 24rpx;
			margin-top: 30rpx;

			.location-empty-button {
				color: $theme-color;
			}
		}
	}
</style>