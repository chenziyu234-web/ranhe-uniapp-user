<template>
  <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
    <view class="padding-30">
      <view v-for="item in deliveryList" :key="item.id" class="withdraw-record">
        <view class="u-flex u-row-between">
          <text>提现 ￥{{item.amount}}</text>
          <text>{{item.statusText}}</text>
        </view>
        <view class="u-font-24 u-m-t-20">{{item.createTime}}</view>
        <view class="u-font-24 u-m-t-20">订单号：{{item.ordersn}}</view>
        <u-button v-if="item.merchantReceiptSupported && String(item.status) === '6'"
          type="primary" size="mini" :disabled="isSub" @click="confirmClick(item)">确认收款 / 查询结果</u-button>
      </view>
    </view>
  </mescroll-body>
</template>

<script>
import { withdrawList, withdrawConfirmReceipt, withdrawReceiptResult } from '@/api/user.js'
import { isWithdrawalPaid, canConfirmWithdrawal, withdrawalMessage } from '@/common/utils/withdrawReceipt.js'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
export default {
  mixins: [MescrollMixin],
  data() {
    return { deliveryList: [], isSub: false,
      upOption: { use: true, auto: true, page: { num: 0, size: 10 }, noMoreSize: 5, textNoMore: '--没有更多记录--' } }
  },
  onShow() { this._receiptActive = true },
  onHide() { this.stopPolling() },
  onUnload() { this.stopPolling() },
  methods: {
    stopPolling() {
      this._receiptActive = false
      if (this._receiptTimer) clearTimeout(this._receiptTimer)
      this._receiptTimer = null
      this.isSub = false
      uni.hideLoading()
    },
    finishReceipt(data) {
      this.isSub = false
      uni.hideLoading()
      this.$u.toast(withdrawalMessage(data))
      this.downCallback()
    },
    async confirmClick(item) {
      if (this.isSub) return
      this._receiptActive = true
      this.isSub = true
      try {
        const response = await withdrawConfirmReceipt({ memberWithdrawId: item.id })
        if (!this._receiptActive) return
        const data = response.data || {}
        if (String(data.memberWithdrawId) !== String(item.id)) throw new Error('提现记录不匹配，请刷新重试')
        if (isWithdrawalPaid(data) || !canConfirmWithdrawal(data)) { this.finishReceipt(data); return }
        // #ifdef MP-WEIXIN
        if (!wx.canIUse('requestMerchantTransfer')) throw new Error('请更新微信后确认收款')
        wx.requestMerchantTransfer({
          mchId: data.mchId, appId: data.appId, package: data.packageInfo,
          success: () => { this.pollReceipt(item.id, 0) },
          fail: () => { this.isSub = false; this.$u.toast('未完成收款确认，可重新打开原提现记录') }
        })
        // #endif
        // #ifndef MP-WEIXIN
        this.isSub = false
        this.$u.toast('请在微信小程序中确认收款')
        // #endif
      } catch (error) {
        this.isSub = false
        if (error && error.message) this.$u.toast(error.message)
      }
    },
    async pollReceipt(id, attempt) {
      if (!this._receiptActive) return
      if (attempt >= 8) { this.finishReceipt(null); return }
      try {
        const response = await withdrawReceiptResult({ withdrawId: id })
        if (!this._receiptActive) return
        const data = response.data
        if (data && String(data.memberWithdrawId) !== String(id)) throw new Error('提现记录不匹配')
        if (isWithdrawalPaid(data) || (data && ['4', '5'].includes(String(data.status)))) { this.finishReceipt(data); return }
      } catch (error) { /* An unknown or failed request is never treated as paid. */ }
      if (this._receiptActive) this._receiptTimer = setTimeout(() => this.pollReceipt(id, attempt + 1), 1500)
    },
    downCallback() { if (this.mescroll) this.mescroll.resetUpScroll() },
    upCallback(page) {
      withdrawList({ pageNum: page.num, pageSize: page.size }).then(response => {
        const rows = Array.isArray(response.data) ? response.data : []
        if (page.num === 1) this.deliveryList = []
        this.deliveryList = this.deliveryList.concat(rows)
        this.mescroll.endSuccess(rows.length)
      }).catch(() => this.mescroll.endErr())
    }
  }
}
</script>
<style scoped>
.withdraw-record { background: #fff; padding: 30rpx; margin-bottom: 24rpx; border-radius: 16rpx; }
</style>
