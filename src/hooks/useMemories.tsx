import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMemories = () => {
  const queryClient = useQueryClient();

  // 🛠 FIX: Destructure ALL necessary properties from useQuery
  const { 
    data: memories, 
    isLoading, 
    isError, // <-- ADDED
    error    // <-- ADDED
  } = useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      const res = await api.get("/api/memories");
      return res.data;
    },
    // Memories are static until a new one is uploaded, so stale time can be long
    staleTime: 5 * 60 * 1000, 
  });

  // 2. Upload Logic
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file); // Must match backend 'upload.single("file")'

      const res = await api.post("/api/memories/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate to refetch the memories list
      queryClient.invalidateQueries({ queryKey: ["memories"] }); 
      toast.success("Memory saved! 📸");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload image");
      console.error(error);
    },
  });

  // 🛠 FIX: Return ALL properties needed by the Gallery UI
  return { memories, isLoading, isError, error, uploadMutation };
};