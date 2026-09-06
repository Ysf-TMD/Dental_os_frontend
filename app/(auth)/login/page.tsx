import type { Metadata } from "next";
import { LoginHero } from "@/features/auth/components/login-hero";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Connexion — DentalOS",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <LoginHero />
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
