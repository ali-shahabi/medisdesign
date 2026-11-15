import 'server-only';

import type { GridItem, PageModel, SiteNav, Section, Taxonomy } from './types';
import siteJson from '@/data/site.json';
import pagesJson from '@/data/pages.json';
import postsJson from '@/data/posts.json';
import archivesJson from '@/data/archives.json';
import extrasJson from '@/data/extras.json';

export const site = siteJson as unknown as { nav: SiteNav };
export const pages = [...(pagesJson as unknown as PageModel[]), ...(extrasJson as unknown as PageModel[])];
export const posts = postsJson as unknown as PageModel[];

export type ArchiveModel = {
  kind: 'category' | 'tag' | 'author';
  header?: import('./types').PageHeader | null;
  headerHeight?: string | null;
  logoHeight?: string | null;
  path: string;
  title: string;
  meta: PageModel['meta'];
  items: GridItem[];
  sections: Section[];
  footer: Section[];
};

export const archives = archivesJson as unknown as ArchiveModel[];

/** normalize a path for lookups: decoded, no leading/trailing slash noise */
export function normPath(p: string): string {
  let out = p;
  try {
    out = decodeURIComponent(p);
  } catch {
    /* keep raw */
  }
  if (!out.startsWith('/')) out = '/' + out;
  out = out.replace(/\/+$/, '');
  return out === '' ? '/' : out;
}

const pageByPath = new Map<string, PageModel>();
for (const p of pages) pageByPath.set(normPath(p.path), p);
const postByPath = new Map<string, PageModel>();
for (const p of posts) postByPath.set(normPath(p.path), p);
const archiveByPath = new Map<string, ArchiveModel>();
for (const a of archives) archiveByPath.set(normPath(a.path), a);

export function getPage(path: string): PageModel | undefined {
  return pageByPath.get(normPath(path));
}
export function getPost(path: string): PageModel | undefined {
  return postByPath.get(normPath(path));
}
export function getArchive(path: string): ArchiveModel | undefined {
  return archiveByPath.get(normPath(path));
}
export function getContent(path: string): PageModel | ArchiveModel | undefined {
  return pageByPath.get(normPath(path)) ?? postByPath.get(normPath(path)) ?? archiveByPath.get(normPath(path));
}

export const homePage = pageByPath.get('/')!;

export const allContentPaths = [...new Set([...pageByPath.keys(), ...postByPath.keys(), ...archiveByPath.keys()])];

export function excerptOf(p: PageModel, max = 200): string {
  if (!p.excerpt) return '';
  const text = p.excerpt.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export function isArchive(x: PageModel | ArchiveModel): x is ArchiveModel {
  return (x as ArchiveModel).kind === 'category' || (x as ArchiveModel).kind === 'tag' || (x as ArchiveModel).kind === 'author';
}
