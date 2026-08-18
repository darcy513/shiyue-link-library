import {
  ArrowDownUp,
  ArrowUpRight,
  Bell,
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  FileText,
  FolderHeart,
  Grid2X2,
  Inbox,
  Link2,
  ListFilter,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  Tag,
  Trash2,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  filterItems,
  getSourceLabel,
  type LibraryItem,
  type SourceType,
} from "./lib/library";
import "./styles.css";

const seedItems: LibraryItem[] = [
  {
    id: "kyoto",
    source: "xiaohongshu",
    title: "京都避开人潮的五个散步路线",
    excerpt:
      "从哲学之道拐进安静小巷，适合春天慢慢走。记得把鸭川日落和一间老喫茶店留给自己。",
    tags: ["京都", "旅行"],
    collection: "关西旅行",
    author: "云边散步",
    addedAt: "今天 09:42",
    readTime: 6,
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
    accent: "#be6246",
  },
  {
    id: "camera",
    source: "wechat",
    title: "2026 随身相机横向对比",
    excerpt:
      "画质、重量、续航和预算的完整比较。真正值得买的，往往不是参数最漂亮的那一台。",
    tags: ["相机", "选购"],
    collection: "购物研究",
    author: "影像手记",
    addedAt: "昨天 22:16",
    readTime: 12,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
    accent: "#3f6757",
  },
  {
    id: "ai",
    source: "web",
    title: "小团队如何建立自己的 AI 工作流",
    excerpt:
      "不是把所有事情都交给模型，而是把重复、等待和来回确认的部分交出去。",
    tags: ["AI", "工作流"],
    collection: "工作方法",
    author: "少数派",
    addedAt: "周一 18:03",
    readTime: 8,
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=85",
    accent: "#c88a2f",
  },
  {
    id: "home",
    source: "xiaohongshu",
    title: "租房也能拥有的 8 个收纳瞬间",
    excerpt:
      "不打孔、不定制、不牺牲采光，让每天回家都顺手一点。",
    tags: ["家居", "收纳"],
    collection: "生活灵感",
    author: "住进春天里",
    addedAt: "周日 11:27",
    readTime: 5,
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
    accent: "#997358",
  },
  {
    id: "podcast",
    source: "video",
    title: "把一周过得像一个小项目",
    excerpt:
      "来自一段播客的 17 分钟精华：先定义想留下的东西，再安排要做的事。",
    tags: ["效率", "播客"],
    collection: "工作方法",
    author: "得到",
    addedAt: "周六 16:50",
    readTime: 17,
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=85",
    accent: "#7b6654",
  },
];

const collections = [
  { name: "全部", count: 38, icon: Inbox },
  { name: "收件箱", count: 8, icon: Inbox },
  { name: "关西旅行", count: 6, icon: FolderHeart },
  { name: "购物研究", count: 9, icon: Tag },
  { name: "工作方法", count: 11, icon: Zap },
  { name: "生活灵感", count: 4, icon: Sparkles },
];

const sourceFilters: Array<{ label: string; value: "all" | SourceType }> = [
  { label: "全部来源", value: "all" },
  { label: "公众号", value: "wechat" },
  { label: "小红书", value: "xiaohongshu" },
  { label: "网页", value: "web" },
];

const highlights = [
  "收藏只是入口，真正有价值的是下次想起它时，已经变成了你的答案。",
  "自动识别：来源、主题、关键人物、可执行建议。",
  "适合把多篇内容放在一起，直接生成一份有结构的结果。",
];

function App() {
  const [items, setItems] = useState(seedItems);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [collection, setCollection] = useState("全部");
  const [sourceFilter, setSourceFilter] = useState<"all" | SourceType>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>(["kyoto", "camera"]);
  const [activeNav, setActiveNav] = useState("收藏");
  const [showAdd, setShowAdd] = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRule, setShowRule] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [toast, setToast] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeItemId, setActiveItemId] = useState("kyoto");

  const filteredItems = useMemo(() => {
    const inCollection = filterItems(items, deferredSearch, collection);
    return sourceFilter === "all"
      ? inCollection
      : inCollection.filter((item) => item.source === sourceFilter);
  }, [collection, deferredSearch, items, sourceFilter]);

  const activeItem =
    items.find((item) => item.id === activeItemId) ?? filteredItems[0];
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setShowAdd(true);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (filteredItems.length && !filteredItems.some((item) => item.id === activeItemId)) {
      setActiveItemId(filteredItems[0].id);
    }
  }, [activeItemId, filteredItems]);

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  }

  function handleAdd(url: string) {
    setShowAdd(false);
    setIsAnalyzing(true);
    window.setTimeout(() => {
      const nextItem: LibraryItem = {
        id: `new-${Date.now()}`,
        source: url.includes("xiaohongshu") ? "xiaohongshu" : "web",
        title: "一篇刚刚读完的灵感文章",
        excerpt: "拾页已从链接中提取出主题、重点和可执行信息，等你下次需要时再找到它。",
        tags: ["待整理", "新收藏"],
        collection: "收件箱",
        author: "刚刚导入",
        addedAt: "刚刚",
        readTime: 4,
        image:
          "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=85",
        accent: "#b95844",
      };
      setItems((current) => [nextItem, ...current]);
      setActiveItemId(nextItem.id);
      setIsAnalyzing(false);
      setToast("已导入并完成初步提炼");
    }, 1500);
  }

  function handleNavChange(label: string) {
    setActiveNav(label);
    if (label !== "收藏") {
      setToast(`${label} 视图正在准备中，先在收藏里继续探索`);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <span />
            <span />
            <span />
          </div>
          <div>
            <div className="brand-name">拾页</div>
            <div className="brand-subtitle">SHIYUE LIBRARY</div>
          </div>
        </div>

        <button className="import-button" onClick={() => setShowAdd(true)}>
          <Plus size={18} strokeWidth={2.4} />
          <span>收进一页</span>
          <span className="shortcut">⌘ K</span>
        </button>

        <div className="sidebar-section">
          <div className="sidebar-label">工作台</div>
          {[
            { label: "收藏", icon: Bookmark },
            { label: "合成台", icon: WandSparkles },
            { label: "阅读记录", icon: Clock3 },
          ].map(({ label, icon: Icon }) => (
            <button
              className={`nav-item ${activeNav === label ? "active" : ""}`}
              key={label}
              onClick={() => handleNavChange(label)}
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === "收藏" && <span className="nav-count">38</span>}
              {label === "合成台" && <span className="nav-dot" />}
            </button>
          ))}
        </div>

        <div className="sidebar-section collections-section">
          <div className="sidebar-label">
            <span>我的分类</span>
            <button className="icon-button tiny" aria-label="添加分类">
              <Plus size={15} />
            </button>
          </div>
          {collections.slice(1).map(({ name, count, icon: Icon }) => (
            <button
              className={`nav-item ${collection === name ? "active" : ""}`}
              key={name}
              onClick={() => {
                setCollection(name);
                setActiveNav("收藏");
              }}
            >
              <Icon size={16} />
              <span>{name}</span>
              <span className="nav-count">{count}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sync-status">
            <span className="status-orb" />
            <span>AI 已就绪</span>
            <span className="sync-time">刚刚同步</span>
          </div>
          <button className="nav-item" onClick={() => setShowRule(true)}>
            <Settings2 size={17} />
            <span>整理规则</span>
          </button>
          <button className="nav-item" onClick={() => setToast("帮助中心稍后开放")}>
            <CircleHelp size={17} />
            <span>需要帮忙？</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>我的资料库</span>
            <ChevronDown size={14} />
          </div>
          <div className="topbar-actions">
            <button
              className="top-action notification-trigger"
              aria-label="通知"
              onClick={() => setShowNotifications((value) => !value)}
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <div className="avatar">Y</div>
          </div>
          {showNotifications && (
            <div className="notification-popover">
              <div className="popover-heading">
                <span>最近动态</span>
                <span className="muted">2 条</span>
              </div>
              <div className="notification-line">
                <span className="notification-icon"><Sparkles size={13} /></span>
                <span>AI 已完成「相机选购」的重点提炼</span>
              </div>
              <div className="notification-line">
                <span className="notification-icon green"><Check size={13} /></span>
                <span>你的「工作方法」规则刚刚运行</span>
              </div>
            </div>
          )}
        </header>

        <section className="workspace-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              TUESDAY · AUG 18
            </div>
            <h1>收藏，不止于收藏。</h1>
            <p className="heading-note">
              你最近存下的内容，已经被读过、提炼过，也正在变得更容易找到。
            </p>
          </div>
          <div className="heading-stat">
            <span className="stat-value">38</span>
            <span className="stat-label">篇有用内容</span>
            <span className="stat-trend">↑ 6 本周新增</span>
          </div>
        </section>

        <section className="search-row">
          <div className="search-field">
            <Search size={19} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="想起一点点，也能找回来……"
              aria-label="搜索收藏"
            />
            <span className="search-shortcut"><Command size={12} /> K</span>
          </div>
          <button
            className={`filter-button ${showMoreFilters ? "is-active" : ""}`}
            onClick={() => setShowMoreFilters((value) => !value)}
          >
            <ListFilter size={17} />
            筛选
            <span className="filter-count">{sourceFilter !== "all" ? 1 : 0}</span>
          </button>
          <button className="sort-button" onClick={() => setToast("已按最近收藏排序")}>
            <ArrowDownUp size={16} />
            最近收藏
          </button>
        </section>

        {showMoreFilters && (
          <div className="filter-drawer">
            <div className="filter-drawer-label">来源</div>
            <div className="filter-options">
              {sourceFilters.map(({ label, value }) => (
                <button
                  key={value}
                  className={`filter-pill ${sourceFilter === value ? "selected" : ""}`}
                  onClick={() => setSourceFilter(value)}
                >
                  {sourceFilter === value && <Check size={13} />}
                  {label}
                </button>
              ))}
            </div>
            <button className="clear-filter" onClick={() => setSourceFilter("all")}>清除</button>
          </div>
        )}

        <div className="content-grid">
          <section className="library-column">
            <div className="section-toolbar">
              <div className="tabs">
                {collections.slice(0, 2).map(({ name, count }) => (
                  <button
                    className={`tab ${collection === name ? "active" : ""}`}
                    key={name}
                    onClick={() => setCollection(name)}
                  >
                    {name}
                    <span>{count}</span>
                  </button>
                ))}
              </div>
              <button className="view-toggle" aria-label="切换视图" onClick={() => setToast("已切换到列表视图")}>
                <Grid2X2 size={17} />
              </button>
            </div>

            {isAnalyzing && (
              <div className="import-progress">
                <div className="progress-spinner"><Sparkles size={17} /></div>
                <div>
                  <strong>正在读这条链接</strong>
                  <span>识别来源 · 提取重点 · 匹配分类</span>
                </div>
                <div className="progress-pulse" />
              </div>
            )}

            <div className="library-list">
              {filteredItems.map((item, index) => (
                <article
                  className={`library-item ${activeItem?.id === item.id ? "selected" : ""}`}
                  key={item.id}
                  style={{ animationDelay: `${index * 70}ms` }}
                  onClick={() => setActiveItemId(item.id)}
                >
                  <button
                    className={`selection-box ${selectedIds.includes(item.id) ? "checked" : ""}`}
                    aria-label={`选择${item.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleSelected(item.id);
                    }}
                  >
                    {selectedIds.includes(item.id) && <Check size={13} />}
                  </button>
                  <div className="item-thumb" style={{ backgroundImage: `url(${item.image})` }}>
                    <span className="source-stamp">{getSourceLabel(item.source)}</span>
                  </div>
                  <div className="item-copy">
                    <div className="item-meta">
                      <span className="meta-source">{getSourceLabel(item.source)}</span>
                      <span className="meta-divider">·</span>
                      <span>{item.addedAt}</span>
                      <span className="meta-divider">·</span>
                      <span>{item.readTime} min read</span>
                    </div>
                    <h2>{item.title}</h2>
                    <p>{item.excerpt}</p>
                    <div className="item-tags">
                      {item.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                    </div>
                  </div>
                  <button className="item-more" aria-label="更多操作" onClick={(event) => {
                    event.stopPropagation();
                    setToast("更多操作菜单稍后开放");
                  }}>
                    <MoreHorizontal size={18} />
                  </button>
                </article>
              ))}
              {!filteredItems.length && (
                <div className="empty-state">
                  <div className="empty-icon"><Search size={22} /></div>
                  <strong>还没找到这篇</strong>
                  <p>换一个模糊的关键词，或者把它再分享给拾页一次。</p>
                </div>
              )}
            </div>
            <div className="list-footer">
              <span>显示 {filteredItems.length} / {items.length} 篇</span>
              <button onClick={() => setToast("已经到底啦")}>查看更多 <ArrowUpRight size={14} /></button>
            </div>
          </section>

          <aside className="insight-column">
            <div className="insight-header">
              <div className="insight-title">
                <div className="ai-orb"><Sparkles size={16} /></div>
                <div>
                  <span>AI 摘要</span>
                  <small>随手问，随时用</small>
                </div>
              </div>
              <button className="icon-button" aria-label="关闭摘要" onClick={() => setToast("摘要面板会一直为你保留")}>
                <MoreHorizontal size={18} />
              </button>
            </div>

            {activeItem ? (
              <>
                <div className="insight-cover" style={{ backgroundImage: `url(${activeItem.image})` }}>
                  <div className="cover-overlay">
                    <span>{getSourceLabel(activeItem.source)}</span>
                    <button onClick={() => setToast("已在新窗口打开原文")} aria-label="打开原文">
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                </div>
                <div className="insight-body">
                  <div className="insight-kicker">这篇在说什么</div>
                  <h3>{activeItem.title}</h3>
                  <p className="summary-text">
                    这篇内容围绕「{activeItem.tags[0]}」展开，核心不是堆砌信息，而是帮你更快做出下一步决定。读完可以带走三个判断：先明确目标，再比较成本，最后留下一个真正愿意执行的选项。
                  </p>
                  <div className="highlight-list">
                    {highlights.slice(0, 2).map((highlight) => (
                      <div className="highlight-row" key={highlight}>
                        <span className="highlight-mark">✦</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                  <div className="insight-footer">
                    <span><BookOpen size={15} /> 已读 · {activeItem.readTime} 分钟</span>
                    <button onClick={() => setToast("已标记为重点")}>标记重点</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="insight-empty">选择一篇收藏，看看拾页为你提炼了什么。</div>
            )}

            <div className="ask-box">
              <div className="ask-icon"><MessageCircle size={16} /></div>
              <input placeholder="问问这篇，或者让它做点什么……" aria-label="询问 AI" />
              <button onClick={() => setToast("已生成一份新的提炼")}>
                <Send size={15} />
              </button>
            </div>
          </aside>
        </div>

        <div className="synthesis-bar">
          <div className="synthesis-selection">
            <div className="selection-stack">
              {selectedItems.slice(0, 3).map((item, index) => (
                <span key={item.id} className="stack-avatar" style={{ zIndex: 3 - index, backgroundImage: `url(${item.image})` }} />
              ))}
              {selectedItems.length > 3 && <span className="stack-more">+{selectedItems.length - 3}</span>}
            </div>
            <div>
              <strong>{selectedItems.length ? `已选 ${selectedItems.length} 篇` : "还没有选择内容"}</strong>
              <span>{selectedItems.length ? "可以把它们放在一起比较、汇总" : "勾选几篇收藏，开始一次合成"}</span>
            </div>
          </div>
          <button
            className="synthesis-button"
            disabled={selectedItems.length === 0}
            onClick={() => setShowSynthesis(true)}
          >
            <WandSparkles size={17} />
            开始合成
            <ArrowUpRight size={16} />
          </button>
        </div>
      </main>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSubmit={handleAdd} />}
      {showSynthesis && (
        <SynthesisModal items={selectedItems} onClose={() => setShowSynthesis(false)} onToast={setToast} />
      )}
      {showRule && <RuleModal onClose={() => setShowRule(false)} onToast={setToast} />}
      {toast && <div className="toast"><Check size={15} />{toast}</div>}
    </div>
  );
}

function AddModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (url: string) => void }) {
  const [url, setUrl] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(url || "https://example.com/article");
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal add-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        <div className="modal-eyebrow"><Link2 size={14} /> QUICK CAPTURE</div>
        <h2>把下一篇好内容交给拾页</h2>
        <p>支持微信文章、小红书、网页、视频链接。粘贴后，它会自己读完。</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="capture-url">链接地址</label>
          <div className="url-input">
            <Link2 size={17} />
            <input
              id="capture-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://…"
              autoFocus
            />
          </div>
          <div className="modal-hint"><Sparkles size={14} /> AI 会自动识别来源、主题和适合的分类</div>
          <button className="modal-primary" type="submit">导入并提炼 <ArrowUpRight size={16} /></button>
        </form>
      </div>
    </div>
  );
}

function SynthesisModal({
  items,
  onClose,
  onToast,
}: {
  items: LibraryItem[];
  onClose: () => void;
  onToast: (message: string) => void;
}) {
  const [mode, setMode] = useState("旅行攻略");
  const modes = ["旅行攻略", "选购对比", "周报素材", "内容选题"];
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal synthesis-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        <div className="modal-eyebrow"><WandSparkles size={14} /> SYNTHESIS DESK</div>
        <h2>让 {items.length} 篇收藏彼此对话</h2>
        <p>选择一个结果方向，拾页会先把共同点、差异和可执行建议放在一起。</p>
        <div className="mode-grid">
          {modes.map((option) => (
            <button key={option} className={`mode-option ${mode === option ? "active" : ""}`} onClick={() => setMode(option)}>
              <span>{option}</span>
              {mode === option && <Check size={15} />}
            </button>
          ))}
        </div>
        <div className="source-summary">
          <span>本次合成</span>
          <div className="source-summary-list">
            {items.map((item) => <span key={item.id}><span className="mini-dot" style={{ background: item.accent }} />{item.title}</span>)}
          </div>
        </div>
        <button className="modal-primary" onClick={() => { onClose(); onToast(`已生成一份「${mode}」`); }}>
          <Sparkles size={16} />生成 {mode}
        </button>
      </div>
    </div>
  );
}

function RuleModal({ onClose, onToast }: { onClose: () => void; onToast: (message: string) => void }) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal rule-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        <div className="modal-eyebrow"><Settings2 size={14} /> YOUR RULES</div>
        <h2>让整理，按你的习惯发生</h2>
        <p>规则会在新内容导入后自动运行。你随时可以调整，不需要重新整理历史收藏。</p>
        <div className="rule-row">
          <div className="rule-icon"><Tag size={16} /></div>
          <div><strong>看到「旅行」就归入关西旅行</strong><span>识别标题和正文里的目的地、路线、餐厅</span></div>
          <button className={`switch ${enabled ? "on" : ""}`} onClick={() => setEnabled((value) => !value)} aria-label="切换规则"><span /></button>
        </div>
        <div className="rule-row">
          <div className="rule-icon warm"><FileText size={16} /></div>
          <div><strong>长文自动生成 3 行摘要</strong><span>适合周报、会议准备和快速复习</span></div>
          <button className="switch on" aria-label="长文摘要已开启"><span /></button>
        </div>
        <button className="modal-primary" onClick={() => { onClose(); onToast("整理规则已更新"); }}>保存规则</button>
      </div>
    </div>
  );
}

export default App;
