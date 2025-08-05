
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logOut } from "@/lib/firebase/auth";

export default function MyAccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  if (isLoading || !user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">My Account</CardTitle>
          <CardDescription>Manage your account settings and view your details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">User ID</h3>
            <p className="text-muted-foreground text-sm">{user.uid}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="mt-4">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
