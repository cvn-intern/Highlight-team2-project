import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { Input } from "@/shared/components/shadcn-ui/Input";
import { InputWithSearchIcon } from "@/shared/components/shadcn-ui/InputWithSearchIcon";
import { Label } from "@/shared/components/shadcn-ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/shadcn-ui/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/shadcn-ui/select";
import { cn } from "@/shared/lib/utils";
import { RadioGroupIndicator } from "@radix-ui/react-radio-group";
import _ from "lodash";
import { Circle, Inbox, LogOut, Plus, Settings, Triangle } from "lucide-react";
import { useEffect, useState } from "react";

const CreateThemePage = () => {
    const handleEnterWord = (key: string = "Enter") => {
        if (key == "Enter" && newWord != "") {
            setAddedWords(addedWords => [...addedWords, newWord]);
            setNewWord("");
            console.log(addedWords);
        }
    }
    const [numberOfWords, setnumberOfWords] = useState(0);
    const [hardWord, setHardWord] = useState(0);
    const [mediumWord, setMediumdWord] = useState(0);
    const [easyWord, setEasyWord] = useState(0);
    const [newWord, setNewWord] = useState("");
    const [addedWords, setAddedWords] = useState<string[]>([]);

    const checkboxStyle = [
        {
            id: "easy",
            value: "easy",
            label: "Easy",
            color: "fill-green-500"
        },
        {
            id: "medium",
            value: "medium",
            label: "Medium",
            color: "fill-yellow-500"
        },
        {
            id: "hard",
            value: "hard",
            label: "Hard",
            color: "fill-red-500"
        }
    ]
    
    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center w-full">
                <Logo customClassname="max-md:mt-12" />
                <div className="p-5 relative bg-white flex flex-col items-center mb-5 w-[92%] xl:w-3/4 2xl:w-3/5 min-h-[70vh] mt-5 rounded-2xl pb-5">
                    <div className="flex justify-between lg:w-full w-[70%] mb-5">
                        <div>
                            <button
                                onClick={() => { }}
                            >
                                <Triangle
                                    size={40}
                                    strokeWidth={2.5}
                                    className="-rotate-90 fill-[#f7b733] hover:opacity-80"
                                />
                            </button>
                        </div>
                        <div className="w-full max-lg:mt-2 text-center lg:mr-10">
                            <p className="lg:text-4xl text-2xl font-balsamiq text-sky-600">
                                THEME LAB
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-300 h-full w-full flex p-3 items-center justify-between gap-x-4 rounded-2xl">
                        <div className="bg-white w-[50%] rounded-2xl flex flex-col p-6 gap-y-12 min-h-[45vh]">
                            <div >
                                <p className="text-2xl mb-4 font-semibold text-sky-600">1. THEME NAME</p>
                                <Select>
                                    <SelectTrigger className="w-full border-slate-300 rounded-xl">
                                        <SelectValue placeholder="Select one..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectGroup>
                                            <SelectLabel>Select one...</SelectLabel>
                                            <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="animals">Animals</SelectItem>
                                            <SelectItem value="bands">Bands</SelectItem>
                                            <SelectItem value="flags">Flags</SelectItem>
                                            <SelectItem value="foods">Foods</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-2xl mb-8 font-semibold text-sky-600">2. CREATE WORDS</p>
                                <p className="text-slate-400 mb-4">Add new words to the list</p>
                                <div className="flex gap-x-4 mb-8">
                                    <Input value={newWord} className="rounded-xl"
                                        onKeyDown={({ key }) => { handleEnterWord(key) }}
                                        onChange={({ target: { value } }) => { setNewWord(value) }} />
                                    <Button onClick={() => { handleEnterWord() }}
                                        className="rounded-xl disabled:bg-slate-500 bg-[#1B67AD] text-white"
                                        disabled={newWord == ""} variant="opacityHover">
                                        <Plus size={24} strokeWidth={3} className="mr-1" />
                                        <p>ADD</p>
                                    </Button>
                                </div>

                                <RadioGroup defaultValue={checkboxStyle[0].value}
                                    className="flex w-full justify-between px-3">
                                    {checkboxStyle.map((item) => (
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={item.value} id={item.id}>
                                                <RadioGroupIndicator>
                                                    <Circle className={cn("h-full w-full text-current", item.color)} />
                                                </RadioGroupIndicator>
                                            </RadioGroupItem>
                                            <Label htmlFor={item.id}>{item.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="bg-white w-full rounded-2xl p-5 min-h-[45vh]">
                            <div className="flex justify-between mb-5">
                                <div className="w-full flex justify-between">
                                    <div className="text-xl text-slate-500 font-bold flex items-center">{numberOfWords} WORDS CREATED</div>
                                    <div className="flex gap-x-5">
                                        {_.zip(
                                            [easyWord, mediumWord, hardWord],
                                            ["bg-green-500", "bg-yellow-500", "bg-red-500"]
                                        ).map((item) => (
                                            <div className="flex items-center gap-x-2">
                                                <span className={cn("relative inline-flex rounded-full h-3 w-3", item[1])}></span>
                                                <p>{item[0]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end w-full">
                                    <InputWithSearchIcon className="rounded-xl w-[60%]" placeholder="Search..." />
                                </div>
                            </div>
                            <div className="bg-slate-300 w-full h-full flex flex-col items-center px-5 py-24 text-slate-500 rounded-2xl">
                                <Inbox size={48} />
                                <p className="text-2xl font-bold text-center">
                                    NO WORDS WAS FOUND. PLEASE CREATE NEW WORDS FOR THIS THEME.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-7">
                        <Button
                            type="submit"
                            variant="opacityHover"
                            className="gap-4 md:mt-2 mt-5 rounded-full border-8 border-black font-black bg-[#C13A3A] p-5"
                            onClick={() => { }}
                        >
                            <LogOut size={32} />
                            <p>EXIT</p>
                        </Button>

                        <Button
                            type="submit"
                            variant="opacityHover"
                            className="gap-4 md:mt-2 mt-5 rounded-full border-8 border-black font-black bg-slate-300 p-5"
                            onClick={() => { }}
                        >
                            <Settings size={32} />
                            <p>SAVE</p>
                        </Button>
                    </div>

                </div>
            </div>
        </MainLayout >
    );
};

export default CreateThemePage;