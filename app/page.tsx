"use client"
import { MouseEvent, useRef, useState } from 'react'

import './style.scss'
import Card from './Card'

let dotHoldSound: ReturnType<typeof setTimeout>

export default function Home() {
  const [clickedOption, setOption] = useState("")
  const sound = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("audio/the-fabled-period-button.mp3") : undefined
  ).current

  let sukadiaClick = (e: MouseEvent<HTMLDivElement>) => {
    setOption(clickedOption == "sukadia" ? "" : "sukadia")
  }

  let dotclickcount = 0
  let dotHoldSecret: ReturnType<typeof setTimeout>
  let dotClick = (e: MouseEvent<HTMLDivElement>) => {
    setOption(clickedOption == "." ? "" : ".")
    dotclickcount++
    let currentclick = dotclickcount
    //TODO: Want it to be based off pushed-downness, if already pushed down it still needs to wait
    dotHoldSound = setTimeout(() => {
      if (dotclickcount == currentclick){
        (sound?.cloneNode() as any).play()
      }
    }, 100)
  }

  let dotLeave = (e: MouseEvent<HTMLDivElement>) => {
    //BUG: Stays held down since onMouseUp doesn't capture when it happens not over the element
    setOption("")
    clearTimeout(dotHoldSound)
  }

  let devClick = (e: MouseEvent<HTMLDivElement>) => {
    setOption(clickedOption == "dev" ? "" : "dev")
  }

  return (
    <main className="select-none">
      <div className='flex flex-col items-center h-screen overflow-hidden'>
        <div className={
        (clickedOption == "sukadia" || clickedOption == "dev" ? "-translate-y-24"
        : "")
        + " flex flex-row w-screen items-center justify-center overflow-hidden text-6xl min-[437px]:text-7xl min-[577px]:text-8xl md:text-9xl m-auto transition-all duration-500 z-20"
        }>
          <div className="overflow-hidden flex-shrink" onMouseDown={sukadiaClick}>
            <div id="sukadia" className={
            (clickedOption == "sukadia" ? "maintitle-pressed top-2"
            : "maintitle hover:-translate-y-0.5")
            + ' transition-all hover:m-2'}>
              sukadia
            </div>
          </div>
          <div className="overflow-hidden flex-shrink" onMouseDown={dotClick} onMouseUp={dotLeave}>
            <div id="." className={
            (clickedOption == "." ? "maintitle-pressed top-2"
            : "maintitle hover:-translate-y-0.5")
            + ' transition-all hover:m-2'}>
              .
            </div>
          </div>
          <div className="overflow-hidden flex-shrink" onMouseDown={devClick}>
            <div id="dev" className={
            (clickedOption == "dev" ? "maintitle-pressed top-2"
            : "maintitle hover:-translate-y-0.5")
            + ' transition-all hover:m-2'}>
              dev
            </div>
          </div>
        </div>
      </div>

      {/* //TODO: Text on mobile is scaled up overall, too big for cards */}

      <div className={
      (clickedOption == "sukadia" ? ""
      : "pointer-events-none")
      + " flex flex-col items-center absolute h-1/2 p-4 mt-4 -translate-y-4 inset-x-0 top-1/2 overflow-y-auto overflow-x-hidden"
      }>
        <li className={
        (clickedOption == "sukadia" ? "opacity-100 z-10"
        : "opacity-0 pointer-events-none -translate-y-12 z-1")
        + " flex flex-wrap flex-row items-center justify-center w-3/5 max-w-[1200px] gap-8 transition-all duration-500"
        }>
          <Card
            title="Youtube"
            description="Lots of VRChat videos focusing on roleplay."
            icon="/images/YoutubeIcon.png"
            link="/youtube"
            shadow="shadow-red-950"
          />
          <Card
            title="Twitch"
            description="Occasional streams for whatever seems fun at the moment."
            icon="/images/TwitchIcon.png"
            link="/twitch"
            shadow="shadow-violet-950"
          />
          <Card
            title="Discord"
            description="The hub for all my socials & projects. Join to stay updated!"
            icon="/images/DiscordIcon.png"
            link="/discord"
            shadow="shadow-blue-900"
          />
          <Card
            title="Ko-fi"
            description="Support me monthly to help me make more content."
            icon="/images/KofiIcon.png"
            link="/ko-fi"
            shadow="shadow-sky-900"
          />
        </li>
      </div>

      <div className={
      (clickedOption == "dev" ? ""
      : "pointer-events-none")
      + " flex flex-col items-center absolute h-1/2 p-4 mt-4 -translate-y-4 inset-x-0 top-1/2 overflow-y-auto overflow-x-hidden"
      }>
        <li className={
        (clickedOption == "dev" ? "opacity-100 z-10"
        : "opacity-0 -translate-y-12 z-0")
        + " flex flex-wrap flex-row items-center justify-center w-3/5 max-w-[1200px] gap-8 transition-all duration-500"
        }>
          <Card
            title="Everyone-Votes"
            description="A Discord bot that sends and tallies daily polls from thousands of servers."
            icon="/images/EveryoneVotesIcon.png"
            link="/everyone-votes"
            shadow="shadow-blue-900"
          />
          <Card
            title="Space"
            description="A WebGPU space/nebula image generator with lots of parameters to modify."
            icon="/images/SpaceIcon.png"
            link="/space"
            shadow="shadow-violet-950"
          />
          <Card
            title="Dark"
            description="A VSCode color theme based off of Brackets Dark."
            icon="/images/DarkIcon.png"
            link="/dark"
            shadow="shadow-yellow-950"
          />
        </li>
      </div>
    </main>
  )
}