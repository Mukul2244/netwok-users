"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { MessageInterface } from '@/interfaces/Messsage'
import { useSocket } from '@/context/SocketContext'
import  axiosInstance from '@/lib/axios'
import getCookie from '@/lib/getCookie'

export default function ChatSection() {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const [inputText, setInputText] = useState('')
  const { username } = useAuth()
  const { socket, setSocket } = useSocket();
  const socketRef = useRef<WebSocket | null>(null); // Store WebSocket instance

  const handleSendMessage = useCallback(() => {
    console.log('Sending message:', inputText);
    if (inputText.trim() !== '') {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ message: inputText }));
      }
      setInputText('');
    }
  }, [inputText, socket]);

  const handleConnection = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/group-chat/')
      setMessages(response.data)
      const token = await getCookie('accessToken')
      const ws = new WebSocket(`ws://13.60.42.120/ws/group/33/951656/${token}/`);
      socketRef.current = ws
      setSocket(ws)
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
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
    }
  }, [setSocket]);

  useEffect(() => {
    handleConnection()
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        setSocket(null);
      }
    }
  }, [handleConnection, setSocket])

  const handleAIAssist = () => {
    const aiSuggestions = [
      "Anyone fancy trying that new IPA they just got in? 🍻",
      "How about we plan a pub crawl for next weekend? 🚶‍♂️🍺🚶‍♀️",
      "Did you hear about the new karaoke night starting next week? 🎤🎶",
    ]
    setInputText(aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)])
  }

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl shadow-md transition-all duration-300 p-4 space-y-4">
      <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto">
        {messages.length === 0
          ? (
            <div>
              <p className="text-center text-fuchsia-500">No messages yet</p>
            </div>
          )
          : (<ScrollArea className="space-y-4">
            {messages.map((msg, index) => (
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
            ))}
          </ScrollArea>)}
      </div>
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
            onClick={handleAIAssist}
            variant="outline"
            size="icon"
            className="text-fuchsia-500 border-fuchsia-300 hover:bg-fuchsia-100 rounded-full transition-all duration-300"
          >
            <Sparkles className="h-5 w-5" />
            <span className="sr-only">AI assist</span>
          </Button>
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


