"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, MeshTransmissionMaterial } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Play, Square, Loader2 } from "lucide-react"
import type * as THREE from "three"

function OptimizedGlassCube({ position = [0, 0, 0], scale = 1 }: { position: number[]; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current) return

    const t = state.clock.getElapsedTime()
    const animationIntensity = 0.3

    meshRef.current.rotation.x = Math.sin(t / 4) * animationIntensity
    meshRef.current.rotation.y = Math.sin(t / 2) * animationIntensity
    meshRef.current.position.y = position[1] + Math.sin(t / 3) * (animationIntensity * 0.7)
    meshRef.current.position.x = position[0] + Math.sin(t / 4) * (animationIntensity * 0.7)
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.5}
        roughness={0.05}
        clearcoat={0.1}
        clearcoatRoughness={0.1}
        transmission={0.95}
        ior={1.5}
        chromaticAberration={0.06}
        anisotropy={0.1}
        distortion={0.4}
        distortionScale={0.3}
        temporalDistortion={0.1}
        metalness={0.1}
        attenuationColor="#fff"
        color="#8b5cf6"
        attenuationDistance={0.2}
        opacity={0.8}
      />
    </mesh>
  )
}

function ExportScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.1} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[5, 5, 0]} intensity={0.5} color="#8b5cf6" />

      <OptimizedGlassCube position={[3, -1, -5]} scale={2.5} />
      <OptimizedGlassCube position={[-3, 2, -8]} scale={3} />
      <OptimizedGlassCube position={[-5, -3, -10]} scale={4} />
      <OptimizedGlassCube position={[4, 3, -7]} scale={2} />
      <OptimizedGlassCube position={[-2, -2, -6]} scale={1.5} />

      <Environment preset="night" />
    </>
  )
}

export default function BackgroundExporter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(10) // seconds
  const [quality, setQuality] = useState<"high" | "medium" | "low">("medium")

  const startRecording = async () => {
    if (!canvasRef.current) return

    try {
      setIsRecording(true)
      setRecordedBlob(null)

      // Get canvas stream
      const stream = canvasRef.current.captureStream(30) // 30 FPS

      // Set up MediaRecorder with appropriate settings
      const options = {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: quality === "high" ? 5000000 : quality === "medium" ? 2500000 : 1000000,
      }

      mediaRecorderRef.current = new MediaRecorder(stream, options)
      const chunks: BlobPart[] = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        setRecordedBlob(blob)
        setIsRecording(false)
        setIsProcessing(false)
      }

      mediaRecorderRef.current.start()

      // Stop recording after specified duration
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          setIsProcessing(true)
          mediaRecorderRef.current.stop()
        }
      }, duration * 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      setIsRecording(false)
      setIsProcessing(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      setIsProcessing(true)
      mediaRecorderRef.current.stop()
    }
  }

  const downloadVideo = () => {
    if (!recordedBlob) return

    const url = URL.createObjectURL(recordedBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lyxai-background-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const convertToMp4 = async () => {
    if (!recordedBlob) return

    // Note: This would require a conversion service or library like FFmpeg.wasm
    // For now, we'll just download the WebM file
    alert("MP4 conversion would require additional processing. Downloading WebM format instead.")
    downloadVideo()
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">3D Background Exporter</h1>
          <p className="text-gray-400">Export the animated 3D background from the LyxAI homepage as a video file.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Canvas */}
          <div className="space-y-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                  <Canvas ref={canvasRef} camera={{ position: [0, 0, 10], fov: 45 }} dpr={2} className="w-full h-full">
                    <ExportScene />
                  </Canvas>

                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Recording</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                    disabled={isRecording}
                  />
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quality</label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as "high" | "medium" | "low")}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
                    disabled={isRecording}
                  >
                    <option value="low">Low (1 Mbps)</option>
                    <option value="medium">Medium (2.5 Mbps)</option>
                    <option value="high">High (5 Mbps)</option>
                  </select>
                </div>

                {/* Recording Controls */}
                <div className="flex gap-2">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={isProcessing}
                    >
                      <Play size={16} className="mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} className="flex-1 bg-gray-600 hover:bg-gray-700">
                      <Square size={16} className="mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {isProcessing && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    <span>Processing video...</span>
                  </div>
                )}

                {/* Download Controls */}
                {recordedBlob && (
                  <div className="space-y-2 pt-4 border-t border-gray-700">
                    <p className="text-sm text-green-400">✓ Recording complete!</p>
                    <div className="flex gap-2">
                      <Button onClick={downloadVideo} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        <Download size={16} className="mr-2" />
                        Download WebM
                      </Button>
                      <Button onClick={convertToMp4} variant="outline" className="flex-1">
                        Convert to MP4
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-400">
                <p>1. Adjust the duration and quality settings above</p>
                <p>2. Click "Start Recording" to begin capturing the animation</p>
                <p>3. The recording will automatically stop after the specified duration</p>
                <p>4. Download the video file when processing is complete</p>
                <p className="text-yellow-400 mt-4">
                  Note: The exported video will be in WebM format. For MP4 conversion, additional processing is
                  required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
