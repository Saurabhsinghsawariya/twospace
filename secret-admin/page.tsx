"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ShieldAlert, Trash2, Activity } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  // 1. Fetch Stats
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/admin/stats");
        return res.data;
      } catch (err) {
        // If not admin, kick them out
        router.push("/dashboard");
        toast.error("⛔ Nice try! Admin access only.");
        throw err;
      }
    },
    retry: 0,
  });

  // 2. Nuke Function
  const resetMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/admin/reset-chat");
      return res.data;
    },
    onSuccess: () => toast.success("💥 Chat history deleted!"),
    onError: () => toast.error("Failed to reset"),
  });

  if (isLoading) return <div className="p-10">Verifying clearance...</div>;
  if (isError) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="flex items-center gap-4 border-b border-zinc-800 pb-6">
          <ShieldAlert className="h-10 w-10 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">God Mode</h1>
            <p className="text-zinc-400">System Administration</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={stats?.users} />
          <StatCard label="Couples" value={stats?.couples} />
          <StatCard label="Messages" value={stats?.messages} />
          <StatCard label="Memories" value={stats?.memories} />
          <StatCard label="Diary Entries" value={stats?.diaryEntries} />
        </div>

        {/* Danger Zone */}
        <Card className="bg-red-950/20 border-red-900">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <Activity className="h-5 w-5" /> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-300 mb-4 text-sm">
              These actions are irreversible. Be careful.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => {
                if(confirm("Are you sure you want to delete ALL chat messages?")) {
                    resetMutation.mutate();
                }
              }}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" /> Wipe All Chats
            </Button>
          </CardContent>
        </Card>

        <Button variant="outline" onClick={() => router.push("/dashboard")} className="text-black">
          Exit God Mode
        </Button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <p className="text-zinc-400 text-sm">{label}</p>
        <p className="text-3xl font-mono font-bold text-white">{value}</p>
      </CardContent>
    </Card>
  )
}