"use server";

import { z } from "zod";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addComment } from "@/app/lib/db";

// 定义 Zod 校验 Schema
const commentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "姓名至少需要 2 个字符" })
    .max(50, { message: "姓名不能超过 50 个字符" }),
  email: z
    .string()
    .email({ message: "请输入有效的邮箱地址" }),
  message: z
    .string()
    .min(5, { message: "留言内容至少需要 5 个字符" })
    .max(500, { message: "留言内容不能超过 500 个字符" }),
});

export type FormState = {
  success: boolean;
  errors: {
    name?: string[];
    email?: string[];
    message?: string[];
    form?: string[];
  } | null;
  message?: string;
};

/**
 * Server Action: 提交留言板评论
 */
export async function addCommentAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. 获取 Headers 与 Cookies（注意：在 Next.js 15+ / 16 中这俩是异步方法，需 await）
  const headersList = await headers();
  const cookiesList = await cookies();

  // 获取 User-Agent 收集提交留言的客户端环境
  const userAgent = headersList.get("user-agent") || "未知浏览器";

  // 读取限流 Cookie
  const lastSubmitted = cookiesList.get("last_submitted_time")?.value;
  const now = Date.now();
  if (lastSubmitted) {
    const diff = now - parseInt(lastSubmitted, 10);
    if (diff < 10000) {
      const timeLeft = Math.ceil((10000 - diff) / 1000);
      return {
        success: false,
        errors: {
          form: [`提交过于频繁！请等待 ${timeLeft} 秒后再试`],
        },
      };
    }
  }

  // 2. 提取数据
  const rawName = formData.get("name") as string;
  const rawEmail = formData.get("email") as string;
  const rawMessage = formData.get("message") as string;

  // 3. Zod 校验字段
  const validation = commentSchema.safeParse({
    name: rawName,
    email: rawEmail,
    message: rawMessage,
  });

  if (!validation.success) {
    // 校验失败，平滑返回字段级别的错误提示，而非抛出异常
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validation.data;

  // 4. 重定向拦截测试
  // 如果留言内容为 "/admin"，我们在保存之后进行页面重定向
  let shouldRedirect = false;
  if (message.trim() === "/admin") {
    shouldRedirect = true;
  }

  try {
    // 故意增加 1.5 秒延迟，以清晰演示等待状态 (isPending/useFormStatus) 及前端的乐观更新 (useOptimistic)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 保存留言到 mock db
    await addComment({
      name,
      email,
      message,
      userAgent,
    });

    // 写入 Cookie 来设置 10 秒的提控频率限制 (仅演示写入 cookie)
    cookiesList.set("last_submitted_time", Date.now().toString(), {
      maxAge: 10, // 10秒有效期
      httpOnly: true,
      path: "/",
    });
  } catch (error) {
    console.error("数据库写入失败:", error);
    return {
      success: false,
      errors: {
        form: ["服务器保存留言失败，请稍后重试"],
      },
    };
  }

  // 5. 触发对应页面的再验证（失效缓存），确保客户端在页面重新加载时获取最新数据
  revalidatePath("/");

  // 6. 执行重定向 (必须放在 try...catch 外，因为 redirect 内部基于抛出特殊的路由跳转 Error 运行)
  if (shouldRedirect) {
    redirect("/admin");
  }

  return {
    success: true,
    errors: null,
    message: "留言发布成功！",
  };
}
