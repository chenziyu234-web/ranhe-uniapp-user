<template>
	<view>
		<view class=" " @click="todetail(item)">
			<view class=" u-flex machine u-col-top">
				<view class="machine-left u-flex u-flex-col u-col-center">
					<machine-status :status="item.useStatus" :lineStatus="item.lineStatus"></machine-status>
					<text class="machine-status-text" v-if="item.useStatus!=1">{{xunHelper.useStatus(item.useStatus,item.lineStatus)}}</text>
					<text class="machine-status-text" v-else-if="item.useStatus==1 && item.lineStatus !=2">快去投递吧</text>
					<text class="machine-status-text" v-else-if="item.lineStatus == 2">设备离线</text>
				</view>
				<view class="machine-right" style="position:relative;">
					<image class="loc-watermark" src="/static/homeV2/icon-location.png" mode="widthFix"></image>
					<view class="u-flex">
						<view class="text-name font-weight u-line-1">
							{{item.villageName}}{{item.position}}
						</view>
					</view>
					<view class="u-flex u-row-between u-font-24  u-p-t-4" style="color: #333333;margin: 10rpx 0;">
					<view class="u-flex u-row-center u-col-center">
						<image class="addr-icon" src="/static/homeV2/地址 @2x.png" mode="aspectFit"></image>
						<text>{{parseAreaName(item.parentsName)}}</text>
					</view>
					<view class="u-flex u-row-center u-col-center">
						<image class="dist-icon" src="/static/homeV2/icon-location.png" mode="widthFix"></image>
						<text>{{filterDistance(item.distance)}}</text>
					</view>
				</view>
					<view class="u-flex u-row-between" style="color: #999;">
						<view class="tag" v-if="item.deliveryNumber!=0">
							投过{{item.deliveryNumber}}次</view>
					</view>

				</view>

			</view>
		</view>
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
			item: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		methods: {
			parseAreaName(name){
				if(!name) return name
				let list = name.split('/')
				if(list.length  == 3){
					return `${list[1]}  ${list[2]}`
				}else if(list.length  == 2){
					return `${list[0]}  ${list[1]}`
				}
				return name
			},
			filterDistance(distance) {
				//   如果小于如果小于50米显示（<50米），如果大于50米小于10公里，就显示实际的距离，例如4.2公里，如果大于10公里显示大于（10公里）
				if (distance < 0.05) {
					return '<50米'
				} else if (0.05 < distance ||  distance > 10) {
					return this.item.distance.toFixed(1) +'公里'
				} else {
					return '大于10公里'
				}

			},
			todetail(item) {
				if(item.lineStatus == 2){
					return this.$u.toast('离线暂不可投递')
				}
				if( item.useStatus > 2){
					return this.$u.toast('暂不可投递')
				}
				uni.navigateTo({
					url: `/pagesIndex/deviceDetail/deviceDetail?id=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.tag {
		color: #7b7b7b;
		font-size: 24rpx;
		background: #F4F4F6;
		border-radius: 8rpx;
		padding: 4rpx;
	}

	.children {
		width: 100%;
		padding: 20rpx;
		margin: 20rpx 0;
		background-color: #f6f9fe;
		border-radius: 8rpx;

		.items {
			font-size: 28rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.machine {
		padding: 0;
		background-color: transparent;
		border-radius: 0;
		margin-top: 0;
		min-height: auto;

		.machine-left {
			width: 100rpx;
			flex-direction: column;
			align-items: center;
			margin-left: 0;

			.machine-status-text {
				margin-top: 8rpx;
				font-size: 20rpx;
				color: #A0A3B4;
				text-align: center;
			}
		}

		.machine-right {
			flex: 1;
			padding-left: 12rpx;
			padding-top: 6rpx;
			margin-left: 0;
			position: relative;

			.loc-watermark {
				position: absolute;
				top: 20rpx;
				right: 124rpx;
				width: 140rpx;
				opacity: 0.5;
				pointer-events: none;
			}

			.addr-icon {
				width: 24rpx;
				height: 24rpx;
				margin-right: 6rpx;
				flex-shrink: 0;
			}

			.dist-icon {
				width: 28rpx;
				margin-right: 4rpx;
				flex-shrink: 0;
			}

			.text-name {
				font-size: 32rpx;
			}

			.item-buttons {
				border: 1rpx solid $theme-color;
				border-radius: 6rpx;
				color: $theme-color;
				width: 160rpx;
				height: 50rpx;
				font-size: 24rpx;
			}
		}
	}
</style>
