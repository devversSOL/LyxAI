import Image from "next/image"

export default function ImageTest() {
  return (
    <div className="p-8 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold">Image Test Page</h1>

      <div className="border p-4 rounded">
        <h2 className="mb-2">Jupiter Logo (jupiter-logo-new.png)</h2>
        <div className="bg-gray-100 p-4 relative h-40 w-40">
          <Image src="/jupiter-logo-new.png" alt="Jupiter Logo" fill className="object-contain" priority />
        </div>
      </div>

      <div className="border p-4 rounded">
        <h2 className="mb-2">Direct Image Tag</h2>
        <div className="bg-gray-100 p-4">
          <img src="/jupiter-logo-new.png" alt="Jupiter Logo Direct" className="h-40 w-40 object-contain" />
        </div>
      </div>

      <div className="mt-8">
        <p>If you can see both images above, the file exists in your public folder.</p>
        <p>If not, there might be an issue with the file path or the file might not have been uploaded correctly.</p>
      </div>
    </div>
  )
}
