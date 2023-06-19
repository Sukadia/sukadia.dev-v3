"use client"

import { JSX, useEffect, useState } from "react"
import dynamic from "next/dynamic"

import Loading from "./loading"
import ParameterPanel from "./ParameterPanel"

const BabylonScene = dynamic(() => import(`./BabylonScene`), { ssr: false })

export default function Sp(props: JSX.IntrinsicAttributes) {
  const [loaded, setLoaded] = useState(false)

  // Execute setLoaded(true) on the client side immediately after
  // HomePage() is rendered. This will change the state and trigger
  // re-render of HomePage().

  // We want the immediate re-rendering to happen because
  // 1) first time (back when `loaded === false` was true) when we render
  // we ddon't render BabylonScene component at all
  // (see `loaded && ...` line below) and so the page *renders completely*
  // (and, hopefully, on the server) except with no Babylon.js scene/stuff
  // on it (crawlers, bots, page speed analysers will love that!).
  // 2) rendering it for the second time immediately after, we will actually
  // render BabylonScene component, and so BabylonScene.render() will add the
  // canvas node to the DOM tree and BabylonScene.componentDidMount() will
  // execute all our Babylon {engine, scene, cameras, light, etc} setup on
  // the client side immediately after the component (canvas element)
  // is mounted to the DOM.
  useEffect(() => {
    setLoaded(true)
    ParameterPanel()
  },[])

  return (
    <main>
        <div id="TweakPane" className="fixed top-2.5 right-2.5"></div>
        {loaded && <BabylonScene {...props} />}
        {!loaded && <Loading></Loading>}
    </main>
  )
}