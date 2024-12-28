'use client'

interface Message {
    role: string
    content: string
    timestamp: string
}

interface ChatHistoryProps {
    messages: Message[]
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
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
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'}
            `}>
                            <div className="whitespace-pre-wrap">{message.content}</div>
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
