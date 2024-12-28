'use client'

import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface Message {
    role: string
    content: string
    timestamp: string
}

interface ChatHistoryProps {
    messages: Message[]
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
    const renderMarkdown = (content: string) => {
        const html = marked(content)

        let sanitized : string;
        if (html instanceof Promise) {
            html.then((resolvedHtml) => {
                sanitized = DOMPurify.sanitize(resolvedHtml)
                return { __html: sanitized }
            })

        } else {
            sanitized = DOMPurify.sanitize(html)
            return { __html: sanitized }
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
              max-w-[70%] rounded-lg p-4
              ${message.role === 'user'
                            ? 'message-user'
                            : 'message-bot'}
            `}>
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap"
                                dangerouslySetInnerHTML={renderMarkdown(message.content)}
                            />
                            <div className={`
                text-xs mt-2
                ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}
              `}>
                                {message.timestamp}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
