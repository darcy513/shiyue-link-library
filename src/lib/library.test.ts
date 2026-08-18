import { describe, expect, it } from "vitest";
import { filterItems, getSourceLabel, type LibraryItem } from "./library";

const items: LibraryItem[] = [
  {
    id: "travel",
    source: "xiaohongshu",
    title: "京都避开人潮的五个散步路线",
    excerpt: "从哲学之道拐进安静小巷，适合春天慢慢走。",
    tags: ["京都", "旅行"],
    collection: "关西旅行",
    author: "云边散步",
    addedAt: "今天",
    readTime: 6,
    image: "",
    accent: "#bd5b3b",
  },
  {
    id: "camera",
    source: "wechat",
    title: "2026 随身相机横向对比",
    excerpt: "画质、重量、续航和预算的完整比较。",
    tags: ["相机", "选购"],
    collection: "购物研究",
    author: "影像手记",
    addedAt: "昨天",
    readTime: 12,
    image: "",
    accent: "#355c4d",
  },
];

describe("library filters", () => {
  it("finds content from a fuzzy memory in title, excerpt, tags or collection", () => {
    expect(filterItems(items, "安静 小巷", "全部").map((item) => item.id)).toEqual([
      "travel",
    ]);
    expect(filterItems(items, "关西", "全部").map((item) => item.id)).toEqual([
      "travel",
    ]);
  });

  it("filters by collection while preserving search", () => {
    expect(filterItems(items, "相机", "购物研究").map((item) => item.id)).toEqual([
      "camera",
    ]);
    expect(filterItems(items, "相机", "关西旅行")).toHaveLength(0);
  });

  it("returns readable source labels", () => {
    expect(getSourceLabel("xiaohongshu")).toBe("小红书");
    expect(getSourceLabel("wechat")).toBe("公众号");
  });
});
