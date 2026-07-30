import React from "react";
import NewsClient from "@/components/news/NewsClient";
import { getNews } from "@/lib/data";

export default async function NewsPage() {
  const news = await getNews();
  return <NewsClient initialNews={news} />;
}
