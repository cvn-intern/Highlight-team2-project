import React, { useEffect } from "react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useNavigate, useParams } from "react-router-dom";
import roomService from "../services/roomService";
import useToaster from "../hooks/useToaster";
import { useTranslation } from "react-i18next";

type Props = {
  children: React.ReactNode;
};

export default function CheckSocketDisconnectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const socketIsAvailable = socket && socket.connected;
  const { codeRoom } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (!socketIsAvailable) {
      const getRoom = async (codeRoom: string) => {
        try {
          const { data } = await roomService.getRoom(codeRoom);

          if (data) {
            navigate(`/${codeRoom}/waiting`);
          }
        } catch (error: any) {
          
          useToaster({
            type: "error",
            message: error.response.data.response || t("toastMessage.error.somethingWentWrong"),
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
