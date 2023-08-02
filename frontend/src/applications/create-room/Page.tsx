import Logo from "@/shared/components/Logo";
import SloganImg from "@/shared/assets/slogan.png";
import MainLayout from "@/shared/components/MainLayout";
import CreateRoomsHeader from "./CreateRoomsHeader.component";
import CreateRoomsContent from "./CreateRoomsContent.component";

const CreateRooms = () => {
    return (
        <MainLayout>
            <div className="flex-col grid lg:w-[90%]">
                <Logo customClassname="justify-self-center max-lg:mt-12 mt-8 max-lg:hidden" />
                <img
                    src={SloganImg}
                    alt="Slogan"
                    className="justify-self-center slogan-width slogan-responsive w-[250px] 2xl:w-[300px] mt-2.5 2xl:mt-5"
                />
                <div className="justify-self-center w-[90%] lg:h-[90%] min-h-[70vh] bg-white flex flex-col items-center mb-5 mt-5 rounded-2xl p-8">
                    <CreateRoomsHeader />
                    <CreateRoomsContent />
                </div>
            </div>
        </MainLayout>
    );
};

export default CreateRooms;
