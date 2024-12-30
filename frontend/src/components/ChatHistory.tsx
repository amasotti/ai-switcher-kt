'use client';

import { marked, Tokens } from 'marked';
import DOMPurify from 'dompurify';
import { useSession } from '@/contexts/SessionContext';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-csharp';

const renderer = {
  code(token: Tokens.Code): string {
    const { text, lang, escaped } = token;
    if (lang && Prism.languages[lang]) {
      const highlighted = Prism.highlight(text, Prism.languages[lang], lang);
      return `<pre><code class="language-${lang}">${highlighted}</code></pre>`;
    }
    return `<pre><code>${escaped ? text : marked.parseInline(text)}</code></pre>`;
  },
  codespan(token: Tokens.Codespan): string {
    return `<code class="inline-code">${token.text}</code>`;
  },
};

marked.use({ renderer });

export default function ChatHistory() {
  const { currentSessionId, loadSessionMessages } = useSession();
  const messages = currentSessionId
    ? loadSessionMessages(currentSessionId)
    : [];

  const renderMarkdown = (content: string) => {
    const html = marked(content);

    let sanitized: string;
    if (html instanceof Promise) {
      html.then((resolvedHtml) => {
        sanitized = DOMPurify.sanitize(resolvedHtml);
        return { __html: sanitized };
      });
    } else {
      sanitized = DOMPurify.sanitize(html);
      return { __html: sanitized };
    }
  };

  return (
    <div className='flex-1 overflow-y-auto bg-gray-50 p-4'>
      <div className='space-y-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                message.role === 'user' ? 'message-user' : 'message-bot'
              } `}
            >
              <div
                className='prose prose-sm max-w-none whitespace-pre-wrap dark:prose-invert'
                dangerouslySetInnerHTML={renderMarkdown(message.content)}
              />
              <div
                className={`mt-2 text-xs ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'} `}
              >
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
