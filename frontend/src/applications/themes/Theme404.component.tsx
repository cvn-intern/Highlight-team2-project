import MainLayout from "@/shared/components/MainLayout";
import { Ban } from "lucide-react";
import ThemeHeader from "./ThemeHeader.component";

export default function Theme404() {
  return (
    <MainLayout>
      <div className="justify-self-center w-[90%] lg:h-[90%] min-h-[70vh] bg-white flex flex-col items-center mb-5 mt-5 rounded-2xl p-8">
        <ThemeHeader isCreate={true} isDirty={true} />
        <div className="flex flex-col flex-1 gap-4 flexCenter">
          <Ban size={80} className="text-gray-400" />
          <p className="max-w-[600px] text-center text-gray-400 text-4xl font-semibold">
            Something went wrong! This theme is not founded!
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
