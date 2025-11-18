"use client";

import UploadWidget from "@/components/gallery/UploadWidget";
import { Card } from "@/components/ui/card";
import { useMemories } from "@/hooks/useMemories";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const { memories, isLoading } = useMemories();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Space
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Our Vault 📸</h1>
        <UploadWidget />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="animate-pulse text-gray-400">Loading memories...</span>
          </div>
        ) : memories?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No memories yet.</p>
            <p className="text-sm text-gray-400">Upload your first photo above!</p>
          </div>
        ) : (
          // Masonry-style Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memories.map((mem: any) => (
              <Card key={mem._id} className="overflow-hidden group relative aspect-square">
                <img
                  src={mem.imageUrl}
                  alt="Memory"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay (Optional) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}