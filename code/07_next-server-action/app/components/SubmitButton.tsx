"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  // 注意：useFormStatus 必须在 <form> 组件的子代组件中调用，无法在包含 <form> 本身的父级组件中感知状态
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full py-3 px-5 rounded-xl font-medium text-white flex items-center justify-center gap-2 cursor-pointer text-sm"
    >
      {pending ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          正在发布留言...
        </>
      ) : (
        "发布留言"
      )}
    </button>
  );
}
