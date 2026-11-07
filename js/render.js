import { toolCategories, promptCategories, getCategoryLabel } from "../data/categories.js";

const difficultyLabels = {
  beginner: "入門",
  intermediate: "進階",
  advanced: "高階"
};

export function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
  }
  return element;
}

function createTag(text, accent = false) {
  return createElement("span", { className: accent ? "tag tag--accent" : "tag", text });
}

function createLink(text, href, className = "") {
  return createElement("a", { className, text, attributes: { href } });
}

function createTextList(items) {
  const list = createElement("ul");
  items.forEach((item) => list.append(createElement("li", { text: item })));
  return list;
}

export function createToolCard(tool, options = {}) {
  const article = createElement("article", { className: "card tool-card" });
  if (options.selectable) {
    const selector = createElement("label", { className: "compare-selector" });
    const checkbox = createElement("input", {
      attributes: {
        type: "checkbox",
        value: tool.id,
        "aria-label": `選擇 ${tool.name} 進行比較`
      }
    });
    checkbox.checked = Boolean(options.selected);
    checkbox.addEventListener("change", () => options.onSelectionChange?.(tool.id, checkbox.checked));
    selector.append(checkbox, createElement("span", { text: "加入比較" }));
    article.append(selector);
  }
  const meta = createElement("div", { className: "card__meta" });
  tool.categories.slice(0, 3).forEach((category) => {
    meta.append(createTag(getCategoryLabel(toolCategories, category)));
  });

  const title = createElement("h3", { text: tool.name });
  const positioningLabel = createElement("p", { className: "card__label", text: "定位" });
  const tagline = createElement("p", { className: "tool-card__summary", text: tool.tagline });
  const bestFor = createElement("div", { className: "card__fact" });
  bestFor.append(
    createElement("strong", { text: "推薦情境" }),
    createElement("span", { text: tool.bestFor[0] })
  );
  const useCase = createElement("div", { className: "card__fact" });
  useCase.append(
    createElement("strong", { text: "主要用途" }),
    createElement("span", { text: tool.useCases.slice(0, 2).join("、") })
  );
  const footer = createElement("div", { className: "card__footer" });
  footer.append(
    createLink("查看工具", `tool.html?id=${encodeURIComponent(tool.id)}`, "button button--secondary"),
    createElement("a", {
      className: "text-link",
      text: "官方網站（新分頁）",
      attributes: { href: tool.officialUrl, target: "_blank", rel: "noopener noreferrer" }
    })
  );
  article.append(meta, title, positioningLabel, tagline, bestFor, useCase, footer);
  return article;
}

export function createPromptCard(prompt) {
  const article = createElement("article", { className: "card prompt-card" });
  const meta = createElement("div", { className: "card__meta" });
  meta.append(
    createTag(getCategoryLabel(promptCategories, prompt.category)),
    createTag(difficultyLabels[prompt.difficulty], true)
  );
  const title = createElement("h3", { text: prompt.title });
  const summary = createElement("p", { className: "prompt-card__summary", text: prompt.summary });
  const goal = createElement("div", { className: "card__fact" });
  goal.append(
    createElement("strong", { text: "使用目的" }),
    createElement("span", { text: prompt.goal })
  );
  const stats = createElement("div", { className: "card__stats" });
  stats.append(
    createElement("span", { text: `${prompt.variables.length} 個替換欄位` }),
    createElement("span", { text: `${prompt.steps.length} 個使用步驟` })
  );
  const footer = createElement("div", { className: "card__footer" });
  footer.append(
    createLink("查看配方", `prompt.html?id=${encodeURIComponent(prompt.id)}`, "button button--secondary"),
    createElement("span", { className: "muted", text: `v${prompt.version}` })
  );
  article.append(meta, title, summary, goal, stats, footer);
  return article;
}

export function renderCollection(container, items, cardFactory, emptyMessage, emptyAction = null) {
  container.replaceChildren();
  if (!items.length) {
    const empty = createElement("div", { className: "empty-state" });
    empty.append(
      createElement("span", { className: "state-mark", text: "0", attributes: { "aria-hidden": "true" } }),
      createElement("h2", { text: "找不到符合條件的內容" }),
      createElement("p", { text: emptyMessage })
    );
    if (emptyAction) {
      const action = createElement("button", { className: "button button--secondary", text: emptyAction.label, attributes: { type: "button" } });
      action.addEventListener("click", emptyAction.onClick);
      empty.append(action);
    }
    container.append(empty);
    return;
  }
  items.forEach((item) => container.append(cardFactory(item)));
}

function appendDetailSection(parent, title, content) {
  const section = createElement("section", { className: "detail-section" });
  section.append(createElement("h2", { text: title }), content);
  parent.append(section);
}

function createWorkflow(steps) {
  const list = createElement("ol");
  steps.forEach((item) => {
    const entry = createElement("li");
    entry.append(
      createElement("strong", { text: `${item.title}：` }),
      document.createTextNode(item.description)
    );
    list.append(entry);
  });
  return list;
}

function createSources(sources) {
  const list = createElement("ul");
  sources.forEach((source) => {
    const item = createElement("li");
    const link = createElement("a", {
      text: `${source.title}（${source.publisher}）`,
      attributes: { href: source.url, target: "_blank", rel: "noopener noreferrer" }
    });
    item.append(link);
    list.append(item);
  });
  return list;
}

function createPromptCopyArea(template) {
  const wrapper = createElement("div", { className: "prompt-copy" });
  const header = createElement("div", { className: "prompt-copy__header" });
  const label = createElement("p", { className: "prompt-copy__label", text: "PROMPT / 可直接複製" });
  const statusId = `copy-status-${Math.random().toString(36).slice(2)}`;
  const status = createElement("p", {
    className: "prompt-copy__status",
    attributes: { id: statusId, "aria-live": "polite" }
  });
  const button = createElement("button", {
    className: "button button--secondary",
    text: "複製 Prompt",
    attributes: { type: "button", "aria-describedby": statusId }
  });
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(template);
      button.textContent = "已複製";
      status.textContent = "Prompt 已複製到剪貼簿。請記得替換雙大括號中的欄位。";
    } catch {
      status.textContent = "瀏覽器無法自動複製，請手動選取下方文字。";
    }
  });
  header.append(label, button);
  wrapper.append(header, createElement("pre", { className: "prompt-block", text: template }), status);
  return wrapper;
}

export function renderToolDetail(container, tool, promptsById) {
  const main = createElement("article", { className: "panel panel--notebook" });
  const tags = createElement("div", { className: "card__meta" });
  tool.categories.forEach((category) => tags.append(createTag(getCategoryLabel(toolCategories, category))));
  main.append(tags, createElement("h1", { text: tool.name }), createElement("p", { className: "hero__lead", text: tool.tagline }));
  appendDetailSection(main, "工具概述", createElement("p", { text: tool.summary }));
  appendDetailSection(main, "適合的使用者", createTextList(tool.audiences));
  appendDetailSection(main, "主要用途", createTextList(tool.useCases));
  appendDetailSection(main, "主要特色", createTextList(tool.features));
  appendDetailSection(main, "優勢", createTextList(tool.strengths));
  appendDetailSection(main, "限制與注意事項", createTextList(tool.limitations));
  appendDetailSection(main, "推薦使用情境", createTextList(tool.bestFor));
  appendDetailSection(main, "不適合的情境", createTextList(tool.notIdealFor));
  appendDetailSection(main, "建議使用流程", createWorkflow(tool.workflow));
  appendDetailSection(main, "安全提醒", createTextList(tool.safetyNotes));

  const sidebar = createElement("aside", { className: "panel panel--notebook" });
  sidebar.append(createElement("h2", { text: "資料資訊" }));
  const official = createElement("a", {
    className: "button button--primary",
    text: "前往官方網站",
    attributes: { href: tool.officialUrl, target: "_blank", rel: "noopener noreferrer" }
  });
  sidebar.append(official, createElement("p", { className: "muted", text: `最後確認：${tool.verifiedDate}` }));
  sidebar.append(createElement("h3", { text: "官方來源" }), createSources(tool.sources));
  const related = tool.relatedPromptIds.map((id) => promptsById.get(id)).filter(Boolean);
  if (related.length) {
    const list = createElement("ul");
    related.forEach((prompt) => {
      const item = createElement("li");
      item.append(createLink(prompt.title, `prompt.html?id=${encodeURIComponent(prompt.id)}`));
      list.append(item);
    });
    sidebar.append(createElement("h3", { text: "相關 Prompt" }), list);
  }
  container.replaceChildren(main, sidebar);
  container.setAttribute("aria-busy", "false");
}

export function renderPromptDetail(container, prompt, toolsById) {
  const main = createElement("article", { className: "panel panel--notebook" });
  const meta = createElement("div", { className: "card__meta" });
  meta.append(
    createTag(getCategoryLabel(promptCategories, prompt.category)),
    createTag(difficultyLabels[prompt.difficulty], true)
  );
  main.append(meta, createElement("h1", { text: prompt.title }), createElement("p", { className: "hero__lead", text: prompt.summary }));
  appendDetailSection(main, "使用目的", createElement("p", { text: prompt.goal }));
  appendDetailSection(main, "適合的情境", createTextList(prompt.suitableFor));
  appendDetailSection(main, "不適合的情境", createTextList(prompt.notSuitableFor));
  appendDetailSection(main, "使用前準備", createTextList(prompt.preparation));
  appendDetailSection(main, "Prompt 範本", createPromptCopyArea(prompt.template));
  const variableList = createElement("ul");
  prompt.variables.forEach((variable) => {
    const item = createElement("li");
    item.append(createElement("code", { text: `{{${variable.name}}}` }), document.createTextNode(`：${variable.description}`));
    variableList.append(item);
  });
  appendDetailSection(main, "需要替換的變數", variableList);
  appendDetailSection(main, "使用步驟", createWorkflow(prompt.steps));
  appendDetailSection(main, "預期輸出", createTextList(prompt.expectedOutput));
  const example = createElement("div");
  example.append(
    createElement("h3", { text: "示例輸入" }),
    createElement("p", { text: prompt.exampleInput }),
    createElement("h3", { text: "預期呈現" }),
    createElement("p", { text: prompt.exampleOutputDescription })
  );
  appendDetailSection(main, "簡短示例", example);
  appendDetailSection(main, "建議後續追問", createTextList(prompt.followUps));
  appendDetailSection(main, "人工驗證清單", createTextList(prompt.verificationChecklist));

  const sidebar = createElement("aside", { className: "panel panel--notebook" });
  sidebar.append(
    createElement("h2", { text: "配方資訊" }),
    createElement("p", { text: `版本：${prompt.version}` }),
    createElement("p", { text: `更新：${prompt.updatedDate}` }),
    createElement("h3", { text: "建議工具" })
  );
  const toolList = createElement("ul");
  prompt.recommendedToolIds.map((id) => toolsById.get(id)).filter(Boolean).forEach((tool) => {
    const item = createElement("li");
    item.append(createLink(tool.name, `tool.html?id=${encodeURIComponent(tool.id)}`));
    toolList.append(item);
  });
  sidebar.append(toolList, createElement("h3", { text: "注意事項" }), createTextList(prompt.warnings));
  container.replaceChildren(main, sidebar);
  container.setAttribute("aria-busy", "false");
}

export function renderError(container, title, message) {
  const error = createElement("div", { className: "error-state" });
  error.append(
    createElement("span", { className: "state-mark", text: "!", attributes: { "aria-hidden": "true" } }),
    createElement("h1", { text: title }),
    createElement("p", { text: message }),
    createLink("返回首頁", "index.html", "button button--secondary")
  );
  container.replaceChildren(error);
  container.setAttribute("aria-busy", "false");
}

export function fillCategorySelect(select, categories) {
  categories.filter((category) => category.status === "active").sort((a, b) => a.order - b.order).forEach((category) => {
    const option = createElement("option", { text: category.label, attributes: { value: category.id } });
    select.append(option);
  });
}
