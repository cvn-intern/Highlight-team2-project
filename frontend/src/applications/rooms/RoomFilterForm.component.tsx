import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/shadcn-ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_LENGHT_OF_SEARCH } from "@/shared/constants";
import { Input } from "@/shared/components/shadcn-ui/Input";
import { Book, Globe, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/shadcn-ui/select";
import useToaster from "@/shared/hooks/useToaster";
import roomService from "@/shared/services/roomService";
import RoomsTitle from "@/shared/assets/rooms-title.png";
import themeService from "@/shared/services/themeService";
import { debounce } from "lodash";



interface Theme {
    id: number;
    name: string;
    thumbnail: string;
}

const formSchema = z.object({
    searchInput: z.string().trim().max(50),
    theme: z.string(),
    language: z.string({
        required_error: "Please select an language.",
    }),
});

interface SelectCodeRoomProps {
    setRoomFilterData: (data: RoomList[]) => void;
}

const RoomFilterForm: React.FC<SelectCodeRoomProps> = ({ setRoomFilterData }) => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [themesData, setThemesData] = useState<Theme[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            searchInput: "",
            theme: "all",
            language: "en",
        },
    });

    const fetchThemesData = async () => {
        try {
            const { data } = await themeService.getThemes();
            setThemesData(data);
        } catch (error) {
            useToaster({
                type: "error",
                message: "Error fetching themes data!",
            });
        }
    };
    const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
        try {
            const { data: roomFilterData } = await roomService.filterRooms(
                formData.theme,
                formData.language,
                formData.searchInput
            );
            setRoomFilterData(roomFilterData);
        } catch (error) {
            useToaster({
                type: "error",
                message: "Error fetching rooms data!",
            });
        }
    };

    const debounceHandleSubmit = useCallback(debounce(handleSubmit, 300), []);

    useEffect(() => {
        debounceHandleSubmit(form.getValues());
    }, []);

    useEffect(() => {
        fetchThemesData();
        debounceHandleSubmit(form.getValues());
    }, [searchInput]);

    const handleDropdownChange = () => {
        debounceHandleSubmit(form.getValues());
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full flex flex-col md:flex-row items-center justify-between my-3"
            >
                <div className="flex items-center ml-12 md:ml-32">
                    <FormField
                        control={form.control}
                        name="searchInput"
                        render={({ field }) => {
                            return (
                                <FormItem className="max-lg:flex-col text-slate-400">
                                    <div className="relative flex flex-col">
                                        <FormControl className="relative">
                                            <>
                                                <Input
                                                    {...field}
                                                    className={
                                                        "font-bold text-lg border-primaryTextColor border-2 h-12 rounded-xl pr-10"
                                                    }
                                                    maxLength={MAX_LENGHT_OF_SEARCH}
                                                    value={searchInput}
                                                    onChange={(e) => {
                                                        setSearchInput(e.target.value);
                                                        field.onChange(e.target.value);
                                                    }}
                                                />
                                                <Search className="absolute w-6 h-6 top-1/2 -translate-y-1/2 right-2" />
                                            </>
                                        </FormControl>
                                        <FormMessage className="text-xs absolute bottom-[-20px] 2xl:bottom-[-32px] left-0 w-[140%] 2xl:w-[120%] leading-4" />
                                    </div>
                                </FormItem>
                            );
                        }}
                    />
                </div>

                <img
                    src={RoomsTitle}
                    className="hidden ml-10 lg:block scale-90 md:scale-100"
                />

                <div className="flex items-center w-fit pl-10 mt-5 md:mt-0 lg:pl-0 lg:pr-5 mx-auto justify-between">
                    <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                            <FormItem className="max-lg:flex-col md:items-center text-slate-400 mr-10">
                                <FormLabel className="flex items-center gap-5">
                                    <div>
                                        <Book size={28} strokeWidth={2} color={"#22A699"} />
                                    </div>
                                    <div className="mr-3 text-lg font-bold text-primaryTextColor">
                                        THEMES
                                    </div>
                                </FormLabel>
                                <div className="relative flex flex-col">
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                handleDropdownChange();
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full h-12 text-lg font-bold border-none focus:ring-0 focus:ring-offset-0 rounded-xl">
                                                <SelectValue placeholder="Theme" />
                                            </SelectTrigger>
                                            <SelectContent className="text-lg font-bold">
                                                <SelectItem key={0} value="all">
                                                    ALL
                                                </SelectItem>
                                                {themesData?.map((theme) => (
                                                    <SelectItem key={theme.id} value={theme.name}>
                                                        {theme.name.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem className="  max-lg:flex-col md:items-center text-slate-400 mr-10">
                                <FormLabel className="flex items-center gap-3 ">
                                    <div>
                                        <Globe size={28} strokeWidth={2} color={"#22A699"} />
                                    </div>
                                    <div className="mr-3 text-lg font-bold text-primaryTextColor">
                                        LANGUAGE
                                    </div>
                                </FormLabel>
                                <div className="relative flex flex-col">
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                handleDropdownChange();
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="w-full h-12 text-lg font-bold border-none focus:ring-0 focus:ring-offset-0 rounded-xl">
                                                <SelectValue placeholder="Language" />
                                            </SelectTrigger>
                                            <SelectContent className="text-lg font-bold border-none ">
                                                <SelectItem value="en">EN</SelectItem>
                                                <SelectItem value="vi">VI</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
};

export default RoomFilterForm;