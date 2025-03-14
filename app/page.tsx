"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  return (
    <div className=" h-screen w-full flex items-center justify-center">
      <Button
        size={"lg"}
        onClick={() => {
          router.push("/auth/register");
        }}
      >
        Auth
      </Button>
    </div>
  );
}
