import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Beer, LogOut, Users } from "lucide-react";
import PubMates from "./PubMates";
import { useAuth } from "@/context/AuthContext";
import Timer from "./Timer";
import axiosInstance from "@/lib/axios";
import { logout } from "@/lib/logout";

export default function Header() {
  const { username } = useAuth();
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [restaurantName, setRestaurantName] = useState<string>("");

  const handleLogout = useCallback(() => {
    logout();
    localStorage.removeItem("username");
    // localStorage.removeItem("qrCodeNumber");
    // localStorage.removeItem("restaurantId");
  }, []);
  const fetchData = useCallback(async () => {
    const response = await axiosInstance.get("/customers/");
    setExpiryDate(response.data.customer.token_expiry_on);
    setRestaurantName(response.data.visited_restaurants[0].name);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const memoizedUsername = useMemo(() => username, [username]);
  const memoizedExpiryDate = useMemo(() => expiryDate, [expiryDate]);

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md p-4 flex items-center justify-between sticky top-0 z-10 transition-all duration-300 ease-in-out">
      <h1 className="text-2xl font-bold text-fuchsia-800 flex items-center">
        <Beer className="mr-2 text-amber-500 animate-bounce" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600">
          {`${restaurantName} Pub`}
        </span>
      </h1>
      <div className="flex items-center space-x-4">
        <div className="text-sm font-medium text-fuchsia-700">
          Welcome, {memoizedUsername}!
        </div>
        <div className="text-sm font-medium text-fuchsia-700 bg-fuchsia-100 px-3 py-1 rounded-full">
          <Timer expiryDate={memoizedExpiryDate} />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-fuchsia-600 hover:text-fuchsia-800 hover:bg-fuchsia-100 rounded-full transition-all duration-300"
            >
              <Users className="h-6 w-6" />
              <span className="sr-only">View Pub Mates</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle asChild>
              <h2 className="mt-4 text-2xl font-bold flex items-center text-fuchsia-800">
                <Users className="m-2 text-fuchsia-600" /> Pub Mates
              </h2>
            </SheetTitle>
            <SheetDescription />
            <PubMates />
          </SheetContent>
        </Sheet>
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
