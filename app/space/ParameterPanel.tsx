"use client"
import { Pane } from "tweakpane"
import BabylonInteractivity from "./BabylonInteractivity"

let pane : Pane

export default function ParameterPanel() {
    pane = new Pane({
        title: "Parameters",
        container: document.getElementById("TweakPane") || undefined
    })

    let canvasparameters = {width: window.innerWidth, height: window.innerHeight, transparent: false, autoupdate: false}
    let canvasfolder = pane.addFolder({
        title: "Canvas",
        expanded: true
    })
    canvasfolder.addInput(canvasparameters, "width", {min: 100, max: 7680, step: 1})
    canvasfolder.addInput(canvasparameters, "height", {min: 100, max: 4320, step: 1})
    canvasfolder.addInput(canvasparameters, "transparent")
    .on("change", () => {
        console.log(1)
        BabylonInteractivity.setTransparency(canvasparameters.transparent)
    })

    let starparameters = {density: 1.5, brightness: 100}
    let starfolder = pane.addFolder({
        title: "Stars",
        expanded: true
    })
    starfolder.addInput(starparameters, "density", {min:0, max: 10, step: 0.01, format: (value) => value.toFixed(2) + "%"})
    starfolder.addInput(starparameters, "brightness", {min: 0, max: 200, step: 0.1, format: (value) => value.toFixed(1) + "%"})

    let nebulaparameters = {count: 2, scale: 5, depth: 2, intensity: 100, falloff: 2, persistence: 0.5}
    let nebulafolder = pane.addFolder({
        title: "Nebula",
        expanded: true
    })

    nebulafolder.addInput(nebulaparameters, "count", {min: 0, max: 3, step: 1})
    .on("change", () => {
        if (nebulaparameters.count == 0){
            colorfolder.hidden = true
        }else{
            colorfolder.hidden = false
            for(let i=0; i<colorinputs.length; i++){
                if(i<nebulaparameters.count){
                    colorinputs[i].hidden = false
                }else{
                    colorinputs[i].hidden = true
                }
            }
        }
        pane.refresh()
    })

    interface rgbvalues {
        r: number,
        g: number,
        b: number
    }
    let colorparameters: Record<string,rgbvalues> = {}
    let colorfolder = nebulafolder.addFolder({
        title: "Colors",
        expanded: false
    })
    let colorinputs: any[] = []
    for (let i=0; i<3; i++){
        colorparameters["color"+(i+1) as keyof Object] = {r: Math.ceil(255*Math.random()), g: Math.ceil(255*Math.random()), b: Math.ceil(255*Math.random())}
        colorinputs.push(colorfolder.addInput(colorparameters, "color"+(i+1)))
        if(i>nebulaparameters.count-1){
            colorinputs[i].hidden = true
        }
    }

    nebulafolder.addInput(nebulaparameters, "scale", {min:1, max: 50, step: 1})
    nebulafolder.addInput(nebulaparameters, "depth", {min:0, max: 20, step: 1})
    nebulafolder.addInput(nebulaparameters, "intensity", {min:50, max: 150, step: 1, format: (value) => value + "%"})
    nebulafolder.addInput(nebulaparameters, "falloff", {min:1, max: 10, step: 0.1})
    nebulafolder.addInput(nebulaparameters, "persistence", {min:0, max: 1, step: 0.01})

    let seedparameters = {seed: "" + Math.floor(Math.random()*(Math.pow(10,12)))}
    let seedfolder = pane.addFolder({
        title: "Seed",
        expanded: false
    })
    seedfolder.addInput(seedparameters, "seed", {format: (value) => value.toFixed(0)})
    seedfolder.addButton({title: "Randomize seed"})
    .on("click", () => {
        seedparameters.seed = Math.floor(Math.random()*(10**12)).toString()
        pane.refresh()
        BabylonInteractivity.generateFrame()
    })

    pane.addSeparator()
    pane.addButton({title: "Render"})
    .on("click", () => {
        BabylonInteractivity.generateFrame()
    })
    pane.addButton({title: "Render Random"})
    .on("click", () => {
        seedparameters.seed = Math.floor(Math.random()*(Math.pow(10,12))).toString()
        for (let i=0; i<3; i++){
            colorparameters["color"+(i+1)] = {r: Math.ceil(255*Math.random()), g: Math.ceil(255*Math.random()), b: Math.ceil(255*Math.random())}
        }
        pane.refresh()
        BabylonInteractivity.generateFrame()
    })

    pane.addSeparator()

    pane.addButton({title: "Save Image"})
    .on("click", () => {
        BabylonInteractivity.exportFrame()
    })

    pane.addSeparator()

    pane.addInput(canvasparameters,"autoupdate")

    pane.on("change",(event) => {
        let changedvalue = event.presetKey

        if (canvasparameters.autoupdate){
            if (changedvalue == "width" || changedvalue == "height"){
                BabylonInteractivity.resizeFrame(canvasparameters.width,canvasparameters.height)
            }
            BabylonInteractivity.generateFrame()
        }
    })
}

export function getParameters(){
    return pane.exportPreset()
}