import BannerImg from "@/common/assets/play-banner.png"
import SloganImg from "@/common/assets/slogan.png"
import Logo from '@/common/components/core/Logo'
import MainLayout from '@/common/layout/MainLayout'
import PlayForm from "./PlayForm.component"
import CustomAvatar from "./CustomAvatar.component"


const Homepage = () => {
  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Logo />
        <img src={SloganImg} alt="" className='w-[300px] mt-5' />

        <div className='w-[80%] h-[70%] bg-white flex flex-col items-center mt-5 rounded-lg'>
          <img src={BannerImg} className='my-5' />

          <div className='flex items-center gap-24'>
            <CustomAvatar />
            <PlayForm />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Homepage;
