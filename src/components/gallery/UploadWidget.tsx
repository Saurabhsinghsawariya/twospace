"use client";
import { Button } from "@/components/ui/button";
import { useMemories } from "@/hooks/useMemories";
import { Loader2, Upload } from "lucide-react"; // Icons
import { useRef } from "react";

export default function UploadWidget() {
  const { uploadMutation } = useMemories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  return (
    <div>
      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Visible Trigger Button */}
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadMutation.isPending}
        className="bg-pink-600 hover:bg-pink-700 text-white gap-2"
      >
        {uploadMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Add Memory
          </>
        )}
      </Button>
    </div>
  );
}