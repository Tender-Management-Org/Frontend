import { getSiteConfig } from "@/lib/api/config";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const { invite_only } = await getSiteConfig();
  return <LoginForm inviteOnly={invite_only} />;
}
