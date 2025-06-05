import * as THREE from "three"

// Creates a material with a dot pattern that matches the mining machines
export function createDotPatternMaterial() {
  // Create a canvas to draw the dot pattern
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")

  if (!ctx) return new THREE.MeshBasicMaterial({ color: "#000000" })

  // Fill with dark background
  ctx.fillStyle = "#070711"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw dots
  ctx.fillStyle = "#1a1a2e"

  const spacing = 16
  for (let y = 0; y < canvas.height; y += spacing) {
    for (let x = 0; x < canvas.width; x += spacing) {
      // Randomly skip some dots for a more organic look
      if (Math.random() > 0.2) {
        const dotSize = 2 + Math.random() * 1
        ctx.beginPath()
        ctx.arc(x, y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  // Return material with the texture
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9,
  })
}
