<template>
	<view>
		<view class="item" v-for="(item,index) in list" :key="index">
			<view class="title u-p-b-10">
				<view class="status">
					<text class="text-666666">订单编号</text><text>{{item.orderSn}}</text><text
						class="u-m-l-20 text-theme">
						{{item.sendStatus==1?'待发放':item.sendStatus==2?'已发放':'取消发放'}}</text>
				</view>
				<view class="title-icon">
					<image @click="changes(item)" src="/pagesMy/static/56.png" class="title-icon-image"
						:class="item.show?'':'title-icon-image1'"></image>
				</view>
			</view>
			<view class="info padding-row-30" v-if="item.show">
				<view class="info-item">
					<view class="info-item-label">回收地址 - </view>
					<view class="info-item-name">{{item.villageName}}</view>
					<u-icon name="/pagesMy/static/53.png" size="40"></u-icon>
				</view>
				<view class="info-item">
					<view class="info-item-label">回收物品 - </view>
					<view class="info-item-name">可回收物 {{xunHelper.weightK(item.totalWeight)}}kg</view>
					<u-icon name="/pagesMy/static/54.png" size="40"></u-icon>
				</view>
				<view class="info-item">
					<view class="info-item-label">账户所得 - </view>
					<view class="info-item-name">{{item.totalPrice}}元</view>
					<u-icon name="/pagesMy/static/55.png" size="40"></u-icon>
				</view>
			</view>
			<view class="text" v-if="item.cancelReason">
				<view class="text1">
					{{item.cancelReason}}
				</view>
			</view>
			<view class="time" :class="item.cancelReason ? '' : 'u-border-top'">
				完成时间：{{item.createTime}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			list:{
				type: Array,
				default: []
			}
		},
		methods: {
			changes(item) {
				item.show = !item.show
			},
		}
	}
</script>

<style>

</style>
