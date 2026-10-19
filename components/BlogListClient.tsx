"use client";

import { Suspense } from "react";
import CategoryFilter from "./CategoryFilter";
import BlogCard from "./BlogCard";
import type { PostMeta } from "@/lib/posts";
import { useTranslations } from "next-intl";

function BlogListInner({
  allPosts,
  category,
}: {
  allPosts: PostMeta[];
  category: string | undefined;
}) {
  const t = useTranslations("blog");
  const posts =
    category && category !== "all"
      ? allPosts.filter((p) => p.category === category)
      : allPosts;

  return (
    <>
      <CategoryFilter />
      {posts.length === 0 ? (
        <p className="mt-12 text-center text-gray-400">{t("noPosts")}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}

export default function BlogListClient({
  allPosts,
  category,
}: {
  allPosts: PostMeta[];
  category: string | undefined;
}) {
  return (
    <Suspense>
      <BlogListInner allPosts={allPosts} category={category} />
    </Suspense>
  );
}
