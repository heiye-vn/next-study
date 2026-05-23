import { NextRequest } from "next/server";
import { convertToModelMessages, streamText } from 'ai'
import { createDeepSeek } from "@ai-sdk/deepseek";

const deepSeek = createDeepSeek({
    apiKey: 'sk-xxxxxxxxxxxxx'
})

export async function POST(req: NextRequest) {
    const { messages } = await req.json()

    // 转换为大模型消息
    const modelMessages = await convertToModelMessages(messages)
    const result = streamText({
        model: deepSeek('deepseek-v4-pro'),
        messages: modelMessages, 
        system: '你是一个高级程序员，请根据用户的问题给出回答', // 系统提示词
    })

    return result.toUIMessageStreamResponse() // 返回流式响应
}