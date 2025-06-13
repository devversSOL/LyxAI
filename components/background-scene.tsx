"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

const BackgroundScene = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // === THREE.JS CODE START ===

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0) // Transparent background

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement)
    }

    const geometry = new THREE.TorusKnotGeometry(3, 1, 100, 16)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const torusKnot = new THREE.Mesh(geometry, material)
    scene.add(torusKnot)

    camera.position.z = 10

    const animate = () => {
      requestAnimationFrame(animate)

      torusKnot.rotation.x += 0.01
      torusKnot.rotation.y += 0.01

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    window.addEventListener("resize", handleResize)

    // === THREE.JS EXAMPLE CODE END ===

    return () => {
      window.removeEventListener("resize", handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }} ref={mountRef} />
  )
}

export default BackgroundScene
