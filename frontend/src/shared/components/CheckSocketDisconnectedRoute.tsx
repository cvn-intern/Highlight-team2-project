import React, { useEffect } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useNavigate, useParams } from "react-router-dom";
import roomService from "../services/roomService";

type Props = {
  children: React.ReactNode;
};

export default function CheckSocketDisconnectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const socketIsAvailable = socket && socket.connected;
  const { codeRoom } = useParams();

  useEffect(() => {
    if (!socketIsAvailable) {
      const getRoom = async (codeRoom: string) => {
        try {
          const { data } = await roomService.getRoom(codeRoom);
          
          if(data) {
            navigate(`/${codeRoom}/waiting`);
          }
        } catch (error: any) {
          alert(error.response.data.response);
          navigate("/")
        }
      }
      if (codeRoom) {
        getRoom(codeRoom);
      }
    }
  }, []);
  return children;
}
