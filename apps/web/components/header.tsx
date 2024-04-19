import { Button } from "@ui/components/button";
import { ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const bannerUrl = process.env.NEXT_PUBLIC_BANNER_URL;
  const bannerContent = process.env.NEXT_PUBLIC_BANNER_CONTENT;
  return (
    <div className="relative flex flex-col items-center w-full">
      {/* {bannerUrl && bannerContent && (
        <div className="absolute flex text-base bg-gradient-to-r to-orange-400 via-rose-500 from-rose-700 text-white w-full justify-center py-1 z-10">
          <Link
            href={bannerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Button variant="link" className="text-white">
              {bannerContent}
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
      )} */}
      <div className="flex flex-col items-center pt-28 space-y-4">
        <div className="flex space-x-4 items-center">
          <Bot className="w-20 h-20" />
          <h1 className="text-8xl font-bold">NQL</h1>
        </div>
        <div className="flex text-xl space-x-1">
          <h4>Supercharge data analytics with the power of</h4>
          <h4 className="z-10 font-bold bg-gradient-to-r to-orange-400 via-rose-400 from-rose-600 text-transparent bg-clip-text animate-gradient">
            Generative AI
          </h4>
          {/* <div className="absolute bg-primary/40 w-[106%] h-[5px] bottom-[3px] z-0 left-[-3%]" /> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
