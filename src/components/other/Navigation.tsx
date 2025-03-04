import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Gamepad2, Ticket, Laugh } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("");

  const navItems = useMemo(
    () => [
      { name: "/", icon: Home, label: "Home" },
      { name: "/chat", icon: MessageSquare, label: "Chat" },
      { name: "/games", icon: Gamepad2, label: "Games" },
      { name: "/coupons", icon: Ticket, label: "Coupons" },
      { name: "/fun", icon: Laugh, label: "Fun" },
    ],
    []
  );

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const handleClick = useCallback(
    (name: string) => {
      setActiveTab(name);
      router.push(name);
    },
    [router]
  );

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-t border-fuchsia-200 flex justify-around items-center h-16 sticky bottom-0 z-10">
      {navItems.map((item) => (
        <Button
          key={item.name}
          variant="ghost"
          className={`flex-1 flex flex-col items-center py-2 transition-all duration-300 ${
            activeTab === item.name
              ? "text-fuchsia-600 bg-fuchsia-100"
              : "text-gray-500 hover:text-fuchsia-600 hover:bg-fuchsia-50"
          }`}
          onClick={() => handleClick(item.name)}
        >
          <item.icon
            className={`h-6 w-6 ${activeTab === item.name ? "animate-bounce" : ""}`}
          />
          <span className="text-xs mt-1">{item.label}</span>
        </Button>
      ))}
    </nav>
  );
}

