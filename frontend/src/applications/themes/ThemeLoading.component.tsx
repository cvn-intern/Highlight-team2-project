import MainLayout from "@/shared/components/MainLayout";
import Spinner from "@/shared/components/Spinner";

export default function ThemeLoading() {
  return (
    <MainLayout>
      <div className="w-[90%] lg:h-[90%] min-h-[70vh] bg-white mb-5 mt-5 rounded-2xl p-8 flex flexCenter">
        <Spinner />
      </div>
    </MainLayout>
  );
}
