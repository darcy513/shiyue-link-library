export type SourceType = "wechat" | "xiaohongshu" | "web" | "video";

export type LibraryItem = {
  id: string;
  source: SourceType;
  title: string;
  excerpt: string;
  tags: string[];
  collection: string;
  author: string;
  addedAt: string;
  readTime: number;
  image: string;
  accent: string;
};

export const sourceLabels: Record<SourceType, string> = {
  wechat: "公众号",
  xiaohongshu: "小红书",
  web: "网页",
  video: "视频",
};

export function getSourceLabel(source: SourceType) {
  return sourceLabels[source];
}

export function filterItems(
  items: LibraryItem[],
  search: string,
  collection: string,
) {
  const tokens = search
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return items.filter((item) => {
    const matchesCollection =
      collection === "全部" || item.collection === collection;
    const haystack = [
      item.title,
      item.excerpt,
      item.collection,
      item.author,
      item.tags.join(" "),
    ]
      .join(" ")
      .toLocaleLowerCase();
    const matchesSearch = tokens.every((token) => haystack.includes(token));
    return matchesCollection && matchesSearch;
  });
}
