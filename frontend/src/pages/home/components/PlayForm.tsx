import { Button } from '@/common/components/ui/Button'
import { Input } from '@/common/components/ui/Input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/common/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import DoorIcon from '@/common/assets/door-icon.svg'
import ControllerIcon from '@/common/assets/controller-icon.svg'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {User2 } from 'lucide-react'

type Props = {}

const formSchema = z.object({
    nickname: z.string().min(2).max(50),
})

const PlayForm = (props: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nickname: "User8744",
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        console.log({ values })
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-[50%]">
                <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                        <FormItem className='flex items-center text-slate-400'>
                            <FormLabel className='flex items-center gap-3 mt-2'>
                                <div >
                                    <User2 size={28} strokeWidth={2} color={'#22A699'} />
                                </div>
                                <div className='mr-3 text-lg font-bold text-primaryTextColor'>
                                    NICKNAME                      
                                </div>
                            </FormLabel>
                            <FormControl >
                                <Input {...field} className={'font-bold text-lg mb-3 border-primaryTextColor border-2'} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex gap-3'>
                <Button type='submit' variant="opacityHover" className='gap-4 mt-2 rounded-full border-8 border-black font-black bg-[#22A699] p-5'>
                    <img src={DoorIcon} alt="" className='w-[20%]' />
                    <p>
                    ROOMS
                    </p>                    
                </Button>

                <Button type='submit' variant="opacityHover" className='gap-4 mt-2 rounded-full border-8 border-black font-black bg-[#FFE569] p-5'>
                    <img src={ControllerIcon} alt="" className='w-[25%]' />
                    <p>
                    ROOMS
                    </p>                    
                </Button>
                </div>
                
            </form>
        </Form>

    )
}

export default PlayForm