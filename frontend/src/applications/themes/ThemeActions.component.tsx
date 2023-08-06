import AlertDialogYesNo from "@/shared/components/AlertDialogYesNo";
import AlertIcon from "@/shared/components/icons/AlertIcon";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { Settings, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  handleCreateWordsCollection?: () => Promise<void>;
  handleUpdateWordsCollection?: () => Promise<void>;
  handleDeleteWordsCollection?: () => Promise<void>;
  isValidToCreateWordsCollection?: boolean;
  isCreate: boolean;
  isDirty: boolean;
  hasEnoughWords: boolean;
};

export default function ThemeActions({
  handleCreateWordsCollection,
  handleUpdateWordsCollection,
  handleDeleteWordsCollection,
  isValidToCreateWordsCollection,
  isCreate,
  isDirty,
  hasEnoughWords,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex max-xl:flex-col lg:gap-3 lg:my-5">
      {isCreate && (
        <div className="relative group">
          <Button
            type="button"
            variant="opacityHover"
            onClick={handleCreateWordsCollection}
            className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-[#22A699] py-5 w-[200px] uppercase text-lg"
            disabled={!isValidToCreateWordsCollection || !hasEnoughWords}
          >
            <Settings size={24} />
            <p>{t("CreateTheme.createThemeButton")}</p>
          </Button>
          {!hasEnoughWords && (
            <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[32px] px-2 py-1 rounded-[4px] border border-gray-400 w-max text-lg bg-sky-600 text-white hidden group-hover:block">
              You must have at least 15 words to create a theme
            </p>
          )}
        </div>
      )}
      {!isCreate && (
        <>
          <AlertDialogYesNo
            buttonVariant={"link"}
            buttonClassName="bg-white flexCenter cursor-pointer w-full h-full rounded-none"
            onYesClick={handleDeleteWordsCollection}
            Icon={AlertIcon}
            confirmText="Yes"
            cancelText="No"
            alertMessage="Are you sure you want to delete this theme? You cannot undo this action!"
            customButton={
              <Button
                type="button"
                variant="opacityHover"
                className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-red-600 py-5 w-[200px] uppercase text-lg"
              >
                <Trash2 size={24} />
                <p>{t("CreateTheme.deleteThemeButton")}</p>
              </Button>
            }
          />

          <div className="relative group">
            <Button
              type="button"
              variant="opacityHover"
              onClick={handleUpdateWordsCollection}
              className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-yellow-500 py-5 w-[200px] uppercase text-lg"
              disabled={!isDirty || !hasEnoughWords}
            >
              <Settings size={24} />
              <p>{t("CreateTheme.updateThemeButton")}</p>
            </Button>
            {!hasEnoughWords && (
              <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[32px] px-2 py-1 rounded-[4px] border border-gray-400 w-max text-lg bg-sky-600 text-white hidden group-hover:block">
                You must have at least 15 words to create a theme
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
