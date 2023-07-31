import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import CreateRoomsHeader from "./CreateRoomsHeader.component";
import CreateRoomsContent from "./CreateRoomsContent.component";

const CreateRooms = () => {

    return (
        <MainLayout>
            <div className="flex-col grid lg:w-[80%] w-[80%]">
                <Logo customClassname="justify-self-center max-lg:mt-12 md:w-[200px] 2xl:w-[250px] w-[150px]" />

                <div className="justify-self-center w-full lg:h-[70%] min-h-[70vh] bg-white flex flex-col items-center mb-5  h-[70%] mt-5 rounded-2xl p-8">
                    <CreateRoomsHeader />
                    <CreateRoomsContent />
                </div>
            </div>
        </MainLayout>
    );
};

export default CreateRooms;
