import React from "react";
import AdminClient from "@/components/admin/AdminClient";
import { getMembers, getPublications, getNews } from "@/lib/data";

export default async function AdminPage() {
  const [members, publications, news] = await Promise.all([
    getMembers(),
    getPublications(),
    getNews(),
  ]);

  return (
    <AdminClient
      initialMembers={members}
      initialPublications={publications}
      initialNews={news}
    />
  );
}
