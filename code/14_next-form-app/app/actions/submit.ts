'use server'; // 告诉 Next.js：这个文件导出的是 Server Action

import { contactFormSchema } from '@/lib/schemas';

export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: Record<string, string>;
}

export async function submitForm(_prevState: FormState, formData: FormData): Promise<FormState> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
  };

  // 使用共享的 Zod Schema 进行服务端二次校验
  const result = contactFormSchema.safeParse(rawData);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: '请检查表单中的错误',
      errors: fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, subject, message } = result.data;

  // Simulate successful submission
  return {
    success: true,
    message: '表单提交成功！我们会尽快与您联系。',
    data: { name, email, subject, message },
  };
}
