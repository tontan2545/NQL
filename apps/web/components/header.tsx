import { Button } from "@ui/components/ui/button";
import { ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex text-base bg-gradient-to-r to-orange-400 via-rose-600 from-rose-700 text-white w-full justify-center py-1">
        <Link
          href="https://web.facebook.com/ISEopenhouse/posts/pfbid02LydzRUfsJdg7w2YtNeysMMK33rvyZ597WwG4EFYmvVJMk9Yj55Q4rMTxTZpyNRHjl"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Button variant="link" className="text-white">
            ISE Open House 2023 is back! Save the date and join us on November
            11th, 2023, at the Faculty of Engineering, Chulalongkorn University.
            <ArrowRight
              className="w-4 h-4 ml-[6px]
                transition-transform
                group-hover:translate-x-1
                group-hover:scale-x-125
                group-hover:scale-y-110"
            />
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center pt-20 space-y-4">
        <div className="flex relative space-x-4 items-center">
          <Bot className="w-20 h-20" />
          <h1 className="text-8xl font-bold">NQL</h1>
        </div>
        <div className="flex text-xl space-x-1">
          <h4>Supercharge data analytics with the power of</h4>
          <div className="relative">
            <h4 className="z-10 font-semibold italic">Generative AI</h4>
            {/* <div className="absolute bg-primary/40 w-[106%] h-[5px] bottom-[3px] z-0 left-[-3%]" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
