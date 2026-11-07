import { tools } from "../data/tools.js";
import { prompts } from "../data/prompts.js";
import { toolCategories, promptCategories } from "../data/categories.js";
import { filterTools, filterPrompts } from "./filters.js";
import {
  createToolCard,
  createPromptCard,
  renderCollection,
  renderToolDetail,
  renderPromptDetail,
  renderError,
  fillCategorySelect
} from "./render.js";
import { initializeComparison } from "./compare.js";

function initializeNavigation() {
  const button = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!button || !nav) return;
  button.setAttribute("aria-label", "開啟主要選單");

  const closeNav = () => {
    nav.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "開啟主要選單");
  };

  button.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
    button.setAttribute("aria-label", willOpen ? "關閉主要選單" : "開啟主要選單");
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
      button.focus();
    }
  });
}

function initializeHome() {
  const toolsContainer = document.querySelector("#featured-tools");
  const promptsContainer = document.querySelector("#featured-prompts");
  const toolTotal = document.querySelector("#home-tool-total");
  const promptTotal = document.querySelector("#home-prompt-total");
  if (toolTotal) toolTotal.textContent = String(tools.filter((tool) => tool.status === "active").length);
  if (promptTotal) promptTotal.textContent = String(prompts.filter((prompt) => prompt.status === "published").length);
  if (toolsContainer) renderCollection(toolsContainer, tools.slice(0, 3), createToolCard, "目前沒有精選工具。");
  if (promptsContainer) renderCollection(promptsContainer, prompts.slice(0, 3), createPromptCard, "目前沒有精選 Prompt。");
}

function initializeToolExplorer() {
  const container = document.querySelector("#tool-results");
  const count = document.querySelector("#tool-result-count");
  const search = document.querySelector("#tool-search");
  const category = document.querySelector("#tool-category");
  const level = document.querySelector("#tool-level");
  const clear = document.querySelector("#tool-clear");
  const comparePanel = document.querySelector("#compare-selection");
  const compareStatus = document.querySelector("#compare-selection-status");
  const compareItems = document.querySelector("#compare-selection-items");
  const compareClear = document.querySelector("#compare-selection-clear");
  const compareLink = document.querySelector("#compare-selection-link");
  if (!container || !count || !search || !category || !level || !clear || !comparePanel || !compareStatus || !compareItems || !compareClear || !compareLink) return;

  fillCategorySelect(category, toolCategories);
  const selectedToolIds = [];
  let selectionNotice = "";

  const clearFilters = () => {
    search.value = "";
    category.value = "";
    level.value = "";
    search.focus();
    update();
  };

  const renderComparisonSelection = () => {
    comparePanel.hidden = selectedToolIds.length === 0;
    compareItems.replaceChildren();
    selectedToolIds.forEach((id) => {
      const tool = tools.find((item) => item.id === id);
      if (!tool) return;
      const item = document.createElement("span");
      item.className = "compare-selection__item";
      const name = document.createElement("span");
      name.textContent = tool.name;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "移除";
      remove.setAttribute("aria-label", `從比較中移除 ${tool.name}`);
      remove.addEventListener("click", () => {
        selectedToolIds.splice(selectedToolIds.indexOf(id), 1);
        selectionNotice = "";
        update();
      });
      item.append(name, remove);
      compareItems.append(item);
    });
    compareStatus.textContent = selectionNotice || (selectedToolIds.length === 1
      ? "已選 1 項，請再選 1 項工具。"
      : selectedToolIds.length === 2
        ? "已選 2 項，可以開始比較。"
        : "");
    const ready = selectedToolIds.length === 2;
    compareLink.hidden = !ready;
    if (ready) {
      const params = new URLSearchParams({ first: selectedToolIds[0], second: selectedToolIds[1] });
      compareLink.href = `compare.html?${params.toString()}`;
    }
  };

  const handleSelectionChange = (id, isSelected) => {
    const index = selectedToolIds.indexOf(id);
    if (isSelected && index === -1) {
      if (selectedToolIds.length >= 2) {
        selectionNotice = "一次最多比較兩項工具；請先移除一項再選擇。";
        update();
        return;
      }
      selectedToolIds.push(id);
    } else if (!isSelected && index !== -1) {
      selectedToolIds.splice(index, 1);
    }
    selectionNotice = "";
    update();
  };

  const update = () => {
    const results = filterTools(tools, { query: search.value, category: category.value, level: level.value });
    count.textContent = `共 ${results.length} 項工具`;
    count.classList.remove("status-line--loading");
    renderCollection(
      container,
      results,
      (tool) => createToolCard(tool, {
        selectable: true,
        selected: selectedToolIds.includes(tool.id),
        onSelectionChange: handleSelectionChange
      }),
      "請檢查關鍵字是否正確，或移除用途與程度篩選後再試一次。",
      { label: "清除所有篩選條件", onClick: clearFilters }
    );
    renderComparisonSelection();
    container.setAttribute("aria-busy", "false");
  };
  [search, category, level].forEach((control) => control.addEventListener("input", update));
  clear.addEventListener("click", clearFilters);
  compareClear.addEventListener("click", () => {
    selectedToolIds.splice(0);
    selectionNotice = "";
    update();
    search.focus();
  });
  update();
}

function initializePromptExplorer() {
  const container = document.querySelector("#prompt-results");
  const count = document.querySelector("#prompt-result-count");
  const search = document.querySelector("#prompt-search");
  const category = document.querySelector("#prompt-category");
  const difficulty = document.querySelector("#prompt-difficulty");
  const clear = document.querySelector("#prompt-clear");
  if (!container || !count || !search || !category || !difficulty || !clear) return;

  fillCategorySelect(category, promptCategories);
  const clearPromptFilters = () => {
    search.value = "";
    category.value = "";
    difficulty.value = "";
    search.focus();
    update();
  };
  const update = () => {
    const results = filterPrompts(prompts, { query: search.value, category: category.value, difficulty: difficulty.value });
    count.textContent = `共 ${results.length} 份配方`;
    count.classList.remove("status-line--loading");
    renderCollection(
      container,
      results,
      createPromptCard,
      "請檢查關鍵字是否正確，或移除分類與難度篩選後再試一次。",
      { label: "清除所有篩選條件", onClick: clearPromptFilters }
    );
    container.setAttribute("aria-busy", "false");
  };
  [search, category, difficulty].forEach((control) => control.addEventListener("input", update));
  clear.addEventListener("click", clearPromptFilters);
  update();
}

function initializeDetailPage(type) {
  const container = document.querySelector("#detail-content");
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get("id");
  if (type === "tool") {
    const item = tools.find((tool) => tool.id === id && tool.status === "active");
    if (!item) return renderError(container, "找不到工具", "這項工具不存在、尚未發布或網址不完整。");
    document.title = `${item.name}｜PromptBench`;
    renderToolDetail(container, item, new Map(prompts.map((prompt) => [prompt.id, prompt])));
  } else {
    const item = prompts.find((prompt) => prompt.id === id && prompt.status === "published");
    if (!item) return renderError(container, "找不到 Prompt", "這份 Prompt 不存在、尚未發布或網址不完整。");
    document.title = `${item.title}｜PromptBench`;
    renderPromptDetail(container, item, new Map(tools.map((tool) => [tool.id, tool])));
  }
}

initializeNavigation();

switch (document.body.dataset.page) {
  case "home": initializeHome(); break;
  case "tools": initializeToolExplorer(); break;
  case "tool-detail": initializeDetailPage("tool"); break;
  case "prompts": initializePromptExplorer(); break;
  case "prompt-detail": initializeDetailPage("prompt"); break;
  case "compare": initializeComparison(tools); break;
}
