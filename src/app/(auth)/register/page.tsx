"use client";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { RegisterSchema } from "@/schema/RegisterSchema";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";
import Image from "next/image";

const items = [
  {
    id: "beer",
    label: "Beer",
  },
  {
    id: "wine",
    label: "Wine",
  },
  {
    id: "cocktails",
    label: "Cocktails",
  },
  {
    id: "sports",
    label: "Sports",
  },
  {
    id: "trivia",
    label: "Trivia",
  },
  {
    id: "music",
    label: "Music",
  },
  {
    id: "dancing",
    label: "Dancing",
  },
  {
    id: "board-games",
    label: "Board Games",
  },
  {
    id: "video-games",
    label: "Video Games",
  },
  {
    id: "karaoke",
    label: "Karaoke",
  },
  {
    id: "comedy",
    label: "Comedy",
  },
  {
    id: "food",
    label: "Food",
  },
  {
    id: "travel",
    label: "Travel",
  },
  {
    id: "movies",
    label: "Movies",
  },
  {
    id: "books",
    label: "Books",
  },
  {
    id: "art",
    label: "Art",
  },
  {
    id: "fitness",
    label: "Fitness",
  },
] as const;

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUsername } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      description: "",
      interests: [],
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
      const restaurantId = localStorage.getItem("restaurantId")!;
      const qrCodeNumber = localStorage.getItem("qrCodeNumber")!;

      if (!restaurantId || !qrCodeNumber) {
        toast("Invalid QR code");
        setLoading(false);
        return;
      }
      const response = await axiosInstance.post("/customers/", {
        username: data.username,
        email: data.email,
        name: data.name,
        one_line_desc: data.description,
        interests: data.interests,
        gender: data.sex,
        restraunt_id: restaurantId,
        var_id: qrCodeNumber,
      });
      localStorage.setItem("username", response.data.username);
      await axios.post("/api/setCookie", {
        accessToken: response.data.token,
      });
      setUsername(response.data.username);
      if (response.data.otp_required) {
        toast(
          "You have successfully registered but your account is not verified yet"
        );
        router.push(`/verify/${response.data.email}`);
      } else {
        toast("You have successfully registered");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast("Registration failed due to some error");
    } finally {
      // form.reset();
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-purple-600 to-indigo-800 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden p-6">
        <div className="space-y-4">
          <div className="flex justify-center mb-3">
            <Image
              className="shadow-xl "
              src="/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              priority
            />
          </div>
          <h2 className=" flex justify-center text-3xl font-bold mb-2 text-indigo-800">
            Join the Netwok
          </h2>
          <ScrollArea>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleRegister)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        />
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
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-line Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Sex</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <RadioGroupItem value="M" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <RadioGroupItem value="F" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <RadioGroupItem value="O" />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4">
                          {items.map((item) => (
                            <FormItem
                              key={item.id}
                              className="flex items-center space-x-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={(field.value ?? []).includes(
                                    item.id
                                  )}
                                  onCheckedChange={(checked: boolean) => {
                                    if (checked) {
                                      field.onChange([
                                        ...(field.value ?? []),
                                        item.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        (field.value ?? []).filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
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
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
