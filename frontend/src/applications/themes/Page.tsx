import Logo from "@/shared/components/Logo";
import { Triangle } from "lucide-react";

import SloganImg from "@/shared/assets/slogan.png";
import MainLayout from "@/shared/components/MainLayout";

const CreateThemePage = () => {
   
    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center w-full">
                <Logo customClassname="max-md:mt-12" />
                <img
                    src={SloganImg}
                    alt="Slogan"
                    className="slogan-width slogan-responsive w-[250px] 2xl:w-[300px] mt-2.5 2xl:mt-5"
                />
                <div className="relative bg-white flex flex-col items-center mb-5 w-[92%] xl:w-3/4 2xl:w-3/5 min-h-[70vh] mt-5 rounded-2xl pb-5">
                    <button
                        onClick={()=>{}}
                        className="left-1 mx-5 md:mr-10 absolute top-8 md:left-10"
                    >
                        <Triangle
                            size={40}
                            strokeWidth={2.5}
                            className="-rotate-90 fill-[#f7b733] hover:opacity-80"
                        />
                    </button>                                       
                </div>
            </div>
        </MainLayout >
    );
};

export default CreateThemePage;