export const toolCategories = [
  { id: "research", label: "研究與搜尋", description: "查找、比較、整理與驗證資料。", order: 10, status: "active" },
  { id: "document", label: "文件閱讀", description: "閱讀、摘要與提問文件內容。", order: 20, status: "active" },
  { id: "writing", label: "寫作與編輯", description: "發想、撰寫、改寫與校訂內容。", order: 30, status: "active" },
  { id: "coding", label: "程式開發", description: "理解、撰寫、測試與修正程式。", order: 40, status: "active" },
  { id: "learning", label: "學習與教學", description: "建立解釋、練習與複習材料。", order: 50, status: "active" },
  { id: "planning", label: "簡報與內容規劃", description: "整理架構、流程與表達順序。", order: 60, status: "active" }
];

export const promptCategories = [
  { id: "research", label: "資料研究", description: "比較來源、整理證據與找出缺口。", order: 10, status: "active" },
  { id: "summary", label: "文章摘要", description: "把長內容整理成可檢查的重點。", order: 20, status: "active" },
  { id: "writing", label: "寫作修改", description: "依目標、讀者與標準修改文字。", order: 30, status: "active" },
  { id: "coding", label: "程式開發", description: "理解問題、除錯與改善程式。", order: 40, status: "active" },
  { id: "learning", label: "學習與複習", description: "解釋概念、建立練習與複習。", order: 50, status: "active" },
  { id: "presentation", label: "簡報規劃", description: "將資料轉換成清楚的簡報結構。", order: 60, status: "active" }
];

export function getCategoryLabel(categories, id) {
  return categories.find((category) => category.id === id)?.label ?? id;
}
