<template>
	<view>
		<view class="pos-r">
			<image class="image" src="/static/homeV2/icon-recyclebox.png" mode="widthFix"></image>
		</view>

	</view>
</template>

<script>
	export default {
		name: "machine-status",
		data() {
			return {};
		},
		props: {
			status: {
				type: [Number, String],
				default: 1,
			},
			lineStatus: {
				type: [Number, String],
				default: 1,
			}
		},
		computed: {
			statusLabel() {
				if (this.status == 1 || this.status == 2) return "可投";
				return "不可投"
			},
			style() {

			}
		}

	}
</script>

<style lang="scss">
	.image {
		width: 80rpx;
		height: auto;
	}

	.image-after {
		position: absolute;
		bottom: 4rpx;
		left: 0;
		width: 98rpx;
		height: 8rpx;
		border-radius: 0 0 4rpx 4rpx;
		background-color: #00B3E0;
	}

	@keyframes water {
		0% {
			height: 0rpx;
			bottom: 20rpx
		}

		100% {
			height: 60px;
			bottom: 0
		}
	}

	.status-view {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 104rpx;
		// height: 162rpx;

		.win {
			width: 104rpx;
			height: 32rpx;
			border-top-left-radius: 2rpx;
			border-top-right-radius: 2rpx;

			view {
				width: 80rpx;
				height: 18rpx;
				background-color: rgba(0, 0, 0, .2);
			}
		}

		.views {
			width: 88rpx;
			border-bottom-left-radius: 4rpx;
			border-bottom-right-radius: 4rpx;
			font-size: 24rpx;
		}

	}

	.win-sure {
		background-color: #86C32A;
	}

	.win-not {
		background-color: #e53a4e;
	}

	.win-rightOff {
		background-color: #deae00;
	}


	.status-sure {
		background-color: $theme-color;
		padding: 50rpx 10rpx;
	}

	.status-not {
		background-color: #fe4157;
		padding: 50rpx 0;
	}

	.status-rightOff {
		background-color: #ffcc01;
		color: #333333 !important;
		padding: 10rpx;
	}
</style>