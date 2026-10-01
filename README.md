# 兵臨城下

中國古代架空即時攻守城戰術遊戲，包含三個關卡、攻守雙方、人物對話與教學。

## 本機啟動

解壓縮後，在 index.html 所在資料夾執行：

```sh
python -m http.server 8000
```

接著用瀏覽器開啟 http://localhost:8000 。需安裝 Python 3，也可以使用其他靜態網頁伺服器。
請透過 HTTP 伺服器啟動；直接雙擊 HTML 可能因 ES 模組限制而無法載入。

## 上傳 GitHub

將解壓縮後的所有檔案與 assets 資料夾放進儲存庫，保持相對路徑。index.html 已放在根目錄。
上傳程式碼不等於開啟網站；如要線上遊玩，另將儲存庫配置為靜態網站託管（例如 GitHub Pages）。
不需要 npm 安裝、建置程序、後端或 API 金鑰。

## 檔案

- index.html、style.css：畫面及樣式
- app.mjs：介面與遊戲互動
- engine.mjs：戰鬥、軍令與遊戲規則
- navigation.mjs、terrain.mjs、map-layout.mjs：路徑、地形與地圖
- order-targets.mjs：依軍令篩選可操作目標
- tutorial.mjs：新手教學
- stories.mjs、dialogue.mjs：關卡背景與人物對話
- telemetry.mjs：部隊戰果統計
- assets/：三張人物圖片

存檔保存在目前瀏覽器的 localStorage，換裝置或網站網址不會自動轉移。字體透過 Google Fonts 載入，無網路時使用系統替代字體。
