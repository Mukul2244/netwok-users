"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import {  isAxiosError } from "axios";

interface Offer {
  id: string;
  description: string;
  time_based: boolean;
  time_duration_hours: number;
  token: string;
}

export default function CouponsSection() {
  const [totalTime, setTotalTime] = useState(0);
  const [restaurantName, setRestaurantName] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stayTime, setStayTime] = useState("00h:00m:00s");
  const [customerCreatedAt, setUserCreatedAt] = useState<string | null>(null);

  const calculateTime = useCallback(() => {
    if (!customerCreatedAt) return;

    const currentTime = new Date().getTime();
    const createdTime = new Date(customerCreatedAt).getTime();
    const timeDifference = currentTime - createdTime;

    // Update stay time
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    setStayTime(`${hours}h:${minutes}m:${seconds}s`);

    // Update total time in seconds
    setTotalTime(timeDifference / 1000);
  }, [customerCreatedAt]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/customers/");
      const customerData = response.data.customer;
      setUserCreatedAt(customerData.token_created_on);
      const restaurantData = response.data.visited_restaurants[0];
      setRestaurantName(restaurantData.name);
      setOffers(restaurantData.offers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [calculateTime]);

  const handleRedeem = async (token: string) => {
    try {
      await axiosInstance.post("/offer-redemptions/redeem/", {
        offer_token: token
      });
      toast("Offer redeemed successfully");

    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 400) {
        toast("You have already redeemed this offer");
      }
    }
  }
  return (
    <div className="flex-1 p-4 bg-white/80 rounded-lg shadow-lg overflow-auto">
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-2 text-fuchsia-700">{`Total Time at ${restaurantName}: ${stayTime}`}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {offers.length === 0 ? (
          <div className="p-4 rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-bold mb-2 text-fuchsia-800">
              No Offer Available
            </h3>
          </div>
        ) : (
          offers.map((offer) => {
            const isUnlocked = totalTime >= offer.time_duration_hours * 3600;
            return (
              <div
                key={offer.id}
                className={`p-4 rounded-lg shadow-md transition-all duration-300 bg-white`}
              >
                <Button
                  className={`float-end mt-2 max-w-md transition-all duration-300  `}
                  disabled={!isUnlocked}
                  onClick={() => handleRedeem(offer.token)}
                >
                  {isUnlocked
                    ? "Redeem"
                    : `Unlock in ${offer.time_duration_hours - Math.floor(totalTime / 3600)
                    }h`}
                </Button>
                <h3
                  className={`text-xl font-bold mb-2  text-fuchsia-800
                  }`}
                >
                  {offer.description}
                </h3>
                <p className={`text-sm text-fuchsia-700 }`}>
                  {offer.description}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}
