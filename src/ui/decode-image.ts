// Decoding an image can be done by sticking it in an HTML
// canvas, as we can read individual pixels off the canvas.
interface DecodeParams {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  bytes: Uint8Array | ArrayBuffer
}

const decode = async (
  canvas: DecodeParams['canvas'],
  ctx: DecodeParams['ctx'],
  bytes: DecodeParams['bytes']
): Promise<ImageData> => {
  let blobPart: BlobPart
  if (bytes instanceof Uint8Array) {
    if (bytes.buffer instanceof ArrayBuffer) {
      // If the buffer is ArrayBuffer, use a sliced copy to avoid referencing SharedArrayBuffer
      blobPart = bytes.slice().buffer
    } else {
      // Copy to a new ArrayBuffer
      const ab = new ArrayBuffer(bytes.byteLength)
      new Uint8Array(ab).set(bytes)
      blobPart = ab
    }
  } else {
    blobPart = bytes
  }

  const url = URL.createObjectURL(new Blob([blobPart]));
  const image: HTMLImageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    img.src = url
  })
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, image.width, image.height)
  return imageData
}

export { decode }
