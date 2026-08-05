import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { imageUrl } from "../lib/image";
import { siteConfig } from "../config/site";
import { PageInfo } from "../typings";
import BackgroundCircles from "./BackgroundCircles";

type Props = { pageInfo: PageInfo };

export default function Hero({ pageInfo }: Props) {
  const [mounted, setMounted] = useState(false);
  const [text] = useTypewriter({
    words: [...siteConfig.roles],
    loop: true,
    delaySpeed: 2000,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden">
      <BackgroundCircles />

      <img
        className="relative rounded-full h-32 w-32 mx-auto object-cover"
        src={imageUrl(pageInfo?.heroImage)}
        alt=""
      />

      <div className="z-20">
        <h2 className="text-sm uppercase text-gray-500 pb-2 tracking-[10px] md:tracking-[15px]">
          {pageInfo?.role}
        </h2>
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-semibold px-10">
          <span className="mr-3">{mounted ? text : siteConfig.roles[0]}</span>
          {mounted && <Cursor cursorColor="#68B2A0" />}
        </h1>

        <div className="pt-5">
          <Link href="#about" className="heroButton">About</Link>
          <Link href="#experience" className="heroButton">Experience</Link>
          <Link href="#skills" className="heroButton">Skills</Link>
          <Link href="#projects" className="heroButton">Projects</Link>
        </div>
      </div>
    </div>
  );
}
