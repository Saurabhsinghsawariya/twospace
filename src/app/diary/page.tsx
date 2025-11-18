"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Ensure you have this
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this shadcn component
import { useDiary } from "@/hooks/useDiary";
import { format } from "date-fns";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MOODS = ["😊", "😂", "❤️", "😢", "😡", "😴", "🔥", "🎉"];

export default function DiaryPage() {
  const { entries, isLoading, createMutation, deleteMutation } = useDiary();
  const [isOpen, setIsOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("😊");

  const handleSubmit = () => {
    if (!title || !content) return;
    createMutation.mutate(
      { title, content, mood },
      {
        onSuccess: () => {
          setIsOpen(false);
          setTitle("");
          setContent("");
          setMood("😊");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-amber-50/50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 hover:bg-amber-100">
            <ArrowLeft className="h-4 w-4 text-amber-800" /> 
            <span className="text-amber-800">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-amber-800">Our Diary 📔</h1>
        
        {/* Add Button (Triggers Modal) */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2 rounded-full shadow-md">
              <Plus className="h-4 w-4" /> Write
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dear Diary...</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Mood Selector */}
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Current Mood</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`text-2xl p-2 rounded-full transition ${
                        mood === m ? "bg-amber-200 scale-110 shadow-sm" : "hover:bg-gray-100"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              
              <Input 
                placeholder="Title (e.g., Date Night!)" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-amber-200 focus-visible:ring-amber-500"
              />
              <Textarea 
                placeholder="What happened today?" 
                className="min-h-[150px] border-amber-200 focus-visible:ring-amber-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700" 
                onClick={handleSubmit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content List */}
      <div className="max-w-2xl mx-auto space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-400 animate-pulse">Opening diary...</p>
        ) : entries?.length === 0 ? (
          <div className="text-center py-20 opacity-50 border-2 border-dashed border-amber-200 rounded-xl">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-amber-800">Write your first memory together.</p>
          </div>
        ) : (
          entries.map((entry: any) => (
            <Card key={entry._id} className="border-l-4 border-l-amber-400 shadow-sm hover:shadow-md transition bg-white">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                   <div className="text-xs font-medium text-amber-600 flex items-center gap-2 mb-1 uppercase tracking-wide">
                      <span>{format(new Date(entry.date), "MMMM do, yyyy")}</span>
                      <span>•</span>
                      <span className="text-lg leading-none">{entry.mood}</span>
                   </div>
                   <CardTitle className="text-xl text-gray-800">{entry.title}</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 -mr-2 -mt-2"
                  onClick={() => deleteMutation.mutate(entry._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                   <span className="text-xs text-gray-400 italic">Written by {entry.authorId?.name}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}