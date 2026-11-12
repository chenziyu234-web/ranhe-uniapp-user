<template>
	<u-popup v-model="showShare" mode="bottom" height="421rpx" border-radius="20" closeable>
		<view class="share-view height-100">
			<view class=" u-flex-1 width-100 u-flex-col u-col-center u-row-center">
				<text class="u-font-32 font-weight ">分享至</text>
				<view class="u-flex u-row-around width-100 u-m-t-28">
					<button class="u-flex-col u-col-center u-reset-button" style="margin: 0px ;" @click="shareWx()">
						<image src="/static/wx.png" class="share-img"></image>
						<text class="u-font-24 u-m-t-15">分享给好友</text>
					</button>
					<view class="u-flex-col u-col-center" @click="shareFc">
						<image src="/static/tp.png" class="share-img"></image>
						<text class="u-font-24 u-m-t-15">保存图片</text>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name:"share-popup",
		data() {
			return {
				showShare:false
			};
		},
		methods:{
			open(){
				this.showShare=true
			},
			close(){
				this.showShare=false
			},
			shareFc(){
				this.$emit('share',true)
			},
			shareWx(){
				this.$emit('share',false)
			}
		}
	}
</script>

<style lang="scss">
.share-view {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.share-img {
		width: 90rpx;
		height: 90rpx;
	}
}
</style>
