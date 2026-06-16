'use client';

import { useState } from 'react';

export default function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const pre = e.currentTarget.parentElement;
    if (!pre) return;

    const code = pre.querySelector('code');
    // 如果有 code 标签，提取其内容；否则提取 pre 的内容
    let text = code ? code.innerText : pre.innerText;

    // 清理可能误复制的右上角语言文本或复制按钮自身的文本
    // 很多时候 innerText 会包含 pre 下所有子节点的文字
    // 为防止复制到“TS”或“复制”，我们可以克隆 code 节点在内存里处理，或者只复制 code 的文本内容
    // 如果 code 存在且我们只取 code 的 textContent，它是最安全的
    if (code) {
      text = code.textContent || '';
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2.5 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded bg-[#1e293b]/80 border border-[#334155]/60 hover:bg-[#334155] px-2 py-0.75 text-[11px] font-medium text-[#94a3b8] hover:text-[#e2e8f0] cursor-pointer shadow-sm z-10"
      title="复制段落代码"
    >
      {copied ? '已复制！' : '复制'}
    </button>
  );
}
