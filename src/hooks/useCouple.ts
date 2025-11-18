import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCouple = () => {
  const queryClient = useQueryClient();

  // 🛠 FIX: Destructure ALL necessary properties (isError and error were missing)
  const { 
    data: user, 
    isLoading, 
    isError, // <-- ADDED
    error    // <-- ADDED
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/api/couple/me");
      return res.data;
    },
    staleTime: 5000, // Keep data fresh for 5 seconds
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/couple/generate");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] }); // Refresh data
      toast.success("Code generated!");
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await api.post("/api/couple/join", { inviteCode: code });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Connected! ❤️");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to join");
    },
  });

  // 🛠 FIX: Return ALL destructured properties
  return { user, isLoading, isError, error, generateMutation, joinMutation };
};