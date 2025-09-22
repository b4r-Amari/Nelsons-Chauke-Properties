
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/shared/auth-form";
import { Logo } from "@/components/shared/logo";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-background p-4">
            <div className="mb-8">
                <Logo />
            </div>
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">Welcome</CardTitle>
                    <CardDescription>Sign in or create an account to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm onAuthSuccess={() => router.push('/my-account')} />
                </CardContent>
            </Card>
        </div>
    );
}
