"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { useEffect } from "react";

/**
 * SystemThemeSync — 显式监听系统主题变化，
 * 当用户选择"跟随系统"时强制同步，解决部分浏览器
 * (尤其是 Windows Chrome) 对 prefers-color-scheme 变化
 * 响应不及时的问题。
 */
function SystemThemeSync() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    // 核心同步逻辑：检测系统偏好并强制 next-themes 刷新
    const syncWithSystem = () => {
      if (theme === "system") {
        const newSystem = media.matches ? "dark" : "light";
        if (newSystem !== resolvedTheme) {
          setTheme(newSystem);
          setTimeout(() => setTheme("system"), 50);
        }
      }
    };

    // 监听 media query 本身的 change 事件
    media.addEventListener("change", syncWithSystem);

    // 当标签页重新可见时（用户从设置页面切回浏览器）也检查一次
    const handleVisibility = () => {
      if (!document.hidden) {
        syncWithSystem();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 窗口获得焦点时也检查（覆盖更多边界情况）
    const handleFocus = () => syncWithSystem();
    window.addEventListener("focus", handleFocus);

    return () => {
      media.removeEventListener("change", syncWithSystem);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [theme, resolvedTheme, setTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <SystemThemeSync />
    </NextThemesProvider>
  );
}
