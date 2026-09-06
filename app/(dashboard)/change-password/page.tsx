import type { Metadata } from "next";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export const metadata: Metadata = {
  title: "Changer le mot de passe — DentalOS",
};

export default function ChangePasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <ChangePasswordForm />
    </div>
  );
}
