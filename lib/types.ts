export type Style = Record<string, string | number>;

export type TextBlock = {
  type: 'text';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  html: string;
  href: string | null;
  icon: { cls: string; text: string } | null;
  style: Style;
};

export type ImageBlock = {
  type: 'image';
  align?: string | null;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  href: string | null;
  ariaLabel?: string | null;
  style: Style;
  imgStyle: Style;
};

export type BannerBlock = {
  type: 'banner';
  image: string | null;
  title: string;
  titleTag: string;
  desc: string;
  href: string;
  animation: string | null;
  ratio: string | null;
  style: Style;
  contentStyle: Style;
  titleStyle: Style;
  descStyle: Style;
};

export type ButtonBlock = {
  type: 'button';
  label: string;
  href: string | null;
  target: string | null;
  variant: string | null;
  icon: string | null;
  style: Style;
};

export type SeparatorBlock = {
  type: 'separator';
  size: string;
  align: string;
  color: string | null;
  thick: string | null;
  width: string | null;
  withLine: boolean;
  style: Style;
};

export type CounterBlock = {
  type: 'counter';
  parts: { kind: 'text' | 'number'; value: string }[];
  title: string;
  titleTag: string;
  style: Style;
  valueStyle: Style;
};

export type GridItem = {
  id: string | null;
  href: string | null;
  title: string | null;
  image: string | null;
  imageAlt: string;
  date: string | null;
  excerpt: string | null;
};

export type GridBlock = {
  type: 'grid';
  layout: string | null;
  cols: number;
  gap: string | null;
  items: GridItem[];
  style: Style;
};

export type SliderBlock = {
  type: 'slider';
  items: { image: string | null; href: string; title: string }[];
  style: Style;
};

export type CarouselBlock = {
  type: 'carousel';
  items: { image: string | null; width?: number | null; height?: number | null; alt?: string }[];
  gutter: number;
  style: Style;
};

export type RowBlock = {
  type: 'row';
  row: Row;
  style: Style;
};

export type WrapperBlock = {
  type: 'wrapper';
  kind: 'v' | 'h';
  align: string | null;
  valign: string | null;
  style: Style;
  blocks: Block[];
};

export type RichTextBlock = { type: 'richtext'; html: string; style: Style };
export type HtmlBlock = { type: 'html'; html: string; style: Style };
export type CommentsBlock = { type: 'comments' };

export type Block =
  | TextBlock
  | ImageBlock
  | BannerBlock
  | ButtonBlock
  | SeparatorBlock
  | CounterBlock
  | GridBlock
  | SliderBlock
  | RowBlock
  | CarouselBlock
  | WrapperBlock
  | RichTextBlock
  | HtmlBlock
  | CommentsBlock;

export type Column = {
  style: Style;
  innerStyle: Style;
  stretched: boolean;
  hasScrollEffects: boolean;
  blocks: Block[];
};

export type Row = {
  id: string;
  cols: number;
  template?: string;
  boxes?: boolean;
  gap: string | null;
  style: Style;
  columns: Column[];
};

export type Section = {
  id: string;
  fullWidth: boolean;
  fullHeight?: boolean;
  valignCenter?: boolean;
  height: string;
  style: Style;
  innerStyle: Style;
  overlay: Style | null;
  backgroundImage: string | null;
  rows: Row[];
  rich: string | null;
};

export type PageHeader = {
  variant: 'light' | 'dark';
  fixed: boolean;
  bg: string;
  color: string;
  logo: string;
};

export type PageModel = {
  kind: 'page' | 'post' | 'category' | 'tag' | 'author';
  header?: PageHeader | null;
  headerHeight?: string | null;
  stickyHeight?: string | null;
  logoHeight?: string | null;
  id: number;
  path: string;
  title: string;
  meta: {
    title?: string | null;
    canonical?: string | null;
    description?: string | null;
    ogImage?: string | null;
    robots?: string | null;
  };
  sections: Section[];
  footer: Section[];
  bodyClass: string;
  excerpt: string | null;
  date: string | null;
  modified: string | null;
  categories: number[];
  tags: number[];
  authorId: number | null;
};

export type NavItem = { title: string; href: string; isCurrent: boolean };
export type SiteNav = {
  menus: { id: string; items: NavItem[] }[];
  logo: { src: string; width: number; height: number; href: string } | null;
};

export type Taxonomy = {
  categories: { id: number; slug: string; name: string; count: number; path: string }[];
  tags: { id: number; slug: string; name: string; count: number; path: string }[];
  authors: { slug: string; name: string; path: string }[];
};
