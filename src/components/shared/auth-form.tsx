
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
import { signIn, signUp } from "@/lib/firebase/auth";
import { Loader2 } from "lucide-react";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const { toast } = useToast();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: AuthFormData) => {
    setIsLoading(true);
    try {
      if (activeTab === "signin") {
        await signIn(values.email, values.password);
        toast({ title: "Signed In", description: "Welcome back!" });
      } else {
        await signUp(values.email, values.password);
        toast({ title: "Account Created", description: "You have successfully signed up." });
      }
      form.reset();
      onAuthSuccess?.();
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = "An unexpected error occurred.";
      if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
        errorMessage = "Invalid email or password.";
      } else if (errorCode === "auth/email-already-in-use") {
        errorMessage = "This email is already associated with an account.";
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <AuthFormContent form={form} onSubmit={onSubmit} isLoading={isLoading} buttonText="Sign In" />
      </TabsContent>
      <TabsContent value="signup">
        <AuthFormContent form={form} onSubmit={onSubmit} isLoading={isLoading} buttonText="Create Account" />
      </TabsContent>
    </Tabs>
  );
}

function AuthFormContent({ form, onSubmit, isLoading, buttonText }: { form: any, onSubmit: (values: AuthFormData) => void, isLoading: boolean, buttonText: string }) {
  return (
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
  )
}
