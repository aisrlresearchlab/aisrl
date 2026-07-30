import React from "react";
import PublicationsClient from "@/components/publications/PublicationsClient";
import { getPublications } from "@/lib/data";

export default async function PublicationsPage() {
  const publications = await getPublications();
  return <PublicationsClient initialPublications={publications} />;
}
