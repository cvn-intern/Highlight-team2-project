import GoldenKeyIcon from "@/shared/assets/icons/golden-key.svg"
import MainLayout from '../components/MainLayout'
import useDisableBackButton from "../hooks/useDisableBackButton"

const UserExistsInBrowserPage = () => {

  useDisableBackButton()

  return (
    <MainLayout>
      <div className='flex flex-col items-center justify-center gap-4 mt-[-160px]'>
        <img alt='' src={GoldenKeyIcon} className='w-[200px] object-cover' />
        <p className='text-2xl text-center sm:text-3xl md:text-4xl text-yellow-400 font-semibold'>You're already in the game in other browser!</p>
        <p className='text-base text-center sm:text-2xl text-[#EEEEEE] font-medium'>Please go back to that browser and continue the game!</p>
      </div>
    </MainLayout>
  )
}

export default UserExistsInBrowserPage