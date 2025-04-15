"use client";
import { useState, Suspense } from "react";
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
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { RegisterSchema } from "@/schema/RegisterSchema";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";

function RegisterForm() {
  const router = useRouter();
  const { setUsername } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });



  const handleRegister = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    try {
      const restaurantId = localStorage.getItem("restaurantId");
      const qrCodeNumber = localStorage.getItem("qrCodeNumber");
      if (!restaurantId || !qrCodeNumber) {
        toast("Invalid QR code");
        setLoading(false);
        return;
      }
      const response = await axiosInstance.post("/customers/", {
        ...data,
        restraunt_id: restaurantId,
        var_id: qrCodeNumber,
      });
      localStorage.setItem('username', response.data.username);
      await axios.post('/api/setCookie', {
        accessToken: response.data.token,
      });
      setUsername(response.data.username);
      if(response.data.is_verified){
      toast("You have successfully registered");
      router.push('/');
      }else{
        toast("You have successfully registered but your account is not verified yet");
        router.push(`/verify/${response.data.email}`);
      }
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
        <div className="space-y-4 ">
          <h2 className="flex justify-center text-3xl text-indigo-800 font-extrabold tracking-tight  lg:text-4xl mb-6">
            Join The Netwok
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
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
