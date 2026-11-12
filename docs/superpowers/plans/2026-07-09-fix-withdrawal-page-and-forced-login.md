# 修复提现页面多余元素 & 首次进入强制授权登录 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复两个微信审核相关问题：(1) 提现入口页面只保留可提现金额卡片，移除红字背景图和账单列表导致的"空空如也"提示；(2) 移除小程序启动时的强制授权登录，允许用户先浏览首页功能体验后再自行选择登录。

**Architecture:** 
- 任务1（提现页面）：将 accound.vue 从 mescroll-body 列表页重构为纯展示卡片页，移除账单列表、mescroll 滚动加载逻辑和带红字的背景图，仅保留可提现金额卡片和"去提现"跳转按钮。
- 任务2（强制登录）：移除 App.vue onLaunch 中的自动 wxUserLogin 调用，避免新用户首次打开就被后端 401 拦截到登录页。游客可自由浏览首页、地图等公开功能，仅在主动点击需要身份的操作（扫码、提现、我的页面）时通过现有 checkLogIn 机制引导登录。

**Tech Stack:** uni-app (Vue 2) + Vuex + uView UI + mescroll-uni

---

## File Structure

| Action | File Path | Responsibility |
|--------|-----------|---------------|
| Modify | `pagesMy/accound/accound.vue` | 提现入口页：移除 mescroll-body、账单列表、背景图，仅保留余额卡片和跳转按钮 |
| Modify | `App.vue` | 移除 onLaunch 中的自动 `wxUserLogin` 调用，改为游客模式启动 |

---

### Task 1: 重构提现入口页面 accound.vue

**Files:**
- Modify: `pagesMy/accound/accound.vue`

**问题分析:**
- 页面使用 `<mescroll-body>` 包裹整个内容，并调用 `billsList` API 加载账单流水列表
- customTop 设置了 `bgSrc='/static/newStatic/5.png'` 和 `bgHeight="800rpx"`，背景图上有红色文字透出
- 账单列表无数据时 mescroll 组件自动显示 "~ 空空如也 ~" 空提示
- 用户从此页面进入的目的只有一个：点击"去提现"按钮跳转到填写提现金额页面，账单流水已在"提现记录"菜单中

- [ ] **Step 1: 重写 accound.vue template 部分**

将整个 template 替换为以下内容（去掉 mescroll-body、去掉 customTop 背景图、去掉账单列表、去掉提现方式弹窗）：

```vue
<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar title="提现" :isFixed="true" :immersive="true" :borderBottom="false" :isBack="true" bgColor="#ffffff"></u-navbar>
		<!-- #endif -->
		<view class="page-content">
			<view class="accound-view u-flex u-row-between pos-r">
				<view>
					<view>可提现金额(元)</view>
					<view class="text-333333 u-font-28"><text class=" font-weight"
							style="font-size: 60rpx;">{{nowMoney || '0.00'}}</text>元</view>
				</view>
				<view class="accoundBtn" @click="accound">去提现</view>
			</view>
		</view>
	</view>
</template>
```

- [ ] **Step 2: 重写 accound.vue script 部分**

将 script 部分替换为以下内容（移除 mescroll mixin、billsList API、分页加载逻辑、提现方式弹窗相关状态）：

```javascript
<script>
	import {
		homeData
	} from '@/api/user.js'
	export default {
		data() {
			return {
				nowMoney: ''
			}
		},
		onLoad() {
			this.reloadInfo()
		},
		methods: {
			reloadInfo() {
				homeData().then(res => {
					this.nowMoney = res.data.nowMoney
				})
			},
			toBack() {
				uni.switchTab({
					url: '/pages/me/index'
				})
			},
			accound() {
				uni.navigateTo({
					url: '/pagesMy/withdrawal/withdrawal'
				})
			}
		}
	}
</script>
```

- [ ] **Step 3: 更新 style 部分**

替换 style 部分，添加页面内容区域样式并保留卡片样式：

```scss
<style lang="scss">
	page {
		background-color: #fafafa;
	}

	.page-content {
		padding: 30rpx;
	}

	.accound-view {
		width: 690rpx;
		height: 192rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 10rpx 40rpx 2rpx rgba(0, 0, 0, 0.05);
		border-radius: 30rpx;
		padding: 36rpx 30rpx;
	}

	.accoundBtn {
		width: 188rpx;
		height: 64rpx;
		background: #4E80FF;
		border-radius: 32rpx;
		font-size: 28rpx;
		color: #fff;
		text-align: center;
		line-height: 64rpx;
	}
</style>
```

- [ ] **Step 4: 验证页面效果**

在微信开发者工具中：
1. 打开小程序 → 进入"我的"页面 → 点击"去提现"
2. 验证页面顶部标题栏显示"提现"且有返回按钮
3. 验证页面中只有一个白色圆角卡片，显示"可提现金额(元)"和金额
4. 验证卡片右侧有蓝色"去提现"按钮
5. 验证页面中没有红色文字、没有"空空如也"文字、没有账单列表
6. 点击"去提现"按钮，验证跳转到填写提现金额页面 (withdrawal.vue)

- [ ] **Step 5: Commit**

```bash
git add pagesMy/accound/accound.vue
git commit -m "fix: 提现入口页移除多余元素，仅保留可提现金额卡片"
```

---

### Task 2: 移除启动时强制自动登录

**Files:**
- Modify: `App.vue`

**问题分析:**
- App.vue onLaunch 中 `this.$store.dispatch('user/wxUserLogin')` 会在小程序启动时立即调用 `authLogin` API
- 对于新用户（未绑定手机号），后端返回 401 状态码
- request.js 响应拦截器检测到 401 后执行 `redirect()` 函数，调用 `uni.reLaunch({url: "/pages/login/index"})` 跳转到手机号登录页
- 这导致新用户一打开小程序还没看到首页就被强制要求授权手机号/头像昵称，违反微信审核规范
- 已登录用户在本地有缓存的 token 和 userInfo，store 初始化时会自动读取，不需要在 onLaunch 重新登录
- 现有 checkLogIn 方法（baseMixins）已在所有需要登录的操作点（扫码、提现、我的页面等）进行登录检查，引导逻辑完备

- [ ] **Step 1: 修改 App.vue 的 onLaunch 方法**

在 [App.vue](file:///e:/code-github/baocun/daidaiUser/App.vue) 中，将 onLaunch 方法中的 `this.$store.dispatch('user/wxUserLogin')` 这一行删除。

修改前的 onLaunch（第47-54行）：
```javascript
onLaunch: function(option) {
    this.getconfig()
    this.getdictdata()
    this.$store.dispatch('user/wxUserLogin')
    // #ifdef MP-WEIXIN
    this.$store.commit('user/SET_MENUBUTTONINF', uni.getMenuButtonBoundingClientRect());
    // #endif
},
```

修改后的 onLaunch：
```javascript
onLaunch: function(option) {
    this.getconfig()
    this.getdictdata()
    // #ifdef MP-WEIXIN
    this.$store.commit('user/SET_MENUBUTTONINF', uni.getMenuButtonBoundingClientRect());
    // #endif
},
```

- [ ] **Step 2: 验证未登录状态下首页可正常浏览**

在微信开发者工具中：
1. 清除小程序缓存（删除存储数据）或使用新用户测试
2. 重新编译启动小程序
3. 验证进入首页后**不会**自动跳转到登录页
4. 验证首页正常显示：附近回收机列表、地图、8宫格分类、扫码按钮等
5. 验证可以点击"附近有X台回收机"进入地图页面浏览
6. 验证不会弹出手机号授权、头像昵称授权弹窗

- [ ] **Step 3: 验证需要登录的操作仍会引导登录**

在未登录状态下测试以下操作，确认会跳转到登录页：
1. 点击首页"扫码开箱"按钮或"扫码回收"按钮 → 扫码后如果未登录，应跳转到登录页
2. 点击底部 tabBar 切换到"我的"页面 → 显示"注册/登录"入口（正确行为：我的页面允许浏览，但显示登录入口而非强制跳转）
3. 点击"我的"页面的各种菜单（投递记录、提现记录、申请商户、系统设置）→ 通过现有 checkLogIn 引导登录
4. 在"我的"页面点击"去提现" → checkLogIn 检测到未登录时跳转到登录页

- [ ] **Step 4: 验证已登录用户体验正常**

使用已注册/已登录账号测试：
1. 杀掉小程序重新打开
2. 验证首页正常加载（token 从 localStorage 恢复）
3. 切换到"我的"页面，验证用户信息正常显示
4. 点击"去提现"正常进入提现流程
5. 扫码开箱功能正常使用

- [ ] **Step 5: Commit**

```bash
git add App.vue
git commit -m "fix: 移除启动时强制自动登录，允许游客先浏览功能再选择授权登录"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✅ 提现页面红字：通过移除 customTop 的 bgSrc 背景图解决
- ✅ 提现页面"空空如也"：通过移除 mescroll-body 和账单列表解决，不再触发空数据提示
- ✅ 提现页面只保留卡片：template 中仅保留 accound-view 卡片和"去提现"按钮
- ✅ 首次进入强制授权登录：通过移除 App.vue onLaunch 中的 wxUserLogin 调用解决
- ✅ 用户体验后自行选择登录：现有 checkLogIn 在需要登录的操作点触发，首页/地图等公开功能无需登录

**2. Placeholder scan:**
- ✅ 无 TBD/TODO/implement later
- ✅ 所有代码步骤均有完整代码
- ✅ 无"添加适当错误处理"等模糊指令
- ✅ 所有文件路径为精确绝对/相对路径

**3. Type consistency:**
- ✅ `nowMoney` 数据字段与原代码一致
- ✅ `accound()` 方法名保持与原代码一致（注意是 accound 不是 account，保持原样避免破坏其他引用）
- ✅ `reloadInfo()` 方法内部使用 `homeData()` API 与原代码一致
- ✅ 导航栏使用 u-navbar 组件（项目已引入 uView UI）
