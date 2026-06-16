'use client';

import { useEffect, useState } from 'react';

interface TocSubItem {
  id: string;
  label: string;
}

interface TocItem {
  id: string;
  label: string;
  num: string;
  children?: TocSubItem[];
}

const tocData: TocItem[] = [
  {
    id: 'sec-0',
    label: '配置文件基础',
    num: '0',
    children: [
      { id: 'sec-0-1', label: '文件格式' },
      { id: 'sec-0-2', label: '基础写法' },
    ],
  },
  {
    id: 'sec-1',
    label: '路由与请求',
    num: '1',
    children: [
      { id: 'sec-1-1', label: '自定义响应头' },
      { id: 'sec-1-2', label: '路由重定向' },
      { id: 'sec-1-3', label: '路由重写与代理' },
      { id: 'sec-1-4', label: '条件匹配限制' },
    ],
  },
  {
    id: 'sec-2',
    label: '工程构建',
    num: '2',
    children: [
      { id: 'sec-2-1', label: '外部包排除' },
      { id: 'sec-2-2', label: '本地包转译' },
      { id: 'sec-2-3', label: '导入优化' },
      { id: 'sec-2-4', label: 'Webpack 配置' },
      { id: 'sec-2-5', label: '编译质量' },
    ],
  },
  {
    id: 'sec-3',
    label: '图像优化',
    num: '3',
    children: [
      { id: 'sec-3-1', label: '外部域名匹配' },
      { id: 'sec-3-2', label: 'sharp 加速器' },
    ],
  },
  {
    id: 'sec-4',
    label: '缓存与部署',
    num: '4',
    children: [
      { id: 'sec-4-1', label: '缓存处理器' },
      { id: 'sec-4-2', label: '缓存组件' },
      { id: 'sec-4-3', label: 'Standalone 部署' },
    ],
  },
  {
    id: 'sec-5',
    label: '网络与路径',
    num: '5',
    children: [
      { id: 'sec-5-1', label: '资源与路径前缀' },
      { id: 'sec-5-2', label: '工程控制项' },
    ],
  },
  {
    id: 'sec-6',
    label: '开发调试',
    num: '6',
    children: [
      { id: 'sec-6-1', label: '开发日志' },
      { id: 'sec-6-2', label: '开发指示器' },
      { id: 'sec-6-3', label: '性能归因' },
    ],
  },
  { id: 'sec-7', label: '版本演进', num: '7' },
  { id: 'sec-refs', label: '参考链接', num: '' },
];

export default function GuideToc() {
  const [activeId, setActiveId] = useState('sec-0');

  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>('[data-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-60px 0px -75% 0px', threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="scrollbar-thin sticky top-0 h-screen overflow-y-auto py-12 pr-4 pl-2 text-[13px] leading-relaxed">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-5 w-0.75 rounded-full bg-amber-600" />
        <span className="font-serif text-[15px] font-semibold tracking-tight text-stone-900">
          目录导航
        </span>
      </div>
      <ul className="space-y-0.5">
        {tocData.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`flex items-baseline gap-2 rounded-md px-2.5 py-1.5 transition-all duration-200 ${
                activeId === item.id
                  ? 'bg-amber-50 font-medium text-amber-800'
                  : 'text-stone-400 hover:bg-stone-50 hover:text-stone-700'
              }`}
            >
              {item.num && (
                <span className="shrink-0 font-mono text-[10px] tabular-nums opacity-50">
                  {String(item.num).padStart(2, '0')}
                </span>
              )}
              <span className="truncate">{item.label}</span>
            </a>
            {item.children && (
              <ul className="mt-0.5 mb-1 ml-6.5 space-y-0.5 border-l border-stone-100 pl-2">
                {item.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      className={`block rounded-md px-2 py-1 text-[12px] transition-all duration-200 ${
                        activeId === child.id
                          ? 'bg-amber-50/60 font-medium text-amber-700'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
