# 账户卡片背景图改为 image 标签实现 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `.account-view` 卡片的背景从 base64 CSS `background-image` 改为 `<image>` 标签实现，使用外部图片文件 `static/me/account-bg.png`，不改变现有视觉布局和比例。

**Architecture:** 在两个 `.account-view` 容器内各添加一个绝对定位的 `<image>` 作为背景层，容器设为 `position: relative; overflow: hidden`，原有内容通过 `position: relative; z-index: 1` 浮于图片上方。移除 CSS 中的 `background-image`、`background-size`、`background-repeat`。

**Tech Stack:** uni-app (Vue 2), 微信小程序, SCSS

---

## 背景：当前状态

文件 `pages/me/index.vue` 中有 **两个** `.account-view` 元素：

1. **第28行** - 主账户卡片（始终显示）：
   ```html
   <view class="account-view text-white">
       <!-- 4个子view：账户标题、余额、待入账、常见问题 -->
   </view>
   ```

2. **第63行** - 代理统计卡片（`v-if="agentShow"` 条件显示）：
   ```html
   <view class="agentListdata account-view text-white" v-if="agentShow">
       <!-- 2个子view：设备数量统计、回收统计 -->
   </view>
   ```

CSS（第1037-1047行）：
```scss
.account-view {
    width: 690rpx;
    height: 328rpx;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url(data:image/jpeg;base64,...);  // ← 要移除
    border-radius: 30rpx 30rpx 30rpx 30rpx;
    opacity: 1;
    margin: 30rpx;
    padding: 36rpx 28rpx;
}
```

---

### Task 1: 复制图片到 static/me/ 目录

**Files:**
- Create: `static/me/account-bg.png`（从 `E:\tup\钱包图片卡片.png` 复制）

- [ ] **Step 1: 复制图片文件**

将 `E:\tup\钱包图片卡片.png` 复制为 `static/me/account-bg.png`：

```bash
copy "E:\tup\钱包图片卡片.png" "e:\code-github\baocun\daidaiUser\static\me\account-bg.png"
```

- [ ] **Step 2: 验证图片文件存在**

确认 `static/me/account-bg.png` 文件已创建。

---

### Task 2: 在第一个 .account-view 中添加 image 背景层

**Files:**
- Modify: `pages/me/index.vue:28` （第28行的 `<view class="account-view text-white">`）

- [ ] **Step 1: 在第28行 `<view class="account-view text-white">` 内部添加 image 标签**

将第28行：
```html
			<view class="account-view text-white">
```
改为：
```html
			<view class="account-view text-white">
				<image class="account-bg-img" src="/static/me/account-bg.png" mode="aspectFill"></image>
```

注意：`<image>` 是 `.account-view` 的第一个子元素，原有的 `<view class="u-flex u-row-between">` 等内容保持不变，紧随其后。

- [ ] **Step 2: 验证编译无报错**

在微信开发者工具中编译，确认无语法错误。此时图片可能覆盖内容（因为还没加 CSS），这是预期的。

---

### Task 3: 在第二个 .account-view 中添加 image 背景层

**Files:**
- Modify: `pages/me/index.vue:63` （第63行的 `<view class="agentListdata account-view text-white" v-if="agentShow">`）

- [ ] **Step 1: 在第63行 `<view class="agentListdata account-view text-white" v-if="agentShow">` 内部添加 image 标签**

将第63行：
```html
			<view class="agentListdata account-view text-white" v-if="agentShow">
```
改为：
```html
			<view class="agentListdata account-view text-white" v-if="agentShow">
				<image class="account-bg-img" src="/static/me/account-bg.png" mode="aspectFill"></image>
```

注意：`<image>` 是该容器的第一个子元素，原有的 `<view class="u-flex u-flex-wrap u-p-15">` 等内容保持不变。

- [ ] **Step 2: 验证编译无报错**

在微信开发者工具中编译，确认无语法错误。

---

### Task 4: 更新 CSS — 移除 background-image，添加定位样式

**Files:**
- Modify: `pages/me/index.vue:1037-1047` （`.account-view` 样式块）

- [ ] **Step 1: 替换 .account-view 样式**

将第1037-1047行：
```scss
	.account-view {
		width: 690rpx;
		height: 328rpx;
		background-size: cover;
		background-repeat: no-repeat;
		background-image: url(data:image/jpeg;base64,...);
		border-radius: 30rpx 30rpx 30rpx 30rpx;
		opacity: 1;
		margin: 30rpx;
		padding: 36rpx 28rpx;
	}
```
替换为：
```scss
	.account-view {
		width: 690rpx;
		height: 328rpx;
		border-radius: 30rpx 30rpx 30rpx 30rpx;
		opacity: 1;
		margin: 30rpx;
		padding: 36rpx 28rpx;
		position: relative;
		overflow: hidden;
	}
```

变更说明：
- 移除 `background-size`、`background-repeat`、`background-image` 三行
- 新增 `position: relative`（让子元素的 absolute 定位相对于此容器）
- 新增 `overflow: hidden`（让图片被 border-radius 裁剪）

- [ ] **Step 2: 验证编译无报错**

在微信开发者工具中编译，确认无 CSS 语法错误。

---

### Task 5: 添加 .account-bg-img 和内容层 CSS

**Files:**
- Modify: `pages/me/index.vue:1047` （在 `.account-view` 样式块之后插入新样式）

- [ ] **Step 1: 在 .account-view 样式块后面（第1047行 `}` 之后）添加两个新样式**

在第1047行 `}` 之后新增：
```scss
	.account-bg-img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}
	.account-view > view:not(.account-bg-img) {
		position: relative;
		z-index: 1;
	}
```

样式说明：
- `.account-bg-img`：绝对定位铺满父容器，`z-index: 0` 放在底层
- `.account-view > view:not(.account-bg-img)`：让所有非图片子元素浮于图片上方

- [ ] **Step 2: 验证编译无报错**

在微信开发者工具中编译，确认无 CSS 语法错误。

---

### Task 6: 清除缓存并验证视觉效果

- [ ] **Step 1: 清除微信开发者工具缓存**

菜单栏 → 工具 → 清除缓存 → 全部清除

- [ ] **Step 2: 重新编译项目**

点击编译按钮，重新编译项目

- [ ] **Step 3: 验证主账户卡片显示**

打开"我的"页面，确认：
1. 账户卡片背景显示了新的图片（`钱包图片卡片.png`）
2. 卡片尺寸、圆角、内边距与之前一致
3. "我的账户(元)"、余额数字、"去提现"、"含待入账金额"、"常见问题"等内容正常显示在图片上方
4. 文字没有被图片遮挡

- [ ] **Step 4: 验证代理统计卡片显示（如果可触发）**

如果 `agentShow` 为 true 的条件可触发，确认：
1. 代理统计卡片背景也显示了新图片
2. 设备数量、离线设备、今日回收总量、今日累计收益等内容正常显示

- [ ] **Step 5: 提交代码**

```bash
git add static/me/account-bg.png pages/me/index.vue
git commit -m "refactor: 账户卡片背景从base64改为image标签引用外部图片"
```
