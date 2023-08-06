import { useTranslation } from 'react-i18next'
import MainLayout from '../components/MainLayout'
import NotFoundImg from "@/shared/assets/404-not-found.png"

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <MainLayout>
      <div className='flex flex-col items-center justify-center gap-4 mt-[-160px]'>
        <img alt='' src={NotFoundImg} className='w-[600px] object-cover'/>
        <p className='text-2xl text-center sm:text-4xl md:text-5xl mt-[-60px] sm:mt-[-110px] text-yellow-400 font-semibold'>{t("NotFound.notFoundLabel")}</p>
        <p className='text-lg text-center md::text-2xl text-[#EEEEEE] font-medium'>{t("NotFound.notFoundDescription")}</p>
      </div>
    </MainLayout>
  )
}

export default NotFoundPage