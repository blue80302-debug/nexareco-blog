"use client";

import ReactMarkdown from "react-markdown";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-8 prose-li:leading-7 prose-ul:my-4 prose-ol:my-4">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
