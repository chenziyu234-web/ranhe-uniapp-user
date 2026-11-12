# 投递记录卡片布局重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构投递记录页面（myOrder.vue）的卡片列表布局，将原来的四行垂直堆叠改为"头部 + 左图右文"两层结构，仅修改格式布局，不改动任何现有功能逻辑。

**Architecture:** 单文件修改（pagesMy/myOrder/myOrder.vue）。模板部分重构卡片内部 HTML 结构（从 4 行 → 2 层），样式部分替换 `.orderItem` 及其嵌套类。所有数据绑定、事件处理、条件渲染、滚动加载逻辑保持不变。

**Tech Stack:** uni-app (Vue 2) + uView UI + SCSS + WeChat Mini Program

---

## 调研结论

### 功能影响评估（零影响）

以下功能点全部保留，不做任何改动：

| 功能点 | 代码位置 | 保留方式 |
|--------|----------|----------|
| 卡片点击跳转详情 | `@click="toDetail(item)"` (L21) | 保持在 `.orderItem` 上 |
| 图片条件渲染 | `v-if="!$u.test.isEmpty(item.afterPic)"` (L30-32) | 保留完整 v-if/v-else 逻辑 |
| 默认占位图 | `src="/static/empImg.png"` (L32) | 保留 |
| 数据绑定 | `item.createTime` / `sendStatusText` / `villageName` / `totalPrice` | 全部保留 |
| 按钮文案 | "查看订单详情" | 保留 |
| 滚动加载 | `mescroll-body` + `upCallback` | 不在修改范围内 |
| 时间筛选 | `u-select` + `openTime` | 不在修改范围内 |
| 导航栏 | `u-navbar` + `u-tabs` | 不在修改范围内 |

### 主题色说明

- 项目 `uni.scss` 中 `$theme-color` = `#00B3E0`（旧青色，已弃用）
- 实际主色调 = `#4E80FF`（蓝色），依据项目记忆约束，使用字面量 hex 值
- 金额红色使用 `#FF4D4F`（通用价格红）

### 当前卡片结构 → 目标卡片结构

**当前（4 行垂直堆叠）：**
```
┌─────────────────────────────────┐
│ 时间                  状态(黑)   │  ← 第1行 u-flex u-row-between
├─────────────────────────────────┤
│ [156x156图片]  小区名称(36rpx)  │  ← 第2行 u-flex u-col-top
├─────────────────────────────────┤
│                    ￥金额(60rpx)│  ← 第3行 u-flex u-row-right
├─────────────────────────────────┤
│                  [查看订单详情]  │  ← 第4行 u-flex u-row-right
└─────────────────────────────────┘
min-height: 500rpx, padding: 30rpx 40rpx
```

**目标（2 层结构）：**
```
┌─────────────────────────────────┐
│ 时间                  状态(蓝色) │  ← 第一层：卡片头部
├─────────────────────────────────┤
│ [128x128]  小区名称(32rpx加粗)  │  ← 第二层：左图右文
│  图片      ───────────────────  │
│  16rpx圆角  ￥金额(36rpx) [按钮] │  ← 右下：金额+按钮同行
└─────────────────────────────────┘
padding: 24rpx 30rpx, 无 min-height
```

---

## File Structure

仅修改 1 个文件：

- **Modify:** `pagesMy/myOrder/myOrder.vue`
  - 模板部分（L20-L46）：重构卡片内部 HTML 结构
  - 样式部分（L146-L178）：替换 `.orderItem` 及嵌套样式类

不创建新文件，不修改其他文件。

---

## Task 1: 更新卡片模板 HTML 结构

**Files:**
- Modify: `pagesMy/myOrder/myOrder.vue:20-46`

- [ ] **Step 1: 替换卡片内部模板结构**

将 L20-L46 的卡片内部结构替换为新的两层布局。用以下内容替换从 `<view>` (L20) 到对应 `</view>` (L46) 之间的内容：

**替换前（L20-L46 当前代码）：**
```html
<view>
    <view v-for="(item,index) in list" :key="index" @click="toDetail(item)" class="orderItem">
        <view class="u-flex u-row-between u-p-b-30">
            <view class="time ">
                {{item.createTime}}
            </view>
            <view class="u-font-24 text-333333">{{item.sendStatusText}}</view>
        </view>
        <view class="u-flex  u-col-top margin-col-20">
            <view class="" style="flex-shrink: 0;">
                <image class="picture" v-if="!$u.test.isEmpty(item.afterPic)"
                    :src="xunHelper.detectUrl(item.afterPic)" mode="aspectFill"></image>
                <image class="picture" v-else src="/static/empImg.png" mode="aspectFill"></image>
            </view>
            <view class="u-line-2 u-font-36 font-weight text-333333 u-m-l-20">
                {{item.villageName}}
            </view>
        </view>
        <view class="u-flex u-row-right font-weight text-333333 u-col-bottom">
            <text class="u-font-36 u-m-b-10">￥</text>
            <text style="font-size: 60rpx;">{{item.totalPrice}}</text>
        </view>
        <view class="u-flex u-row-right">
            <view class="detailBtn">查看订单详情</view>
        </view>
    </view>
</view>
```

**替换后（新代码）：**
```html
<view>
    <view v-for="(item,index) in list" :key="index" @click="toDetail(item)" class="orderItem">
        <!-- 第一层：卡片头部 -->
        <view class="u-flex u-row-between card-header">
            <view class="time">{{item.createTime}}</view>
            <view class="status-text">{{item.sendStatusText}}</view>
        </view>
        <!-- 第二层：卡片主体，左图右文 -->
        <view class="u-flex u-col-top card-body">
            <view style="flex-shrink: 0;">
                <image class="picture" v-if="!$u.test.isEmpty(item.afterPic)"
                    :src="xunHelper.detectUrl(item.afterPic)" mode="aspectFill"></image>
                <image class="picture" v-else src="/static/empImg.png" mode="aspectFill"></image>
            </view>
            <view class="card-info">
                <view class="card-title u-line-2">{{item.villageName}}</view>
                <view class="u-flex u-row-between u-col-center card-bottom">
                    <view class="price">
                        <text class="price-symbol">￥</text>
                        <text class="price-num">{{item.totalPrice}}</text>
                    </view>
                    <view class="detailBtn">查看订单详情</view>
                </view>
            </view>
        </view>
    </view>
</view>
```

**关键变更说明：**
- `@click="toDetail(item)"` 保持在 `.orderItem` 上 —— 卡片点击跳转功能不变
- 图片 `v-if/v-else` 条件渲染逻辑完全保留
- 数据绑定（`createTime`、`sendStatusText`、`villageName`、`totalPrice`）全部保留
- 按钮文案"查看订单详情"保留
- 新增 class：`card-header`、`status-text`、`card-body`、`card-info`、`card-title`、`card-bottom`、`price`、`price-symbol`、`price-num`

- [ ] **Step 2: 确认模板替换正确**

重新阅读修改后的文件 L19-L48，确认：
1. `mescroll-body` 标签完整（L19 开标签，对应闭标签）
2. `v-for` 循环结构正确
3. 所有 `{{}}` 数据绑定存在
4. `v-if/v-else` 图片逻辑存在
5. `@click="toDetail(item)"` 存在

---

## Task 2: 更新卡片 CSS 样式

**Files:**
- Modify: `pagesMy/myOrder/myOrder.vue:146-178`

- [ ] **Step 1: 替换 `.orderItem` 及嵌套样式**

将 L146-L178 的 `.orderItem { ... }` 整块替换为新样式。

**替换前（L146-L178 当前代码）：**
```scss
.orderItem {
    min-height: 500rpx;
    width: 690rpx;
    padding: 30rpx 40rpx;
    background-color: #fff;
    border-radius: 30rpx;
    margin-left: 30rpx;
    margin-bottom: 24rpx;

    .time {
        color: #7B7B7B;
        font-size: 24rpx;
    }

    .picture {
        width: 156rpx;
        height: 156rpx;
        border-radius: 30rpx;
    }

    .detailBtn {
        width: 196rpx;
        height: 58rpx;
        text-align: center;
        line-height: 56rpx;
        color: #333;
        font-size: 26rpx;
        font-weight: bold;
        border-radius: 12rpx;
        border: 1px solid #333333;
        margin-top: 30rpx;
    }
}
```

**替换后（新代码）：**
```scss
.orderItem {
    width: 690rpx;
    padding: 24rpx 30rpx;
    background-color: #fff;
    border-radius: 30rpx;
    margin-left: 30rpx;
    margin-bottom: 24rpx;

    .card-header {
        margin-bottom: 24rpx;
    }

    .time {
        color: #999;
        font-size: 24rpx;
    }

    .status-text {
        font-size: 24rpx;
        color: #4E80FF;
    }

    .picture {
        width: 128rpx;
        height: 128rpx;
        border-radius: 16rpx;
        margin-right: 20rpx;
    }

    .card-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 128rpx;
    }

    .card-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
    }

    .card-bottom {
        margin-top: 16rpx;
    }

    .price {
        color: #FF4D4F;

        .price-symbol {
            font-size: 24rpx;
        }

        .price-num {
            font-size: 36rpx;
            font-weight: bold;
        }
    }

    .detailBtn {
        background-color: #4E80FF;
        color: #fff;
        font-size: 24rpx;
        border-radius: 999rpx;
        padding: 8rpx 24rpx;
    }
}
```

**关键变更说明：**

| 属性 | 旧值 | 新值 | 说明 |
|------|------|------|------|
| `min-height` | 500rpx | **删除** | 高度由内容自动撑开 |
| `padding` | 30rpx 40rpx | 24rpx 30rpx | 按需求调整内边距 |
| `.time` color | #7B7B7B | #999 | 统一为 #999 |
| `.picture` 尺寸 | 156×156rpx | 128×128rpx | 缩小图片 |
| `.picture` 圆角 | 30rpx | 16rpx | 减小圆角 |
| `.picture` margin-right | 无 | 20rpx | 新增右间距 |
| `.detailBtn` 背景 | 无（透明） | #4E80FF | 蓝色背景 |
| `.detailBtn` 边框 | 1px solid #333 | **删除** | 无边框 |
| `.detailBtn` 文字色 | #333 | #fff | 白色文字 |
| `.detailBtn` 尺寸 | 固定 196×58rpx | padding 撑开 | 8rpx 24rpx 内边距 |
| `.detailBtn` 圆角 | 12rpx | 999rpx | 全圆角胶囊形 |
| `.detailBtn` 字号 | 26rpx | 24rpx | 按需求调整 |
| `.detailBtn` font-weight | bold | **删除** | 不再加粗 |
| `.detailBtn` margin-top | 30rpx | **删除** | 改由父级 `.card-bottom` margin-top: 16rpx 控制 |

- [ ] **Step 2: 确认样式替换正确**

重新阅读修改后的 `.orderItem` 样式块，确认：
1. `min-height: 500rpx` 已删除
2. `padding` 为 `24rpx 30rpx`
3. `.status-text` 颜色为 `#4E80FF`
4. `.picture` 尺寸为 `128rpx`、圆角 `16rpx`、`margin-right: 20rpx`
5. `.card-info` 有 `flex: 1`、`flex-direction: column`、`justify-content: space-between`、`min-height: 128rpx`
6. `.detailBtn` 有 `background-color: #4E80FF`、`border-radius: 999rpx`、`padding: 8rpx 24rpx`，无边框

---

## Task 3: 编译验证与视觉检查

**Files:**
- 无文件修改，仅验证

- [ ] **Step 1: 在微信开发者工具中编译运行**

在微信开发者工具中点击"编译"，确认无编译错误。控制台不应出现红色报错信息。

预期：编译成功，页面正常渲染。

- [ ] **Step 2: 视觉验证卡片布局**

在投递记录页面检查每张卡片的视觉效果：

**卡片容器：**
- [ ] 卡片高度由内容自动撑开（无固定最小高度）
- [ ] 卡片内边距为 24rpx（上下）× 30rpx（左右）
- [ ] 白色背景、30rpx 圆角
- [ ] 卡片之间间距 24rpx

**第一层（头部）：**
- [ ] 时间在左，状态在右，两端对齐
- [ ] 时间文字 24rpx，颜色 #999（中灰）
- [ ] 状态文字 24rpx，颜色 #4E80FF（蓝色）
- [ ] 头部与主体之间间距 24rpx

**第二层（主体）：**
- [ ] 图片在左，信息区在右，顶部对齐
- [ ] 图片尺寸 128×128rpx，圆角 16rpx
- [ ] 图片与右侧信息间距 20rpx
- [ ] 右侧信息区高度与图片平齐（min-height: 128rpx）
- [ ] 物品名称在右上，32rpx 加粗，#333，超出 2 行省略
- [ ] 金额与按钮在右下同一行，两端对齐
- [ ] 金额红色（#FF4D4F），￥符号 24rpx，数字 36rpx 加粗
- [ ] 按钮蓝色背景（#4E80FF），白色文字 24rpx，胶囊形全圆角

- [ ] **Step 3: 功能验证（确认未被破坏）**

- [ ] 点击卡片任意位置 → 跳转到订单详情页（`/pagesMy/myOrder/orderDetail?id=xxx`）
- [ ] 点击"查看订单详情"按钮 → 同样跳转到订单详情页（事件冒泡到卡片）
- [ ] 下拉刷新 → 列表正常刷新（mescroll 下拉回调正常）
- [ ] 上拉加载 → 列表正常追加数据（mescroll 上拉回调正常）
- [ ] 点击时间筛选按钮 → 弹出 u-select 选择器
- [ ] 选择"最近三个月" → 列表按时间筛选刷新
- [ ] 有投递记录图片的卡片 → 显示真实图片
- [ ] 无投递记录图片的卡片 → 显示默认占位图 `/static/empImg.png`

- [ ] **Step 4: 清除缓存重新编译（如有显示异常）**

如果发现样式未更新或显示异常：
1. 微信开发者工具 → 清除全部缓存（清缓存 → 全部清除）
2. 重新编译
3. 再次验证

---

## Task 4: 提交代码

**Files:**
- 无文件修改，仅 git 操作

- [ ] **Step 1: 查看变更**

```bash
git diff pagesMy/myOrder/myOrder.vue
```

预期：仅 `pagesMy/myOrder/myOrder.vue` 有变更，变更内容为模板结构重构和样式替换。

- [ ] **Step 2: 提交**

```bash
git add pagesMy/myOrder/myOrder.vue
git commit -m "style: 重构投递记录卡片布局为头部+左图右文两层结构"
```

---

## Self-Review

### 1. Spec 覆盖检查

| 需求 | 对应 Task | 状态 |
|------|-----------|------|
| 卡片容器宽 690rpx | Task 2 Step 1 `.orderItem` | ✓ |
| 卡片下边距 24rpx | Task 2 Step 1 `.orderItem` margin-bottom | ✓ |
| 内边距 padding: 24rpx 30rpx | Task 2 Step 1 `.orderItem` padding | ✓ |
| 白色背景 | Task 2 Step 1 `.orderItem` background-color | ✓ |
| 圆角 30rpx | Task 2 Step 1 `.orderItem` border-radius | ✓ |
| 删除 min-height: 500rpx | Task 2 Step 1（已移除） | ✓ |
| 头部 u-flex u-row-between | Task 1 Step 1 `card-header` class | ✓ |
| 头部 margin-bottom: 24rpx | Task 2 Step 1 `.card-header` | ✓ |
| 时间 24rpx #999 | Task 2 Step 1 `.time` | ✓ |
| 状态 24rpx 主色调 | Task 2 Step 1 `.status-text` color #4E80FF | ✓ |
| 主体 u-flex u-col-top | Task 1 Step 1 `card-body` class | ✓ |
| 图片 128×128rpx | Task 2 Step 1 `.picture` | ✓ |
| 图片圆角 16rpx | Task 2 Step 1 `.picture` border-radius | ✓ |
| 图片 margin-right: 20rpx | Task 2 Step 1 `.picture` margin-right | ✓ |
| 右侧 flex:1 | Task 2 Step 1 `.card-info` flex | ✓ |
| 右侧 flex-direction: column | Task 2 Step 1 `.card-info` | ✓ |
| 右侧 justify-content: space-between | Task 2 Step 1 `.card-info` | ✓ |
| 右侧高度与图片平齐 | Task 2 Step 1 `.card-info` min-height: 128rpx | ✓ |
| 标题 32rpx 加粗 #333 | Task 2 Step 1 `.card-title` | ✓ |
| 标题单行或双行超出省略 | Task 1 Step 1 `u-line-2` class | ✓ |
| 金额+按钮同行 u-flex u-row-between u-col-center | Task 1 Step 1 `card-bottom` class | ✓ |
| 金额红色 | Task 2 Step 1 `.price` color #FF4D4F | ✓ |
| ￥符号 24rpx | Task 2 Step 1 `.price-symbol` | ✓ |
| 金额数字 36rpx 加粗 | Task 2 Step 1 `.price-num` | ✓ |
| 按钮纯蓝色背景 | Task 2 Step 1 `.detailBtn` background #4E80FF | ✓ |
| 按钮无边框 | Task 2 Step 1（已移除 border） | ✓ |
| 按钮白色文字 24rpx | Task 2 Step 1 `.detailBtn` color + font-size | ✓ |
| 按钮全圆角 999rpx | Task 2 Step 1 `.detailBtn` border-radius | ✓ |
| 按钮内边距 8rpx 24rpx | Task 2 Step 1 `.detailBtn` padding | ✓ |

### 2. Placeholder 扫描

- 无 "TBD"、"TODO"、"implement later" 等占位符
- 所有代码步骤都包含完整代码
- 所有命令都有预期输出说明

### 3. 类型/命名一致性

- 模板中的 class 名（`card-header`、`status-text`、`card-body`、`card-info`、`card-title`、`card-bottom`、`price`、`price-symbol`、`price-num`、`detailBtn`）与 CSS 中的选择器完全一致
- Task 1 中定义的 class 名与 Task 2 中样式化的 class 名逐一核对，无拼写差异

### 4. 功能完整性

- `@click="toDetail(item)"` —— 保留 ✓
- `v-if/v-else` 图片逻辑 —— 保留 ✓
- 所有数据绑定 —— 保留 ✓
- mescroll/u-select/u-navbar/u-tabs —— 未触碰 ✓
