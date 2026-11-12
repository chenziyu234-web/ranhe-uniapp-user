<template>
	<view style="overflow: hidden;">

		<view class="padding-30" style="margin-bottom: 180rpx;">
			<u-swiper @change="changeSwiper" :list="dataList" height="1200" imgMode="scaleToFill"></u-swiper>

		</view>

		<view class="u-m-t-20 bottom">
			<u-button shape="square" hoverClass="none" @click="save" :customStyle="customStyle">保存图片至相册</u-button>

		</view>
	</view>
</template>

<script>
	import {
		xuanChaunCodeApi
	} from '@/api/index.js'
	export default {
		data() {
			return {
				customStyle: {
					backgroundColor: '#2A9F4E',
					color: '#fff',
					height: '92rpx',
					width: '644rpx'
				},
				showPop: true,
				current: 0,
				posterImg: '',
				checked: 0,
				dataList: [],
			}
		},
		onShow() {
			this.init();
		},
		created() {

		},
		methods: {
			changeSwiper(e) {
				this.current = e
			},

			save() {
				uni.showLoading({
					title: '保存中...',
					mask: true
				});
				uni.downloadFile({
					url: this.dataList[this.current],
					success: re => {
						console.log(re, '300');
						if (re.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: re.tempFilePath,
								success: function() {
									uni.hideLoading();
									uni.showToast({
										title: '保存成功',
										icon: 'none'
									});
								},
								fail: function(e) {
									console.log(e);
									uni.showToast({
										title: '保存失败，请稍后重试',
										icon: 'none'
									});
								}
							});
						}
					},
					fail: error => {
						console.log(error);
					}
				});
			},
			checkPoster(item, index) {
				var that = this
				that.posterImg = item,
					that.checked = index
			},
			init() {
				this.dataList = []
				xuanChaunCodeApi().then(res => {
					this.dataList.push(this.xunHelper.detectUrl(res.data))
					this.posterImg = this.dataList[0]
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #FAFAFA;
	}

	.bottom {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: 30rpx;
	}
</style>