import React, { useEffect } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function CheckSocketDisconnectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const socketIsAvailable = socket && socket.connected;
  useEffect(() => {
    if (!socketIsAvailable) {
      navigate("/");
    }
  }, []);
  return children;
}
