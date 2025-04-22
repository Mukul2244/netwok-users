"use client";
import { useAuth } from "@/context/AuthContext"
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";


export default function Home() {
  const { username } = useAuth()
  const [restaurantName, setRestaurantName] = useState("")

  const getData = async () => {
    const response =await axiosInstance.get("/customers/")
    setRestaurantName(response.data.current_restaurant.name)
  }

  useEffect(() => {
    getData()
  },[])
  return (
    <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-indigo-800">{`Welcome, ${username} to ${restaurantName}`}</h2>
      <p className="mb-4 text-lg text-purple-700">Enjoy our chat, games, and exclusive offers!</p>
      {/* <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2 text-indigo-700">Today&apos;s Special</h3>
        <p className="text-purple-600">Half-price on all draft beers from 5PM to 7PM!</p>
      </div> */}
    </div>
  )

}

