"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCouple } from "@/hooks/useCouple";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // 1. Check Auth Status
  const { user, isLoading: isAuthLoading } = useCouple();

  // 2. Check Server Health
  const { data: healthStatus, isLoading: isServerLoading } = useQuery({
    queryKey: ["health-check"],
    queryFn: async () => {
      try {
        const res = await api.get("/");
        return { status: "online", message: res.data };
      } catch (err) {
        return { status: "offline", message: "Server Offline" };
      }
    },
    retry: 1,
  });

  // 3. Auto-Redirect to Dashboard if logged in
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isAuthLoading, router]);

  // Loading Spinner
  if (isAuthLoading || (user && !isAuthLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-pink-50">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  // 4. Attractive Landing UI
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <Heart className="h-8 w-8 text-pink-600" fill="currentColor" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
            TwoSpace
          </CardTitle>
          <p className="text-gray-500">
            A private digital home for just the two of you.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Link href="/login" className="block w-full">
            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-lg h-12 rounded-xl">
              Login
            </Button>
          </Link>
          
          <Link href="/register" className="block w-full">
            <Button variant="outline" className="w-full text-lg h-12 rounded-xl hover:bg-gray-50">
              Create Account
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="absolute bottom-6 flex items-center gap-2 text-xs text-gray-400">
        <div className={`h-2 w-2 rounded-full ${
            healthStatus?.status === "online" ? "bg-green-500" : "bg-red-500"
          }`} 
        />
        <span>{healthStatus?.status === "online" ? "System Online" : "Connecting..."}</span>
      </div>
    </div>
  );
}