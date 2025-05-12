"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import io from "socket.io-client";

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  is_read: boolean;
  createdAt: string;
}

interface Room {
  id: number;
  name: string;
  customer_id: number;
  is_active: boolean;
  is_resolved: boolean;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export default function ChatRoom() {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Lấy thông tin user hiện tại từ token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:3001/chat", {
      path: "/socket.io",
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket");
      newSocket.emit("join_room", { data: { room_id: id } });
    });

    newSocket.on("chat_history", (data) => {
      setMessages(data.messages);
    });

    newSocket.on("new_message", (message) => {
      console.log("new_message", message);
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  const fetchRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/chat/rooms/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRoom(response.data);
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      socket.emit("message", {
        data: {
          room_id: id,
          content: newMessage,
        },
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  const handleMarkAsResolved = async () => {
    try {
      socket.emit("mark_as_resolved", {
        data: {
          room_id: id,
        },
      });
      toast.success("Đã đánh dấu phòng chat đã giải quyết");
    } catch (error) {
      console.error("Error marking room as resolved:", error);
      toast.error("Đánh dấu phòng chat thất bại");
    }
  };

  if (!room) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">
            Chat với {room.customer.first_name} {room.customer.last_name}
          </h2>
          <p className="text-gray-500">{room.customer.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={room.is_resolved ? "secondary" : "default"}>
            {room.is_resolved ? "Đã giải quyết" : "Đang hoạt động"}
          </Badge>
          {!room.is_resolved && (
            <Button onClick={handleMarkAsResolved}>
              Đánh dấu đã giải quyết
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.id === currentUser?.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender.id === currentUser?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p className="text-sm font-medium">
                {message.sender.id === currentUser?.id ? "Admin" : "Customer"}
              </p>
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Gửi</Button>
        </div>
      </div>
    </div>
  );
}
