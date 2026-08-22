import { SignUp } from "@clerk/nextjs";

import { AuthBrand } from "@/components/auth-brand";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <AuthBrand />
      <SignUp />
    </div>
  );
}
