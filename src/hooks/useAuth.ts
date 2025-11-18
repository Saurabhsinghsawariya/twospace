import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/auth/register", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Welcome to TwoSpace! 🚀");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/auth/login", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Welcome back! ❤️");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  // This handles the logout call
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/auth/logout");
    },
    onSuccess: () => {
      router.push("/login");
      toast.success("Logged out successfully");
    },
  });

  return { registerMutation, loginMutation, logoutMutation };
};