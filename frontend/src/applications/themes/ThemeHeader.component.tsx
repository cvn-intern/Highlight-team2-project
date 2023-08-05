import { Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import AlertDialogYesNo from "@/shared/components/AlertDialogYesNo";
import AlertIcon from "@/shared/components/icons/AlertIcon";

interface Props {
  wordsList: WordType[];
}

const ThemeHeader = ({ wordsList }: Props) => {
  const wordsListIsEmpty = useMemo(() => wordsList.length === 0, [wordsList]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleBackButton = () => {
    navigate("/rooms/create-room");
  };
  useDisableBackButton();
  return (
    <div className="flex justify-between lg:w-full w-[70%]">
      <div>
        {!wordsListIsEmpty && (
          <AlertDialogYesNo
            buttonVariant={"link"}
            buttonClassName="bg-white flexCenter cursor-pointer w-full h-full rounded-none"
            onYesClick={handleBackButton}
            Icon={AlertIcon}
            confirmText="Yes"
            cancelText="No"
            alertMessage="Discard all change?"
            customButton={
              <button>
                <Triangle
                  size={40}
                  strokeWidth={2.5}
                  className="-rotate-90 fill-[#f7b733] hover:opacity-80"
                />
              </button>
            }
          />
        )}

        {wordsListIsEmpty && (
          <button onClick={handleBackButton}>
            <Triangle
              size={40}
              strokeWidth={2.5}
              className="-rotate-90 fill-[#f7b733] hover:opacity-80"
            />
          </button>
        )}
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
