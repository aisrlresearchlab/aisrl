import React from "react";
import LoginClient from "@/components/admin/LoginClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In | AISRL",
  description: "Secure administrator sign in portal for Applied Intelligent Systems Research Lab (AISRL)",
};

export default function LoginPage() {
  return <LoginClient />;
}
