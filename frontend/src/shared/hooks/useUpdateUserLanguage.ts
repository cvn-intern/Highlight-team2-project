import { useMutation } from "@tanstack/react-query";
import userService from "../services/userService";
import { useUserStore } from "../stores/userStore";
import useToaster from "./useToaster";
import { useTranslation } from "react-i18next";

export const useUpdateUserLanguage = () => {
  const { setLanguage } = useUserStore();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: userService.updateLanguage,
    onSuccess: ({ data }) => {
      setLanguage(data.language_code);
      useToaster({
        type: "success",
        message: t("toastMessage.success.updateLanguage"),
      });
    },
    onError: ({ error }) => {
      alert(error);
    },
  });
};
