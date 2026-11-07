import { createElement } from "./render.js";

function createComparisonCard(tool, index) {
  const article = createElement("article", { className: "panel comparison-card" });
  article.append(
    createElement("span", { className: "comparison-card__index", text: `TOOL ${index + 1}` }),
    createElement("h2", { text: tool.name }),
  );

  const sections = [
    ["定位", tool.tagline],
    ["適合對象", tool.audiences],
    ["主要用途", tool.useCases],
    ["優勢", tool.strengths],
    ["限制與注意事項", tool.limitations]
  ];
  sections.forEach(([title, items]) => {
    const field = createElement("section", { className: "comparison-card__field" });
    field.append(createElement("h3", { text: title }));
    if (typeof items === "string") {
      field.append(createElement("p", { className: "muted", text: items }));
      article.append(field);
      return;
    }
    const list = createElement("ul", { className: "comparison-list" });
    items.forEach((item) => list.append(createElement("li", { text: item })));
    field.append(list);
    article.append(field);
  });
  article.append(
    createElement("a", {
      className: "button button--secondary",
      text: "前往官方網站（新分頁）",
      attributes: { href: tool.officialUrl, target: "_blank", rel: "noopener noreferrer" }
    }),
    createElement("p", { className: "muted", text: `資料確認：${tool.verifiedDate}` })
  );
  return article;
}

export function initializeComparison(tools) {
  const firstSelect = document.querySelector("#compare-first");
  const secondSelect = document.querySelector("#compare-second");
  const output = document.querySelector("#comparison-output");
  if (!firstSelect || !secondSelect || !output) return;

  tools.filter((tool) => tool.status === "active").forEach((tool) => {
    [firstSelect, secondSelect].forEach((select) => {
      const option = createElement("option", { text: tool.name, attributes: { value: tool.id } });
      select.append(option);
    });
  });
  const params = new URLSearchParams(window.location.search);
  const activeToolIds = tools.filter((tool) => tool.status === "active").map((tool) => tool.id);
  const requestedFirst = params.get("first");
  const requestedSecond = params.get("second");
  firstSelect.value = activeToolIds.includes(requestedFirst) ? requestedFirst : activeToolIds[0] ?? "";
  secondSelect.value = activeToolIds.includes(requestedSecond) ? requestedSecond : activeToolIds[1] ?? "";

  const render = () => {
    const first = tools.find((tool) => tool.id === firstSelect.value);
    const second = tools.find((tool) => tool.id === secondSelect.value);
    output.replaceChildren();
    if (!first || !second) return;
    if (first.id === second.id) {
      const message = createElement("div", { className: "empty-state" });
      message.append(
        createElement("span", { className: "state-mark", text: "2≠", attributes: { "aria-hidden": "true" } }),
        createElement("h2", { text: "請選擇兩項不同的工具" }),
        createElement("p", { text: "目前兩個欄位選到同一項；請在其中一個選單改選其他工具。" })
      );
      output.append(message);
      output.setAttribute("aria-busy", "false");
      return;
    }
    output.append(createComparisonCard(first, 0), createComparisonCard(second, 1));
    output.setAttribute("aria-busy", "false");
    const nextParams = new URLSearchParams({ first: first.id, second: second.id });
    window.history.replaceState(null, "", `compare.html?${nextParams.toString()}`);
  };

  firstSelect.addEventListener("change", render);
  secondSelect.addEventListener("change", render);
  render();
}
