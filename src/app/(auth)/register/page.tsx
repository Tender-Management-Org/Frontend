import { redirect } from "next/navigation";
import { getSiteConfig } from "@/lib/api/config";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const { invite_only } = await getSiteConfig();

  if (invite_only) {
    redirect("/login");
  }

  return <RegisterForm />;
}
