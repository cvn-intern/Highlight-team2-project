import { Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";
import { useTranslation } from "react-i18next";

const ThemeHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleBackButton = () => {
    navigate("/rooms/create-room");
  };
  useDisableBackButton();
  return (
    <div className="flex justify-between lg:w-full w-[70%]">
      <div>
        <button onClick={handleBackButton}>
          <Triangle
            size={40}
            strokeWidth={2.5}
            className="-rotate-90 fill-[#f7b733] hover:opacity-80"
          />
        </button>
      </div>
      <div className="w-full text-center max-lg:mt-2 lg:mr-10">
        <p className="text-2xl lg:text-5xl font-balsamiq text-sky-600">
          {t("CreateTheme.createThemeLabel")}
        </p>
      </div>
    </div>
  );
};

export default ThemeHeader;
