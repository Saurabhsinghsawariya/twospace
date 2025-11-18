"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCouple } from "@/hooks/useCouple";

export default function GenerateCode() {
  const { generateMutation } = useCouple();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a New Space</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Get a code to share with your partner.
        </p>
        <Button 
          onClick={() => generateMutation.mutate()} 
          disabled={generateMutation.isPending}
          className="w-full bg-pink-600"
        >
          {generateMutation.isPending ? "Generating..." : "Generate Code"}
        </Button>
      </CardContent>
    </Card>
  );
}