import { includesQuery } from "./search.js";

export function filterTools(tools, filters) {
  return tools.filter((tool) => {
    const searchable = [
      tool.name,
      tool.tagline,
      tool.summary,
      ...tool.categories,
      ...tool.useCases,
      ...tool.audiences,
      ...tool.keywords
    ];
    const matchesSearch = includesQuery(searchable, filters.query);
    const matchesCategory = !filters.category || tool.categories.includes(filters.category);
    const matchesLevel = !filters.level || tool.skillLevel === filters.level;
    return tool.status === "active" && matchesSearch && matchesCategory && matchesLevel;
  });
}

export function filterPrompts(prompts, filters) {
  return prompts.filter((prompt) => {
    const searchable = [prompt.title, prompt.summary, prompt.category, ...prompt.tags, prompt.goal];
    const matchesSearch = includesQuery(searchable, filters.query);
    const matchesCategory = !filters.category || prompt.category === filters.category;
    const matchesDifficulty = !filters.difficulty || prompt.difficulty === filters.difficulty;
    return prompt.status === "published" && matchesSearch && matchesCategory && matchesDifficulty;
  });
}
