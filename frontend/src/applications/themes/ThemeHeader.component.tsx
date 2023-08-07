import { Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import AlertDialogYesNo from "@/shared/components/AlertDialogYesNo";
import AlertIcon from "@/shared/components/icons/AlertIcon";

interface Props {
  wordsList?: WordType[];
  isCreate: boolean;
  isDirty: boolean;
}

const ThemeHeader = ({ wordsList = [], isCreate, isDirty }: Props) => {
  const wordsListIsEmpty = useMemo(() => wordsList.length === 0, [wordsList]);
  const showAlertConfirm =
    (isCreate && !wordsListIsEmpty) || (!isCreate && isDirty);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleBackButton = () => {
    navigate("/rooms/create-room");
  };
  useDisableBackButton();
  return (
    <div className="flex justify-between lg:w-full w-[70%]">
      <div>
        {showAlertConfirm && (
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
        {!showAlertConfirm && (
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
        <p className="lg:text-5xl text-2xl font-coiny bg-gradient-to-r from-[#2196f3] to-[#FFC371] text-transparent bg-clip-text pt-4">
          {t("CreateTheme.createThemeLabel")}
        </p>
      </div>
    </div>
  );
};

export default ThemeHeader;
