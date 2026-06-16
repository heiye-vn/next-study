import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Instrument_Serif, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import CopyButton from '@/app/guide/CopyButton';

const serif = Instrument_Serif({ weight: '400', subsets: ['latin'] });
const body = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
});
const mono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
});

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ id, children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
      <h2
        id={id}
        data-section
        className={`${serif.className} mt-20 mb-6 scroll-mt-24 text-[30px] font-normal tracking-tight text-stone-900`}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ id, children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
      <h3
        id={id}
        data-section
        className={`${serif.className} mt-14 mb-4 scroll-mt-24 text-[22px] font-normal tracking-tight text-stone-800`}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: ComponentPropsWithoutRef<'h4'>) => (
      <h4
        className="mt-8 mb-3 text-[15px] font-semibold tracking-wide text-stone-700 uppercase"
        {...props}
      >
        {children}
      </h4>
    ),
    p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
      <p
        className="mb-4 leading-[1.85] text-stone-600"
        {...props}
      >
        {children}
      </p>
    ),
    ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
      <ol
        className="mb-6 ml-1 list-inside list-decimal space-y-2 leading-[1.85] text-stone-600"
        {...props}
      >
        {children}
      </ol>
    ),
    ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
      <ul
        className="mb-6 ml-1 list-inside list-disc space-y-2 leading-[1.85] text-stone-600"
        {...props}
      >
        {children}
      </ul>
    ),
    li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => (
      <li
        className="leading-[1.85]"
        {...props}
      >
        {children}
      </li>
    ),
    code: ({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) => {
      // 区分 rehype-pretty-code 生成的代码块内部 of code 与行内 code
      const isInline = !className && !(props as any)['data-language'];
      if (isInline) {
        return (
          <code
            className={`${mono.className} rounded bg-stone-100 px-1.5 py-0.5 text-[13px] text-[#b45309]`}
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code
          className={className}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children, className, ...props }: ComponentPropsWithoutRef<'pre'>) => {
      const lang = (props as any)['data-language'] || '';
      return (
        <pre
          className={`${mono.className} group relative my-5 overflow-x-auto rounded-xl border border-[#1e293b] bg-[#0f172a] p-5 text-[13px] leading-[1.75] text-[#e2e8f0] shadow-lg shadow-stone-200/50`}
          {...props}
        >
          {lang && (
            <span className="absolute top-3 right-4 text-[10px] font-medium tracking-widest text-[#475569] uppercase select-none group-hover:opacity-0 transition-opacity duration-200">
              {lang}
            </span>
          )}
          <CopyButton />
          {children}
        </pre>
      );
    },
    // 自定义扩展全局组件
    Tip: ({
      type = 'tip',
      children,
    }: {
      type?: 'tip' | 'warning' | 'important';
      children: ReactNode;
    }) => {
      const styles = {
        tip: 'border-l-emerald-500 bg-emerald-50/70 text-emerald-900',
        warning: 'border-l-rose-500 bg-rose-50/70 text-rose-900',
        important: 'border-l-amber-500 bg-amber-50/70 text-amber-900',
      };
      const labels = { tip: 'TIP', warning: 'WARNING', important: 'IMPORTANT' };
      return (
        <div
          className={`my-6 rounded-r-lg border-l-[3px] px-5 py-4 text-[14px] leading-relaxed ${styles[type]}`}
        >
          <span className="mb-1 block text-[11px] font-semibold tracking-widest uppercase opacity-60">
            {labels[type]}
          </span>
          {children}
        </div>
      );
    },
    Divider: () => <div className="my-16 border-t border-stone-200" />,
    Icode: ({ children }: { children: ReactNode }) => (
      <code
        className={`${mono.className} rounded bg-stone-100 px-1.5 py-0.5 text-[13px] text-[#b45309]`}
      >
        {children}
      </code>
    ),
    table: ({ children, ...props }: ComponentPropsWithoutRef<'table'>) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
        <table
          className="w-full text-[13.5px] leading-[1.7]"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: ComponentPropsWithoutRef<'thead'>) => (
      <thead
        className="border-b border-stone-200 bg-stone-100/80"
        {...props}
      >
        {children}
      </thead>
    ),
    th: ({ children, ...props }: ComponentPropsWithoutRef<'th'>) => (
      <th
        className="px-5 py-3.5 text-left font-semibold text-stone-700"
        {...props}
      >
        {children}
      </th>
    ),
    tbody: ({ children, ...props }: ComponentPropsWithoutRef<'tbody'>) => (
      <tbody
        className="text-stone-600"
        {...props}
      >
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }: ComponentPropsWithoutRef<'tr'>) => (
      <tr
        className="border-b border-stone-100 odd:bg-white even:bg-stone-50/50"
        {...props}
      >
        {children}
      </tr>
    ),
    td: ({ children, ...props }: ComponentPropsWithoutRef<'td'>) => (
      <td
        className="px-5 py-3.5"
        {...props}
      >
        {children}
      </td>
    ),
    ...components,
  };
}
