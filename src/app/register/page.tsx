"use client";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { RegisterSchema } from "@/schema/RegisterSchema";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUsername } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    const restaurantId = searchParams.get("restaurantId");
    const qrCodeNumber = searchParams.get("qrCodeNumber");
    if (restaurantId && qrCodeNumber) {
      localStorage.setItem("restaurantId", restaurantId);
      localStorage.setItem("qrCodeNumber", qrCodeNumber);
    }
  }, [searchParams]);

  const handleRegister = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    try {
      const restaurantId = localStorage.getItem("restaurantId");
      const qrCodeNumber = localStorage.getItem("qrCodeNumber");
      if (!restaurantId || !qrCodeNumber) {
        toast("Invalid QR code");
        return;
      }
      data.restaurantId = Number(restaurantId);
      data.qrCodeNumber = qrCodeNumber || '';
      const response = await axiosInstance.post("/customers/", data);
      localStorage.setItem('username', response.data.username);
      await axios.post('/api/setCookie', {
        accessToken: response.data.token,
      });
      setUsername(response.data.username);
      toast("You have successfully registered");
      router.push('/');
    } catch (error) {
      console.log(error);
      toast("Registration failed due to some error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-purple-600 to-indigo-800 p-4">
      <div className="w-full max-w-md max-h-lg bg-white rounded-lg shadow-xl overflow-hidden p-6 ">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">
            Join The Tipsy Tavern
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
