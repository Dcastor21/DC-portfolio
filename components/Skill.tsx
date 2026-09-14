import React from "react";
import { motion } from "framer-motion";
import { Skill as mySkill } from "../typings";
import { imageUrl } from "../lib/image";

type Props = {
  skill: mySkill;
  directionLeft?: boolean;
};

const DEVICON_COLORS: Record<string, string> = {
  typescript: "#3178c6",
  react: "#61dafb",
  nextjs: "#111111",
  tailwind: "#06b6d4",
  tailwindcss: "#06b6d4",
  nodejs: "#339933",
  postgresql: "#336791",
  docker: "#2496ed",
};

export default function Skill({ skill, directionLeft }: Props) {
  const iconColor =
    skill.iconStyle === "color"
      ? DEVICON_COLORS[skill.devicon ?? ""] ?? "currentColor"
      : "#4b5563";

  return (
    <div className="group relative flex cursor-pointer">
      {skill.devicon ? (
        <motion.i
          initial={{ x: directionLeft ? -80 : 80, opacity: 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className={`devicons devicons-${skill.devicon} flex items-center justify-center rounded-full border-2 border-darkGreen text-5xl md:text-6xl lg:text-6xl xl:text-6xl 2xl:text-7xl filter group-hover:grayscale transition duration-300 ease-in-out w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28`}
          style={{ color: iconColor }}
          role="img"
          aria-label={`${skill.title} logo`}
        />
      ) : (
        <motion.img
        initial={{ x: directionLeft ? -80 : 80, opacity: 0 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="rounded-full border-2 border-darkGreen object-cover w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 filter group-hover:grayscale transition duration-300 ease-in-out"
        src={imageUrl(skill?.image)}
        alt=""
      />
      )}
      <div className="absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 rounded-full z-0 overflow-hidden">
        <div className="flex items-center justify-center h-full px-1">
          <p className="text-[10px] md:text-xs font-bold text-black opacity-100 text-center leading-tight">
            {skill.title}
          </p>
        </div>
      </div>
    </div>
  );
}
