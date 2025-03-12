"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MessageInterface } from '@/interfaces/Messsage';
import { useSocket } from '@/context/SocketContext';
import { useChat } from '@/context/ChatContext';
import axiosInstance from '@/lib/axios';
import getCookie from '@/lib/getCookie';
import axios from 'axios';

export default function ChatLayout() {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [inputText, setInputText] = useState('');
  const { username } = useAuth();
  const { activeChat } = useChat();
  const { socket, setSocket } = useSocket();
  const socketRef = useRef<WebSocket | null>(null); // Store WebSocket instance

  const chatId = useCallback(async () => {
    try {
      const restaurantId = localStorage.getItem('restaurantId');
      const response = await axiosInstance.post('/private-chatdb/', {
        user1: username,
        user2: activeChat,
        restaurant_id: restaurantId
      });
      return response.data.chat_id;
    } catch (error) {
      console.error("Error fetching chat id:", error);
    }
  }, [username, activeChat]);

  const handleChatHistory = useCallback(async () => {
    try {
      const chatIdValue = await chatId();
      if (chatIdValue) {
        const response = await axiosInstance.get(`/private-chat/?chat_id=${chatIdValue}`);
        setMessages(response.data);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("No chat history found");
      }
      else {
        console.error("Error fetching chat id:", error);
      }

    }
  }, [chatId]);

  const handleSocketConnection = useCallback(async () => {
    try {
      const token = await getCookie('accessToken');
      const chatIdValue = await chatId();
      if (chatIdValue && token) {
        const ws = new WebSocket(`ws://netwok.app/ws/private/${chatIdValue}/${token}/`);
        socketRef.current = ws;
        setSocket(ws);
        ws.onopen = () => {
          console.log('WebSocket connected');
        };
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, message]);
        };
        ws.onclose = () => {
          console.log('WebSocket disconnected');
        };
      }
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }
  }, [chatId, setSocket]);

  useEffect(() => {
    if (activeChat) {
      handleChatHistory();
      handleSocketConnection();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [activeChat, handleChatHistory, handleSocketConnection]);

  const handleSendMessage = useCallback(() => {
    console.log('Sending message:', inputText);
    if (inputText.trim() !== '') {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ message: inputText }));
      }
      setInputText('');
    }
  }, [inputText, socket]);

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl shadow-md transition-all duration-300 p-4 space-y-4">
      <div className="bg-white/80 backdrop-blur-sm p-3 text-center font-semibold text-fuchsia-800 border-b border-fuchsia-200">
        Chat with {activeChat}
      </div>

      {/* Message Display Section */}
      <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto">
        <ScrollArea className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-fuchsia-500">No messages yet</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${msg.sender_username === username ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-lg transition-all duration-300 ${msg.sender_username === username
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                    : 'bg-white text-fuchsia-800'
                    } hover:shadow-xl`}
                >
                  <p className="font-semibold">{msg.sender_username === username ? 'You' : msg.sender_username}</p>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-fuchsia-200 rounded-b-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 border-fuchsia-300 focus:border-fuchsia-500 focus:ring-fuchsia-500 rounded-full transition-all duration-300"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 rounded-full transition-all duration-300"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

