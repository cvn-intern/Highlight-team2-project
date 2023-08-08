import { Ban } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Room404() {
    const { t } = useTranslation();
    return (
        <div className="bg-white p-2 rounded-2xl w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full">
            <div className="flex flex-col flex-1 gap-4 flexCenter">
                <Ban size={80} className="text-gray-400" />
                <p className="max-w-[600px] text-center text-gray-400 text-4xl font-semibold">
                    {t("RoomList.noRoom")}
                </p>
            </div>
        </div>
    );
}
