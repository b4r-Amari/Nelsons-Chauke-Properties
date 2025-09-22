
"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { signIn, signUp, signInWithGoogle } from "@/lib/firebase/auth";
import { addUserData } from "@/lib/firebase/firestore";
import { Loader2 } from "lucide-react";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

type AuthFormData = z.infer<typeof authSchema>;

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
        {...props}
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.916,35.637,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
    );
  }

export function AuthForm({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const { toast } = useToast();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.reset(); // Reset form fields when switching tabs
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithGoogle();
      await addUserData(userCredential.user);
      toast({ title: "Signed In", description: "Welcome!" });
      onAuthSuccess?.();
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "Could not sign in with Google. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: AuthFormData) => {
    setIsLoading(true);
    try {
      if (activeTab === "signin") {
        await signIn(values.email, values.password);
        toast({ title: "Signed In", description: "Welcome back!" });
      } else {
        const userCredential = await signUp(values.email, values.password);
        await addUserData(userCredential.user);
        toast({ title: "Account Created", description: "You have successfully signed up." });
      }
      form.reset();
      onAuthSuccess?.();
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      switch (errorCode) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password. Please try again.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "This email address is already in use by another account.";
          break;
        case "auth/weak-password":
            errorMessage = "The password is too weak. Please use at least 8 characters.";
            break;
        case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
      }
      
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 p-1 h-auto bg-muted rounded-lg">
        <TabsTrigger 
          value="signin"
          className="data-[state=active]:bg-brand-bright data-[state=active]:text-white rounded-md data-[state=inactive]:bg-muted hover:data-[state=inactive]:bg-background/80 transition-colors"
        >
          Sign In
        </TabsTrigger>
        <TabsTrigger 
          value="signup"
          className="data-[state=active]:bg-brand-bright data-[state=active]:text-white rounded-md data-[state=inactive]:bg-muted hover:data-[state=inactive]:bg-background/80 transition-colors"
        >
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <AuthFormContent form={form} onSubmit={onSubmit} isLoading={isLoading} buttonText="Sign In" onGoogleSignIn={handleGoogleSignIn} />
      </TabsContent>
      <TabsContent value="signup">
        <AuthFormContent form={form} onSubmit={onSubmit} isLoading={isLoading} buttonText="Create Account" onGoogleSignIn={handleGoogleSignIn} />
      </TabsContent>
    </Tabs>
  );
}

function AuthFormContent({ form, onSubmit, isLoading, buttonText, onGoogleSignIn }: { form: any, onSubmit: (values: AuthFormData) => void, isLoading: boolean, buttonText: string, onGoogleSignIn: () => void }) {
  return (
    <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {buttonText}
                </Button>
            </form>
        </Form>
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
        </div>
         <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2" />}
            Google
        </Button>
    </>
  )
}
