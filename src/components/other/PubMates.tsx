import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  MessageSquare } from 'lucide-react';
import { UserInterface } from '@/interfaces/User';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import axiosInstance from '@/lib/axios';

export default function PubMates() {
  const { username } = useAuth();
  const { onStartChat } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserInterface[]>([]);

  const fetchUsers = useCallback(async () => {
    const response = await axiosInstance.get('/customers/');
    const data = response.data.current_restaurant;
    const ids = data.customers;
    const usernames = data.customers_usernames;
    const mergedCustomers = ids.map((id: number, index: number) => ({
      id: id,
      username: usernames[index],
    }));
    const filteredUser = mergedCustomers.filter((user: UserInterface) => user.username !== username);
    setSelectedUser(filteredUser);
  }, [username]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const lowercaseTerm = searchTerm.toLowerCase();
    return selectedUser.filter(user =>
      user.username.toLowerCase().includes(lowercaseTerm)
    );
  }, [searchTerm, selectedUser]);

  return (
    <div className=" mx-4 space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow rounded-full border-fuchsia-300 focus:border-fuchsia-500 focus:ring-fuchsia-500"
        />
        {/* <Button
          size="icon"
          className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-300"
        >
          <Search className="h-4 w-4" />
        </Button> */}
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        {selectedUser.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-fuchsia-500">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center mb-4 p-3 hover:bg-fuchsia-100 rounded-xl transition-all duration-300 animate-fade-in-up">
              <Avatar className="h-12 w-12 border-2 border-fuchsia-300">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-grow">
                <p className="font-medium text-fuchsia-900">{user.username}</p>
              </div>
              <Button
                onClick={() => onStartChat(user.username)}
                size="icon"
                variant="ghost"
                className="text-fuchsia-600 hover:text-fuchsia-800 hover:bg-fuchsia-100 rounded-full transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}

