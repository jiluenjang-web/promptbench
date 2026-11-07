# PromptBench｜生成式 AI 工具與提示詞實驗室

> 用情境選工具，用結構寫 Prompt。

## 專案簡介

PromptBench 是一個以臺灣繁體中文呈現、以任務為中心的生成式 AI 工具與 Prompt 知識庫。網站整理不同工具的定位、適用對象、用途、優勢、限制、建議流程與官方來源，也提供可替換變數、重複使用並人工驗證的 Prompt 配方。

本專案使用原生 HTML、CSS 與 JavaScript，不需要後端、資料庫、API 金鑰或建置流程，可直接部署到 GitHub Pages。

## 專案動機

生成式 AI 工具的功能與方案持續變動，單純羅列產品名稱或建立排行榜，難以協助初學者完成實際任務。PromptBench 希望建立一套可以持續維護的方法：先定義任務，再以一致欄位比較工具，最後使用結構化 Prompt 完成工作並回到原始資料人工查證。

這個資料與頁面系統也用來驗證 `AGENTS.md` 的作用：新的 AI Agent 即使沒有閱讀先前對話，仍能依固定規則新增工具、Prompt 或分類，並自動沿用既有卡片、詳細頁、搜尋、篩選與比較功能。

## 主要功能

- 首頁：說明專案價值、使用流程與精選內容。
- AI 工具圖鑑：目前包含 7 項工具，可依關鍵字、用途分類與使用程度篩選。
- 工具詳細頁：以同一份資料呈現定位、對象、用途、優勢、限制、流程、來源與確認日期。
- 工具比較：一次並排比較兩項工具的定位、適合對象、用途、優勢與限制。
- Prompt 配方庫：目前包含 6 份配方，可依關鍵字、分類與難度篩選。
- Prompt 詳細頁：呈現範本、替換變數、操作步驟、示例、注意事項與人工驗證清單，並支援複製範本。
- 工具選擇指南：協助使用者從任務、資料、輸出與風險選擇工具。
- 關於本站：說明資料方法、內容限制與專案文件。
- 響應式與無障礙：支援手機、平板、桌面、鍵盤操作、清楚的 focus 狀態及 `prefers-reduced-motion`。
- 狀態處理：提供載入、無結果、無效 ID 與錯誤提示，不加入沒有功能的控制項。

## 使用技術

- HTML5 語意化標記
- CSS3、CSS 自訂屬性、Flexbox 與 Grid
- 原生 JavaScript 與 ES modules
- GitHub Pages 靜態網站部署

專案沒有使用前端框架、套件管理器、後端伺服器、資料庫、第三方追蹤碼或外部 API。

## 專案結構

```text
.
├── index.html              # 首頁
├── tools.html              # AI 工具圖鑑
├── tool.html               # 共用工具詳細頁，以 ?id= 讀取資料
├── prompts.html            # Prompt 配方庫
├── prompt.html             # 共用 Prompt 詳細頁，以 ?id= 讀取資料
├── compare.html            # 兩項工具比較
├── guide.html              # 工具選擇指南
├── about.html              # 關於本站與資料方法
├── css/
│   ├── tokens.css          # 色彩、字體、間距與版面 token
│   ├── base.css            # 基礎排版與全站無障礙設定
│   ├── components.css      # 共用卡片、按鈕、表單與狀態元件
│   └── pages.css           # 各頁面版面
├── js/
│   ├── app.js              # 頁面初始化與互動整合
│   ├── render.js           # 共用卡片與詳細內容渲染
│   ├── search.js           # 搜尋文字正規化與比對
│   ├── filters.js          # 工具與 Prompt 篩選
│   └── compare.js          # 工具比較邏輯
├── data/
│   ├── tools.js            # AI 工具的單一資料來源
│   ├── prompts.js          # Prompt 配方的單一資料來源
│   └── categories.js       # 工具與 Prompt 分類
├── assets/
│   ├── icons/              # favicon 與圖示
│   └── images/             # 網站圖片素材
├── AGENTS.md               # AI Agent 與開發規範
├── submission-template.md  # 作業繳交文字範本
├── .gitignore              # 排除本機工作資料
└── README.md
```

`work/` 與 `outputs/` 是本機工作資料，不屬於網站成品，已由 `.gitignore` 排除。

## 本機預覽

網站使用 ES modules，不建議直接以 `file://` 開啟。請在專案根目錄啟動只綁定本機的 HTTP 伺服器：

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

接著在瀏覽器開啟：

```text
http://127.0.0.1:8000/
```

結束預覽時，在終端機按 `Control + C`。

## GitHub Pages 部署方法

本專案沒有建置步驟，建議直接從預設分支的 Repository 根目錄發布：

1. 建立 GitHub Repository，並將完整專案推送到預設分支，例如 `main`。
2. 確認 Repository 根目錄包含 `index.html`、所有 HTML、`css/`、`js/`、`data/`、`assets/`、`AGENTS.md` 與 `README.md`。
3. 確認沒有提交 `work/`、`outputs/`、密碼、Token、Cookie 或其他敏感資料。
4. 在 GitHub Repository 開啟 `Settings` → `Pages`。
5. 在 `Build and deployment` 的 `Source` 選擇 `Deploy from a branch`。
6. 選擇預設分支及 `/(root)`，然後儲存。
7. 等候部署完成，從 Pages 設定頁開啟公開網址。
8. 以公開網址重新檢查首頁、詳細頁查詢參數、搜尋、篩選、Prompt 複製、工具比較及外部連結。
9. 部署完成後，以 [submission-template.md](submission-template.md) 中的正式連結進行最後核對。

所有內部連結均使用相對路徑，因此可部署在 `https://使用者名稱.github.io/repository-name/` 這類子路徑下。GitHub Pages 的官方設定步驟可參考 [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 新增 AI 工具

新增工具前必須先閱讀 [AGENTS.md](AGENTS.md) 第 10、13、18 與 22 節，並依下列流程操作：

1. 在 `data/tools.js` 搜尋既有 ID、名稱與關鍵字，避免重複。
2. 查閱官方產品頁與官方說明，確認功能、限制與現行入口。
3. 建立穩定且唯一的小寫 kebab-case `id`。
4. 依既有物件填寫所有固定欄位，包括定位、對象、用途、至少三項優勢、至少三項限制、情境、流程、來源與確認日期。
5. 優先使用 `data/categories.js` 的既有分類；只有確實無法歸類時才新增分類。
6. 以 `relatedPromptIds` 與 `relatedToolIds` 建立有效關聯。
7. 將 `status` 設為 `active`、`reviewStatus` 設為 `reviewed` 前，確認資料完整且官方來源可直接支持內容。
8. 檢查工具是否出現在列表、搜尋、分類篩選、詳細頁與兩項比較功能。
9. 測試桌面、平板、手機與鍵盤操作。

不需要為單一工具新增 HTML 頁面或特殊元件；`tool.html` 與共用渲染程式會依資料 ID 顯示內容。

## 新增 Prompt 配方

新增 Prompt 前必須先閱讀 [AGENTS.md](AGENTS.md) 第 11、13 與 22 節：

1. 定義單一、明確的任務，並檢查是否已有功能相同的配方。
2. 在 `data/prompts.js` 新增唯一的小寫 kebab-case `id`。
3. 選擇 `data/categories.js` 中的一個主要 Prompt 分類。
4. 依既有物件填寫目的、適用情境、準備資料、範本、步驟、預期輸出、示例、警告與驗證清單。
5. 範本變數使用 `{{變數名稱}}`，並在 `variables` 中逐一說明；不可留下未定義變數。
6. 以 `recommendedToolIds` 連結既有工具，且 ID 必須有效。
7. 正式內容使用 `published` 狀態，並填寫版本、更新日期與修改說明。
8. 使用不含敏感資訊的示例測試，確認不要求 AI 捏造來源或隱藏不確定性。
9. 檢查配方是否出現在列表、搜尋、分類篩選及共用詳細頁，並測試複製功能。

不需要為單一 Prompt 新增 HTML 頁面；`prompt.html` 會依查詢參數讀取同一份資料。

## AGENTS.md 的作用

[AGENTS.md](AGENTS.md) 是本專案的主要開發契約，記錄：

- 專案目的、使用者、範圍與繁體中文規則。
- 視覺 token、共用元件、響應式與無障礙標準。
- HTML、CSS、JavaScript、檔案及資料 ID 的命名規則。
- AI 工具、Prompt 與分類的固定資料格式。
- 新增內容、查證來源、測試與交付流程。
- AI Agent 不可自行加入的假功能、框架、後端或未證實資料。

它建立了以下可重複使用的開發鏈：

```text
AGENTS.md 規則
→ 固定資料格式
→ 共用卡片與詳細頁模板
→ 搜尋、篩選與比較讀取同一份資料
→ 新增內容自動融入既有功能
```

因此，新的 AI Agent 不需要依賴先前對話，也能先讀取規則，再用相同方法安全地新增或修改內容。

## 資料來源與內容聲明

- 產品功能、存取方式與限制優先採用官方產品頁、官方說明或官方公告。
- 每項工具均記錄來源與最後確認日期；日期代表最近一次人工或編輯確認，不代表資訊永久有效。
- 工具優勢、限制與適用情境是依公開資訊整理的編輯性說明，不是絕對排名。
- 網站未宣稱所有內容均為作者親自實測；除非未來加入明確標示的實測紀錄。
- Prompt 範本與示例用於示範工作方法，不代表 AI 輸出一定正確。
- 研究、引用、數字、程式安全及其他重要資訊必須回到原始資料人工驗證。
- 第三方產品名稱與商標屬原權利人所有；本站不代表相關公司或服務。

## 已知限制

- 本站是靜態網站，不提供帳號、雲端同步、收藏、留言或跨裝置保存功能。
- 搜尋、篩選、比較與複製功能在瀏覽器本機執行，不會將資料送到後端。
- JavaScript 停用時仍可閱讀網站目的與方法，但資料列表與互動功能無法完整使用。
- AI 產品功能、方案、地區與帳號可用性可能在確認日期後改變。
- 目前資料量有限，不能涵蓋所有生成式 AI 工具與任務。
- 工具比較使用固定欄位協助理解情境，不構成全面評測或購買建議。
- 網站目前沒有自動化外部連結監測，部署後仍需定期人工複查來源。

## 未來可擴充方向

- 依既有格式持續加入工具、Prompt 與任務分類。
- 加入具日期、測試條件與證據的個人實測紀錄，並與官方資訊分開呈現。
- 增加工具更新紀錄與 Prompt 版本差異說明。
- 擴充更多比較條件，例如輸入類型、使用平台與學習門檻。
- 在不使用後端的前提下，以 URL 查詢參數保存或分享篩選條件。
- 加入可列印的工具比較與 Prompt 使用清單。
- 建立簡單的資料格式驗證與內部連結檢查腳本。
- 持續進行鍵盤、螢幕閱讀器、文字放大與色彩對比測試。

## 作業繳交

可直接複製的繁體中文繳交內容請見 [submission-template.md](submission-template.md)，其中已整理 Repository、GitHub Pages 與 AGENTS.md 的正式連結。
