"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function SearchModal({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = query.trim().length > 0
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="글 검색..."
            className="flex-1 text-sm outline-none placeholder:text-gray-300"
          />
          <kbd className="text-[10px] text-gray-300 border border-gray-200 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {query.trim().length > 0 && (
          <div className="max-h-80 overflow-y-auto py-2">
            {results.length > 0 ? (
              results.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block px-5 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-[10px] text-gray-400 tracking-widest uppercase">{post.category}</span>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{post.title}</p>
                </Link>
              ))
            ) : (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">
                검색 결과가 없습니다
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
