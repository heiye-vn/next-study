'use server'; // 告诉 Next.js：这个文件导出的是 Server Action

export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: Record<string, string>;
}

export async function submitForm(_prevState: FormState, formData: FormData): Promise<FormState> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  // Server-side validation
  const errors: Record<string, string[]> = {};

  if (!name || name.trim().length < 2) {
    errors.name = errors.name || [];
    errors.name.push('姓名至少需要 2 个字符');
  }

  if (!email) {
    errors.email = errors.email || [];
    errors.email.push('请输入邮箱地址');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = errors.email || [];
    errors.email.push('请输入有效的邮箱地址');
  }

  if (!subject) {
    errors.subject = errors.subject || [];
    errors.subject.push('请选择主题');
  }

  if (!message || message.trim().length < 10) {
    errors.message = errors.message || [];
    errors.message.push('留言至少需要 10 个字符');
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: '请检查表单中的错误',
      errors,
    };
  }

  // Simulate successful submission
  return {
    success: true,
    message: '表单提交成功！我们会尽快与您联系。',
    data: { name, email, subject, message },
  };
}
