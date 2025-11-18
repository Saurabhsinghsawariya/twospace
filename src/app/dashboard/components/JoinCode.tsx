"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCouple } from "@/hooks/useCouple";
import { useState } from "react";

export default function JoinCode() {
  const [code, setCode] = useState("");
  const { joinMutation } = useCouple();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Existing Space</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Enter the code your partner sent you.
        </p>
        <Input 
          placeholder="A1B2C3" 
          value={code} 
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
        />
        <Button 
          onClick={() => joinMutation.mutate(code)} 
          disabled={joinMutation.isPending || code.length < 6}
          className="w-full bg-purple-600"
        >
          {joinMutation.isPending ? "Connecting..." : "Join Partner"}
        </Button>
      </CardContent>
    </Card>
  );
}