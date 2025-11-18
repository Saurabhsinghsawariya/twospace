import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDiary = () => {
  const queryClient = useQueryClient();

  // 🛠 FIX: Destructure ALL necessary properties from useQuery
  const { 
    data: entries, 
    isLoading, 
    isError, // <-- ADDED
    error    // <-- ADDED
  } = useQuery({
    queryKey: ["diary"],
    queryFn: async () => {
      const res = await api.get("/api/diary");
      return res.data;
    },
    // Set a small stale time as data changes only when a new entry is made
    staleTime: 5000,
  });

  // Create Entry
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/diary", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary"] });
      toast.success("Diary updated! ✍️");
    },
    onError: () => toast.error("Failed to save entry"),
  });

  // Delete Entry
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/diary/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary"] });
      toast.success("Entry deleted");
    },
    onError: () => toast.error("Failed to delete entry"),
  });

  // 🛠 FIX: Return ALL properties needed by the UI
  return { entries, isLoading, isError, error, createMutation, deleteMutation };
};