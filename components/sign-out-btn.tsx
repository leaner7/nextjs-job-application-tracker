"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutBtn() {
    const router = useRouter()

  return (
    <DropdownMenuItem
      className="text-destructive focus:text-destructive cursor-pointer"
      onClick={async () => {
        const result = await signOut()
        if (result.data) {
            router.refresh()
            router.push("/sign-in")
        } else {
            alert('Error signing out')
        }
      }}
    >
      Log out
    </DropdownMenuItem>
  );
}
