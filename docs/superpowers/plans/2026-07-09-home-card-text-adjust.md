# 首页设备卡片视觉微调实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 调整首页设备卡片的文字颜色、左侧边距和底部高度，使其与设计稿一致。

**Architecture:** 本次修改涉及2个文件的CSS微调，不改变业务逻辑。设备信息组件(machine-view.vue)负责设备图标、名称、地址、距离的展示；首页(index.vue)负责外层卡片容器和地图区域的布局。所有修改均为样式层面的调整。

**Tech Stack:** Vue 2 + uni-app + SCSS + uView UI

---

## 文件结构总览

| 文件 | 职责 | 修改类型 |
|------|------|----------|
| `components/machine-view/machine-view.vue` | 设备信息卡片（图标+名称+地址+距离） | 修改样式 |
| `pages/index/index.vue` | 首页外层卡片容器+地图区域 | 修改样式 |

---

### Task 1: 调整地址和公里数字体颜色为深灰色 #333333

**背景：** 设计稿中地址文字（广东省·深圳市）和公里数字（12478.9公里）颜色均为 `#333333`，字重 Medium，字号 24rpx。当前代码使用 `#999` 浅灰色，需要加深。

**Files:**
- Modify: `components/machine-view/machine-view.vue:18`

- [ ] **Step 1: 修改地址+公里数行的文字颜色**

找到模板第18行外层 view 的 inline style `style="color: #999;margin: 10rpx 0;"`，将颜色从 `#999` 改为 `#333333`。

修改前：
```vue
<view class="u-flex u-row-between u-font-24  u-p-t-4" style="color: #999;margin: 10rpx 0;">
```

修改后：
```vue
<view class="u-flex u-row-between u-font-24  u-p-t-4" style="color: #333333;margin: 10rpx 0;">
```

- [ ] **Step 2: 验证编译**

在微信开发者工具中编译项目，打开首页查看设备卡片区域。
预期：地址文字和公里数字颜色变为深灰色 #333333，不再是浅灰。

---

### Task 2: 调整设备箱图标距离卡片左侧为 31rpx

**背景：** 设计稿中设备箱图标左边缘距离卡片左边缘为 24rpx（卡片内边距）+ 偏移 = 约31rpx。当前左边距计算：卡片padding 24rpx + machine-left u-m-l-10 (10rpx) + margin-left -15rpx + (100rpx宽容器 - 80rpx图标)/2 = 29rpx。需要再往左移一点达到约31rpx的视觉效果。

**Files:**
- Modify: `components/machine-view/machine-view.vue:190-194`

- [ ] **Step 1: 调整 machine-left 的左侧负margin**

找到 `.machine-left` 的样式，将 `margin-left` 从 `-15rpx` 调整到 `-17rpx`（再往左移2rpx，达到约31rpx视觉效果）。

修改前：
```scss
.machine-left {
    width: 100rpx;
    flex-direction: column;
    align-items: center;
    margin-left: -15rpx;
```

修改后：
```scss
.machine-left {
    width: 100rpx;
    flex-direction: column;
    align-items: center;
    margin-left: -17rpx;
```

- [ ] **Step 2: 验证编译**

在微信开发者工具中编译，对比设备图标与卡片左边缘的距离。
预期：设备箱图标左边距约31rpx，与设计稿视觉对齐。

---

### Task 3: 增加地图下方"附近有X台回收机"文字的底部空间

**背景：** 设计稿中卡片总高411rpx，当前底部文字（附近有X台回收机）到卡片底部的间距太小，视觉上显得局促。当前 `u-m-b-29`（29rpx），需要增加到底部约 40-45rpx 的空间，让卡片高度更接近设计稿的411rpx。

**Files:**
- Modify: `pages/index/index.vue:34`

- [ ] **Step 1: 增加底部 margin**

找到底部文字行的 class，将 `u-m-b-29` 改为 `u-m-b-45`（增加16rpx底部空间）。

修改前：
```vue
<view class="u-font-24 text-center u-m-t-20 u-m-b-29" @click="toMap">
```

修改后：
```vue
<view class="u-font-24 text-center u-m-t-20 u-m-b-45" @click="toMap">
```

- [ ] **Step 2: 验证编译**

在微信开发者工具中编译首页，观察卡片高度变化。
预期："附近有X台回收机"文字下方空间增大，整个白色卡片高度增加，视觉上更接近设计稿的比例。

---

### Task 4: 整体验证

- [ ] **Step 1: 检查三项改动的综合效果**

在微信开发者工具中完整查看首页：
1. 设备箱图标左距 ≈ 31rpx ✅
2. 地址文字和公里数字颜色为深灰色 #333333 ✅
3. 卡片底部空间充足，高度比例协调 ✅

- [ ] **Step 2: 确认无破坏性影响**

检查以下内容是否正常：
- 设备卡片点击跳转到详情页功能正常
- 地图显示正常
- "附近有X台回收机"点击跳转地图页正常
- 其他页面（我的、客服）不受影响
