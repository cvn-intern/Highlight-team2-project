// import { useMutation } from '@tanstack/react-query'
import { Button } from '../../common/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '../../common/components/ui/Avatar'
import { useExampleStore } from '../../common/stores/exampleStore'
import authService from '../../common/lib/services/authService'
import MainLayout from '@/common/layout/MainLayout'
import SloganImg from "@/common/assets/slogan.png"
import BannerImg from "@/common/assets/play-banner.png"
import AvatarImg from "@/common/assets/avatar.svg"
import Logo from '@/common/components/core/Logo'
import { User2, Edit2, DoorOpen } from 'lucide-react'
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
      <Logo />
      <img src={SloganImg} alt="" className='w-[300px] mt-5' />

      <div className='w-[80%] h-[70%] bg-white flex flex-col items-center mt-5'>
        <img src={BannerImg} className='my-5' />

        <div className='flex items-center gap-24'>
          <CustomAvatar />
          <PlayForm />
        </div>
      </div>
    </MainLayout>
  )
}

export default Homepage