import React, { PureComponent } from "react"
import {
  ArcRotateCamera,
  Scene,
  Engine,
  WebGPUEngine,
  Vector3,
  ShaderStore,
  Color4
} from "@babylonjs/core"
import BabylonInteractivity from "./BabylonInteractivity"

/**
 * Babylon 3D Scene.
 */
export default class BabylonScene extends PureComponent {
  componentDidMount() {
    console.clear()
    this.setup(this.canvas)
  }

  setup = async (canvas: HTMLCanvasElement) => {
    ShaderStore.ShadersStoreWGSL["starsPixelShader"] = `
        uniform seed : f32;
        uniform density : f32;
        uniform brightness : f32;

        fn rand(seed : vec2<f32>) -> f32 {
            return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
        }

        @fragment
        fn main(input : FragmentInputs) -> FragmentOutputs {

            let random = rand(input.vUV*uniforms.seed);
            var brightness = 0.0;
            if (random < uniforms.density){
                brightness = random/uniforms.density*uniforms.brightness;
            }
            //fragmentOutputs.color = vec4(1., 1., 1., brightness);
            fragmentOutputs.color = vec4(brightness, brightness, brightness, 1.);
        }
    `

    ShaderStore.ShadersStoreWGSL["nebulasPixelShader"] = `
        var textureSampler: texture_2d<f32>;
        var textureSamplerSampler: sampler;

        uniform seed: f32;
        uniform color: vec4<f32>;
        uniform nebulascale: u32;
        uniform depth: u32;
        uniform intensity: f32;
        uniform falloff: f32;
        uniform persistence: f32;

        fn mod289(x: vec2<f32>) -> vec2<f32> {
            return x - floor(x * (1. / 289.)) * 289.;
        }
        
        fn mod289_3(x: vec3<f32>) -> vec3<f32> {
            return x - floor(x * (1. / 289.)) * 289.;
        }
        
        fn permute3(x: vec3<f32>) -> vec3<f32> {
            return mod289_3(((x * 34.) + 1.) * x);
        }
        
        //  MIT License. © Ian McEwan, Stefan Gustavson, Munrocket
        fn simplexNoise2(v: vec2<f32>) -> f32 {
            let C = vec4(
                0.211324865405187, // (3.0-sqrt(3.0))/6.0
                0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
                -0.577350269189626, // -1.0 + 2.0 * C.x
                0.024390243902439 // 1.0 / 41.0
            );
        
            // First corner
            var i = floor(v + dot(v, C.yy));
            let x0 = v - i + dot(i, C.xx);
        
            // Other corners
            var i1 = select(vec2(0., 1.), vec2(1., 0.), x0.x > x0.y);
        
            // x0 = x0 - 0.0 + 0.0 * C.xx ;
            // x1 = x0 - i1 + 1.0 * C.xx ;
            // x2 = x0 - 1.0 + 2.0 * C.xx ;
            var x12 = x0.xyxy + C.xxzz;
            x12.x = x12.x - i1.x;
            x12.y = x12.y - i1.y;
        
            // Permutations
            i = mod289(i); // Avoid truncation effects in permutation
        
            var p = permute3(permute3(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
            var m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3(0.));
            m *= m;
            m *= m;
        
            // Gradients: 41 points uniformly over a line, mapped onto a diamond.
            // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
            let x = 2. * fract(p * C.www) - 1.;
            let h = abs(x) - 0.5;
            let ox = floor(x + 0.5);
            let a0 = x - ox;
        
            // Normalize gradients implicitly by scaling m
            // Approximation of: m *= inversesqrt( a0*a0 + h*h );
            m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        
            // Compute final noise value at P
            let g = vec3(a0.x * x0.x + h.x * x0.y, a0.yz * x12.xz + h.yz * x12.yw);
            return 130. * dot(m, g);
        }

        fn normalNoise(v: vec2<f32>) -> f32 {
            return simplexNoise2(v)*0.5 + 0.5;
        }

        @fragment
        fn main(input : FragmentInputs) -> FragmentOutputs {
            let sampleColor = textureSample(textureSampler,textureSamplerSampler,fragmentInputs.vUV);

            var offset = 0.;
            let scaledUV = (input.vUV+offset+uniforms.seed)*f32(uniforms.nebulascale)/uniforms.scale;

            var displace = 0.;
            var i=u32(0);
            for (i=0; i<uniforms.depth; i++){
                displace = normalNoise(scaledUV*pow(uniforms.persistence,f32(i+1))+displace);
            }
            var finalTransparency = normalNoise(scaledUV+displace);
            finalTransparency = pow(max(finalTransparency+uniforms.intensity,0), uniforms.falloff);

            fragmentOutputs.color = mix(sampleColor,uniforms.color,finalTransparency);
        }
    `

    const engine = await this.createEngine(canvas)
    const scene = new Scene(engine)
    scene.clearColor = new Color4(0,0,0,0)
    const camera = new ArcRotateCamera("camera", 0, 0, 0, new Vector3(0, 0, 0), scene);

    BabylonInteractivity.initialize(canvas,engine,scene,camera)

    BabylonInteractivity.generateFrame()
  }

  createEngine = async (canvas: HTMLCanvasElement) => {
    let engine: WebGPUEngine | Engine
    if (await WebGPUEngine.IsSupportedAsync){
      engine = new WebGPUEngine(canvas)
      await (engine as WebGPUEngine).initAsync()
    }else{
      console.log("WebGPU is not supported (or turned on) for this browser!")
      engine = new WebGPUEngine(canvas)
    }
    return engine
  }

  id = "Babylon"
  canvas!: HTMLCanvasElement

  onMount = (canvas: HTMLCanvasElement) => (this.canvas = canvas)

  render() {
    return (
      <>
        <canvas id={this.id} ref={this.onMount} style={style} />
      </>
    )
  }
}

const style = { width: window.innerWidth, height: window.innerHeight, background: "transparent" }