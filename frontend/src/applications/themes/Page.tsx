import Logo from "@/shared/components/Logo";
import { Triangle } from "lucide-react";

import SloganImg from "@/shared/assets/slogan.png";
import MainLayout from "@/shared/components/MainLayout";

const CreateThemePage = () => {

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center w-full">
                <Logo customClassname="max-md:mt-12" />
                <div className="relative bg-white flex flex-col items-center mb-5 w-[92%] xl:w-3/4 2xl:w-3/5 min-h-[70vh] mt-5 rounded-2xl pb-5">
                    <div className="flex justify-between lg:w-full w-[70%] p-4">
                        <div>
                            <button
                                onClick={()=>{}}
                            >
                                <Triangle
                                    size={40}
                                    strokeWidth={2.5}
                                    className="-rotate-90 fill-[#f7b733] hover:opacity-80"
                                />
                            </button>
                        </div>
                        <div className="w-full max-lg:mt-2 text-center lg:mr-10">
                            <p className="lg:text-4xl text-2xl font-balsamiq text-sky-600">
                                THEME LAB
                            </p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </MainLayout >
    );
};

export default CreateThemePage;