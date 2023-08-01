import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import CreateRoomsHeader from "./CreateRoomsHeader.component";
import CreateRoomsContent from "./CreateRoomsContent.component";

const CreateRooms = () => {

    return (
        <MainLayout>
            <div className="flex-col grid lg:w-[80%] w-[80%]">                
                <Logo customClassname="justify-self-center max-lg:mt-12 mt-8" />
                <div className="justify-self-center w-[90%] lg:h-[90%] min-h-[70vh] bg-white flex flex-col items-center mb-5 mt-5 rounded-2xl p-8">
                    <CreateRoomsHeader />
                    <CreateRoomsContent />
                    
                </div>

            </div>
        </MainLayout>
    );
};

export default CreateRooms;
