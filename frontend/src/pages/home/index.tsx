// import { useMutation } from '@tanstack/react-query'
import BannerImg from "@/common/assets/play-banner.png"
import SloganImg from "@/common/assets/slogan.png"
import Logo from '@/common/components/core/Logo'
import MainLayout from '@/common/layout/MainLayout'
import CustomAvatar from './components/CustomAvatar'
import PlayForm from './components/PlayForm'


const Homepage = () => {
  // const {value} = useExampleStore()

  // const {mutate: login} = useMutation({
  //   mutationFn: async (input: LoginInputType) => {
  //     const {data} = await authService.login(input)

  //     return data
  //   },
  //   onSuccess: (data) => {
  //     console.log(data)
  //   },
  //   onError: (error) => {
  //     console.log({error})
  //   }
  // })


  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Logo />
        <img src={SloganImg} alt="" className='w-[300px] mt-5' />

        <div className='w-[80%] h-[70%] bg-white flex flex-col items-center mt-5'>
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
