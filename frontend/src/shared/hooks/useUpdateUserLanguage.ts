import { useMutation } from "@tanstack/react-query";
import userService from "../services/userService";
import { useUserStore } from "../stores/userStore";

export const useUpdateUserLanguage = () => {
  const { setLanguage } = useUserStore();
  return useMutation({
    mutationFn: userService.updateLanguage,
    onSuccess: ({ data }, language_code) => {
      // Do something here bro
      setLanguage(language_code);
    },
    onError: ({ error }) => {
      alert(error);
    },
  });
};
