import Logo from "@/shared/components/Logo";
import { Search, Triangle } from "lucide-react";
import MainLayout from "@/shared/components/MainLayout";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/shadcn-ui/select";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { Label } from "@/shared/components/shadcn-ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/shadcn-ui/radio-group";
import { Input } from "@/shared/components/shadcn-ui/Input";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import _ from "lodash";
import { InputWithSearchIcon } from "@/shared/components/shadcn-ui/InputWithSearchIcon";

const CreateThemePage = () => {
    const [numberOfWords, setnumberOfWords] = useState(0);
    const [hardWord, setHardWord] = useState(0);
    const [mediumWord, setMediumdWord] = useState(0);
    const [easyWord, setEasyWord] = useState(0);
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
                        <div className="bg-white w-[50%] rounded-2xl flex flex-col p-6 gap-y-12">
                            <div >
                                <p className="text-2xl mb-4">1. THEME NAME</p>
                                <Select>
                                    <SelectTrigger className="w-full border-slate-300 rounded-xl">
                                        <SelectValue placeholder="Select a fruit" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectGroup>
                                            <SelectLabel>Fruits</SelectLabel>
                                            <SelectItem value="apple">Apple</SelectItem>
                                            <SelectItem value="banana">Banana</SelectItem>
                                            <SelectItem value="blueberry">Blueberry</SelectItem>
                                            <SelectItem value="grapes">Grapes</SelectItem>
                                            <SelectItem value="pineapple">Pineapple</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-2xl mb-8">2. CREATE WORDS</p>
                                <p className="text-slate-400 mb-4">Add new words to the list</p>
                                <div className="flex gap-x-4 mb-8">
                                    <Input className="rounded-xl" />
                                    <Button className="rounded-xl">Button</Button>
                                </div>

                                <RadioGroup defaultValue="option-one" className="flex w-full justify-between px-3">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-one" id="option-one" />
                                        <Label htmlFor="option-one">Easy</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-two" id="option-two" />
                                        <Label htmlFor="option-two">Medium</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-three" id="option-three" />
                                        <Label htmlFor="option-three">Hard</Label>
                                    </div>
                                </RadioGroup>

                            </div>
                        </div>
                        <div className="bg-white w-full rounded-2xl p-5">
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
                                    <InputWithSearchIcon className="rounded-xl w-[60%]" placeholder="Search..."/>                                    
                                </div>
                            </div>
                            <div className="bg-slate-300 w-full">
                                skvskjvbkjwasbvk
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout >
    );
};

export default CreateThemePage;