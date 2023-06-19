"use client"
import Image from 'next/image'
import { MouseEvent, useState } from 'react'

import './style.scss'

interface CardProps {
  title: string,
  description: string,
  icon: string,
  link: string,
  shadow: string
}

export default function Card( props: CardProps ) {

  //w-[20rem] h-[8rem] on 4k screen
  return (
    <a className={`w-[20rem] h-[8rem] p-2 rounded-2xl bg-slate-800 shadow-lg shadow-slate-700 ${props.shadow} flex flex-col ease-out duration-300 hover:scale-105 hover:-translate-y-1 transition-all`}
    href={props.link} target="_blank">
      <div className="flex flex-row items-center gap-1 ml-2 h-[2rem] w-full rounded-2xl">
        <span className="text-l font-bold text-cyan-500">
          sukadia.dev
        </span>
        <span className="text-xl font-bold dark:text-white">
          / {props.title}
        </span>
      </div>

      <div className="flex flex-row h-full w-full overflow-clip">
        <div className="h-full aspect-square rounded-2xl relative">
          <div className="h-full w-full aspect-square relative rounded-2xl overflow-hidden">
            <Image
              fill={true}
              src={props.icon}
              alt="thumbnail"
              className=""
            />
          </div>
        </div>

        <div className="h-full w-full m-2 ml-4 rounded-2xl">
          <p>
            {props.description}
          </p>
        </div>
      </div>
    </a>
  );
}