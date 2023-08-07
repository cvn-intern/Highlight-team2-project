/* eslint-disable react-hooks/rules-of-hooks */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/shadcn-ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import { z } from "zod";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_LENGHT_OF_SEARCH } from "@/shared/constants";
import { Input } from "@/shared/components/shadcn-ui/Input";
import { Book, Globe, Search } from "lucide-react";
import useToaster from "@/shared/hooks/useToaster";
import roomService from "@/shared/services/roomService";
import themeService from "@/shared/services/themeService";
import { useTranslation } from "react-i18next";

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

const RoomFilterForm: React.FC<SelectCodeRoomProps> = ({
  setRoomFilterData,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [themesData, setThemesData] = useState<Theme[]>([]);
  const { t } = useTranslation();

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
        message: t("toastMessage.error.fetchTheme"),
      });
    }
  };
  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      const { data: roomFilterData } = await roomService.getRoomsByQuery({
        theme: formData.theme,
        languageCode: formData.language,
        search: formData.searchInput,
      });
      setRoomFilterData(roomFilterData);
    } catch (error) {
      useToaster({
        type: "error",
        message: t("toastMessage.error.fetchRoom"),
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
        className="w-full flex flex-col md:flex-row items-center justify-between mt-3 md:mb-4 mb-[-1.5rem] md:gap-x-20"
      >
        <div className="flex items-center md:ml-12">
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
                            "font-bold text-lg border-primaryTextColor border-2 h-12 rounded-xl pr-10 w-[50vw] md:w-full"
                          }
                          maxLength={MAX_LENGHT_OF_SEARCH}
                          value={searchInput}
                          onChange={(e) => {
                            setSearchInput(e.target.value);
                            field.onChange(e.target.value);
                          }}
                        />
                        <Search className="absolute w-6 h-6 -translate-y-1/2 top-1/2 right-2" />
                      </>
                    </FormControl>
                    <FormMessage className="text-xs absolute bottom-[-20px] 2xl:bottom-[-32px] left-0 w-[140%] 2xl:w-[120%] leading-4" />
                  </div>
                </FormItem>
              );
            }}
          />
        </div>

        <p className="hidden lg:block text-7xl mx-auto font-coiny bg-gradient-to-r from-[#f7b733] to-[#0575E6] text-transparent bg-clip-text pt-5">
          {t("RoomList.roomLabel")}
        </p>

        <div className="flex items-center justify-center pl-10 mt-5 mr-auto w-fit max-md:w-full md:mt-0 lg:pl-0 lg:pr-5 md:justify-between">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="mr-10 max-lg:flex-col md:items-center text-slate-400">
                <FormLabel className="flex items-center gap-5">
                  <div>
                    <Book
                      size={28}
                      strokeWidth={2}
                      className="text-headerBlueColor"
                    />
                  </div>
                  <div className="mr-3 md:text-lg font-bold text-primaryTextColor">
                    {t("Theme.themeLabel")}
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
                      <SelectTrigger className="w-full h-12 md:text-lg font-bold border-none focus:ring-0 focus:ring-offset-0 rounded-xl">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent className="md:text-lg font-bold">
                        <SelectItem key={0} value="all">
                          {t("Theme.all")}
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
              <FormItem className="mr-10 max-lg:flex-col md:items-center text-slate-400">
                <FormLabel className="flex items-center gap-3 ">
                  <div>
                    <Globe
                      size={28}
                      strokeWidth={2}
                      className="text-headerBlueColor"
                    />
                  </div>
                  <div className="mr-3 md:text-lg font-bold text-primaryTextColor">
                    {t("Language.languageLabel")}
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
                      <SelectTrigger className="w-full h-12 overflow-hidden md:text-lg font-bold border-none focus:ring-0 focus:ring-offset-0 rounded-xl">
                        <span
                          className="inline-block w-full h-full overflow-hidden text-ellipsis"
                          style={{
                            maxWidth: "100%",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <SelectValue placeholder="Language" />
                        </span>
                      </SelectTrigger>
                      <SelectContent className="md:text-lg font-bold border-none">
                        <SelectItem value="en">
                          {t("Language.english")}
                        </SelectItem>
                        <SelectItem value="vi">
                          {t("Language.vietnamese")}
                        </SelectItem>
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
