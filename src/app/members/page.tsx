import React from "react";
import MembersClient from "@/components/members/MembersClient";
import { getMembers } from "@/lib/data";

export default async function MembersPage() {
  const members = await getMembers();
  return <MembersClient initialMembers={members} />;
}
