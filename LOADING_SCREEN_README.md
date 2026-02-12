# Herta's Game Center - 加載畫面系統

## 概述

此系統為 Herta's Game Center 的所有遊戲提供了統一的主題感知加載畫面。加載畫面會根據用戶的主題偏好（深色/淺色模式）自動調整外觀，並在遊戲加載完成後自動跳轉到目標遊戲。

## 系統組成

### 1. 加載畫面模板 (`loading-screen-template.html`)
- 主要加載畫面 HTML 文件
- 支援深色和淺色兩種主題
- 動態進度條和遊戲提示
- 自動檢測用戶主題偏好

### 2. 主頁整合 (`index.html`)
- 已修改遊戲卡片點擊事件
- 點擊遊戲卡片時會先跳轉到加載畫面
- 加載畫面會顯示遊戲標題、圖標和描述

### 3. 測試工具
- `test-loading-screen.html` - 加載畫面測試頁面
- `test_links.html` - 遊戲連結測試工具

## 功能特性

### 主題感知
- 自動檢測用戶主題偏好（localStorage > 系統偏好 > 默認深色）
- 支援手動設置主題（深色/淺色/自動）
- 與主頁主題系統完全兼容

### 加載體驗
- 動態進度條模擬真實加載過程
- 隨機顯示遊戲提示和技巧
- 狀態消息更新（初始化、加載資源、準備場景等）
- 可跳過加載（按 ESC 鍵，僅用於測試）

### 遊戲集成
- 支援所有10個遊戲
- 自定義遊戲標題、圖標和描述
- 加載完成後自動跳轉

## 使用方法

### 對於用戶
1. 在主頁點擊任何遊戲卡片
2. 系統會顯示加載畫面（根據主題偏好）
3. 等待加載完成（約2-3秒）
4. 自動進入遊戲

### 對於開發者
#### 添加新遊戲
1. 在 `index.html` 的 `games` 數組中添加新遊戲條目：
```javascript
{
    id: 11,
    title: "新遊戲名稱",
    filename: "new-game.html",
    description: "遊戲描述",
    icon: "🎮",
    categories: ["category1", "category2"],
    tags: ["標籤1", "標籤2"],
    color: "neon-blue",
    isNew: true,
    isHot: false
}
```

#### 測試加載畫面
1. 打開 `test-loading-screen.html`
2. 點擊測試按鈕查看不同遊戲的加載畫面
3. 可以測試深色、淺色和自動主題

#### 主題設置
```javascript
// 設置深色模式
localStorage.setItem('theme', 'dark');

// 設置淺色模式
localStorage.setItem('theme', 'light');

// 清除設置（使用系統偏好）
localStorage.removeItem('theme');
```

## 技術實現

### 主題檢測邏輯
1. 檢查 URL 參數中的 `theme` 設置
2. 檢查 localStorage 中的 `theme` 設置
3. 檢查系統顏色方案偏好
4. 默認使用深色模式

### 加載流程
1. 接收遊戲參數（標題、圖標、描述、目標URL）
2. 應用主題設置
3. 初始化進度條（0%）
4. 模擬加載過程（逐步增加進度）
5. 更新狀態消息和提示
6. 達到100%後跳轉到目標遊戲

### 性能優化
- 使用 Tailwind CSS 進行快速樣式渲染
- 最小化 JavaScript 執行時間
- 漸進式進度更新，避免卡頓
- 支援 ESC 鍵跳過（僅用於開發測試）

## 文件結構

```
herta/
├── index.html                    # 主頁（已集成加載畫面）
├── loading-screen-template.html  # 加載畫面模板
├── loading-screen-manager.js     # 加載畫面管理器（可選）
├── test-loading-screen.html      # 測試頁面
├── test_links.html              # 連結測試工具
├── LOADING_SCREEN_README.md     # 本文檔
└── [遊戲文件].html              # 所有遊戲文件
```

## 自定義選項

### 修改加載時間
在 `loading-screen-template.html` 中修改加載速度：
```javascript
// 增加或減少這個值來調整加載速度
let increment = 0.5 + Math.random() * 1.5; // 當前設置
```

### 添加更多遊戲提示
在 `loading-screen-template.html` 中擴展 `gameTips` 數組：
```javascript
const gameTips = [
    "你的新提示在這裡",
    // ... 現有提示
];
```

### 修改主題顏色
在 `loading-screen-template.html` 的 `<style>` 部分修改 CSS 變數：
```css
:root {
    --primary: #e63374;           /* 主色 */
    --neon-blue: #00dcb0;         /* 霓虹藍 */
    --neon-purple: #8e3eb0;       /* 霓虹紫 */
    --neon-pink: #e52e71;         /* 霓虹粉 */
    --neon-orange: #ff7b00;       /* 霓虹橙 */
}
```

## 故障排除

### 加載畫面不顯示
1. 檢查 `loading-screen-template.html` 文件是否存在
2. 檢查瀏覽器控制台是否有 JavaScript 錯誤
3. 確認 URL 參數正確傳遞

### 主題不正確
1. 檢查 localStorage 中的 `theme` 設置
2. 確認系統顏色方案設置
3. 檢查 URL 中的 `theme` 參數

### 加載後不跳轉
1. 檢查目標遊戲文件是否存在
2. 確認 `target` 參數正確
3. 檢查瀏覽器是否阻止彈出窗口

## 未來擴展

### 計劃功能
1. **真實加載進度** - 集成實際資源加載進度
2. **更多動畫效果** - 添加更多過渡和微互動
3. **音效支持** - 加載過程中的音效反饋
4. **多語言支持** - 支援更多語言界面

### 性能改進
1. **預加載** - 在用戶懸停時預加載遊戲資源
2. **緩存優化** - 使用 Service Worker 緩存加載畫面
3. **代碼分割** - 將加載畫面代碼模塊化

## 貢獻指南

歡迎提交問題和拉取請求來改進此系統。請確保：
1. 保持與現有主題系統的兼容性
2. 所有遊戲加載畫面正常工作
3. 測試深色和淺色兩種主題模式
4. 更新相關文檔

## 許可證

此加載畫面系統是 Herta's Game Center 的一部分，遵循項目整體許可證。