import MainLayout from '../components/MainLayout'
import NotFoundImg from "@/shared/assets/404-not-found.png"

const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className='flex flex-col items-center justify-center gap-4 mt-[-160px]'>
        <img alt='' src={NotFoundImg} className='w-[600px] object-cover'/>
        <p className='text-2xl text-center sm:text-4xl md:text-5xl mt-[-60px] sm:mt-[-110px] text-yellow-400 font-semibold'>Look like you're lost!</p>
        <p className='text-lg text-center md::text-2xl text-[#EEEEEE] font-medium'>The page you are looking for not available!</p>
      </div>
    </MainLayout>
  )
}

export default NotFoundPage