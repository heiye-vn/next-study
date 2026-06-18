import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, '请输入姓名')
    .min(2, '姓名至少需要 2 个字符'),
  email: z
    .string()
    .min(1, '请输入邮箱')
    .email('请输入有效的邮箱地址'),
  subject: z
    .string()
    .min(1, '请选择主题'),
  message: z
    .string()
    .min(1, '请输入留言内容')
    .min(10, '留言至少需要 10 个字符'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
