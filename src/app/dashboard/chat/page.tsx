"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ChatRoom {
  id: number;
  name: string | null;
  is_active: boolean;
  is_resolved: boolean;
  customer_id: number;
  createdAt: string;
  updatedAt: string;
}

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const router = useRouter();

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/chat/rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenChat = (roomId: number) => {
    router.push(`/dashboard/chat/${roomId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Danh sách phòng chat</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên phòng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.id}</TableCell>
              <TableCell>{room.name || "Phòng chat mới"}</TableCell>
              <TableCell>
                <Badge
                  variant={room.is_resolved ? "secondary" : "default"}
                  className="ml-2"
                >
                  {room.is_resolved ? "Đã giải quyết" : "Đang hoạt động"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(room.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleOpenChat(room.id)}>Mở chat</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 