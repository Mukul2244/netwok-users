"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schema/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import axiosInstance from "@/lib/axios";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ email: string }>(); // Extract email from the URL
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Decode the email to ensure it is in its original form
  const decodedEmail = decodeURIComponent(params.email);

  // zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "", // Ensure the OTP field has a default value
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      // Send OTP and email to the server
      const response = await axiosInstance.post(`/customers/verify-otp/`, {
        email: decodedEmail, // Email from the URL
       otp: data.otp, // OTP entered by the user
      });
      // Show success message
      toast.success(response.data.message || "Account verified successfully!");
      router.replace("/"); // Redirect to the sign-in page
    } catch (error) {
      // Handle server errors
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message ||
            "Verification failed. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      form.reset(); // Reset the form after submission
      setIsSubmitting(false); // Reset the submitting state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl text-indigo-800 font-extrabold tracking-tight lg:text-4xl mb-2">
            Verify your Account
          </h1>
          <p className="mb-2">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="otp"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} placeholder="Enter your OTP" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
