import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Register Page</h1>
        <Input placeholder="Name" />
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <Button className="w-full">Create Account</Button>
      </Card>
    </div>
  );
}
