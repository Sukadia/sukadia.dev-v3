import {
    ArcRotateCamera,
    Scene,
    Engine,
    WebGPUEngine,
    PostProcess,
    ShaderLanguage,
    Tools,
    Color4
  } from "@babylonjs/core"
import { getParameters } from "./ParameterPanel"

let canvas : HTMLCanvasElement
let engine : WebGPUEngine | Engine
let scene : Scene
let camera : ArcRotateCamera
let starshader : PostProcess
let nebulashaders : PostProcess[] = []

function hashString(string: String){
    var hash = 0, i, chr
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
function mulberry32(a : number) {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

let lastseed : String
let seednum : number

export default class BabylonInteractivity {

    public static generateFrame(){
        if (!canvas) return
        let starttime = performance.now()
        const parameters = getParameters() as any

        // Resize canvas if necessary
        if (canvas.width != parameters.width || canvas.height != parameters.height){
            this.resizeFrame(parameters.width,parameters.height)
        }

        // Only rehash seed if necessary
        if (lastseed != parameters.seed){
            seednum = mulberry32(hashString(parameters.seed))
            lastseed = parameters.seed
            console.log(1)
        }

        // Apply new parameters
        starshader.onApply = (effect) => {
            effect.setFloat("seed", seednum+5)
            effect.setFloat("density",parameters.density/100)
            effect.setFloat("brightness",parameters.brightness/100)
        }

        for (let i=0; i<nebulashaders.length; i++){
            camera.detachPostProcess(nebulashaders[i])
        }
        for (let i=0; i<parameters.count; i++){
            camera.attachPostProcess(nebulashaders[i])
            nebulashaders[i].onApply = (effect) => {
                effect.setFloat("seed", seednum*1000*(i+1))
                effect.setFloat4("color",parameters[`color${i+1}`].r/255,parameters[`color${i+1}`].g/255,parameters[`color${i+1}`].b/255,1)
                effect.setUInt("nebulascale",parameters.scale)
                effect.setUInt("depth",parameters.depth)
                effect.setFloat("intensity",parameters.intensity/100-1)
                effect.setFloat("falloff",parameters.falloff)
                effect.setFloat("persistence",parameters.persistence)
            }
            //BUG: Renders are delayed by one render
            nebulashaders[i].onApplyObservable.add((effect) => {
                effect.setTextureSampler("textureSamplerSampler", nebulashaders[i].inputTexture.texture)
            })
        }

        scene.onAfterRenderObservable.addOnce(() => {
            console.log(`Rendered in ${Math.round((performance.now()-starttime)*100)/100}ms`)
        })

        engine.beginFrame()
        scene.render()
        engine.endFrame()
    }

    public static resizeFrame(width: number,height: number){
        canvas.style.width = width.toString() + "px"
        canvas.style.height = height.toString() + "px"
        engine.resize()
    }

    public static async exportFrame(){
        const parameters = getParameters() as any
        Tools.CreateScreenshotUsingRenderTarget(engine,camera,{ width: canvas.width, height: canvas.height },
            undefined,undefined,undefined,undefined,`nebula-${parameters.seed}`)
        this.generateFrame()
    }

    public static setTransparency(bool: boolean){
        if (bool) scene.clearColor = new Color4(0,0,0,0)
        else scene.clearColor = new Color4(0,0,0,1)
    }
    
    public static initialize(newcanvas: HTMLCanvasElement, newengine: WebGPUEngine | Engine, newscene: Scene, newcamera: ArcRotateCamera){
        canvas = newcanvas
        engine = newengine
        scene = newscene
        camera = newcamera

        starshader = new PostProcess("StarShader","stars",null,null,1,camera,
            undefined,engine,true,undefined,undefined,undefined,undefined,undefined,undefined,ShaderLanguage.WGSL)
        camera.attachPostProcess(starshader)

        for (let i=0; i<10; i++){
            nebulashaders.push(new PostProcess("NebulaShader","nebulas",null,null,1,camera,
                undefined,engine,true,undefined,undefined,undefined,undefined,undefined,undefined,ShaderLanguage.WGSL))
        }
    }
}