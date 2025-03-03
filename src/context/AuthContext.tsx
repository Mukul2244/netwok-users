"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
  username: string;
  setUsername: (username: string) => void;
}>({
  username: "",
  setUsername: () => { },
});

const useAuth = () => useContext(AuthContext);
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        username,
        setUsername,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
