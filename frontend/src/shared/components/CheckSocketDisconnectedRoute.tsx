import React, { useEffect } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useNavigate, useParams } from "react-router-dom";
import roomService from "../services/roomService";
import useToaster from "../hooks/useToaster";
import { ERROR_ICON } from "../constants";

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

          if (data) {
            navigate(`/${codeRoom}/waiting`);
          }
        } catch (error: any) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useToaster({
            type: "error",
            message: error.response.data.response || "Some error occurred!",
            bodyClassName: "text-lg font-semibold text-slate-600 text-center",
            icon: ERROR_ICON,
            progressStyle: {
              background:
                "linear-gradient(90deg, rgba(241,39,17,1) 0%, rgba(245,175,25,1) 100%)",
            },
          });
          navigate("/");
        }
      };
      if (codeRoom) {
        getRoom(codeRoom);
      }
    }
  }, []);
  return children;
}
