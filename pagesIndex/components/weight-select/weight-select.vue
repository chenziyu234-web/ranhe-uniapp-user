<template>
	<view>
		<uni-popup ref="popup" type="center">
			<view class="popup-view">
				<view class="info-view">
					<view class="title text-333333 u-font-32">选择预估重量</view>
					<view class="contents">
						<view @click="current=item.value" v-for="(item,index) in list" :key="index" class="items"
							:class="item.value===current ? 'active' : '' ">{{item.label}}</view>
					</view>
					<view class="button" @click="submit">确定</view>
				</view>
				<view class="chose">
					<image @click="close" src="/pagesIndex/static/4.png"></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						value: 1,
						label: '10-20公斤'
					},
					{
						value: 2,
						label: '20-50公斤'
					},
					{
						value: 3,
						label: '50-100公斤以上'
					},
					{
						value: 4,
						label: '100公斤以上'
					}
				],
				current: 1
			}
		},
		methods: {
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			submit(){
				this.$emit('submit',this.current)
			}
		}
	}
</script>

<style lang="scss">
	.popup-view {
		.chose {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top: 30rpx;

			image {
				width: 56rpx;
				height: 56rpx;
			}
		}

		.info-view {
			width: 630rpx;
			padding: 30rpx;
			background-color: #fff;
			border-radius: 12rpx;

			.button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 540rpx;
				height: 88rpx;
				background-color: #2A9F4E;
				box-shadow: 0rpx 6rpx 30rpx 0rpx rgba(4, 203, 199, 0.5);
				border-radius: 44rpx;
				color: #fff;
				margin: 60rpx auto 0;
			}

			.title {
				width: 630rpx;
			}

			.contents {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-evenly;
				width: 100%;
				margin-top: 20rpx;

				.items {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 262rpx;
					height: 76rpx;
					background-color: #f2f2f2;
					border: solid 2rpx #999999;
					border-radius: 10rpx;
					margin-top: 10rpx;
				}

				.active {
					background-color: $theme-color;
					border: 0;
					color: #fff;
				}
			}
		}


	}
</style>
