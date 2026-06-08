"use server";

import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * 清除带有指定 Tag 的 fetch 缓存
 * 对应演示页面中声明了 next: { tags: ['time-data'] } 的请求
 */
export async function revalidateTimeTag() {
  revalidateTag('time-data', 'default');
  console.log("Server Action: revalidateTag('time-data', 'default') 已执行");
}

/**
 * 清除指定路径下的所有缓存（包括页面渲染缓存与 fetch 缓存）
 * @param path 路由路径，例如 '/demo-on-demand'
 */
export async function revalidateDemoPath(path: string) {
  revalidatePath(path);
  console.log(`Server Action: revalidatePath('${path}') 已执行`);
}
