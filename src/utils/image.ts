export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result

      if (typeof result !== 'string') {
        reject(new Error('画像の読み込みに失敗しました'))
        return
      }

      // data:image/png;base64,xxxxx
      //                    ↑ この部分だけ取り出す
      const base64 = result.split(',')[1]

      if (!base64) {
        reject(new Error('Base64への変換に失敗しました'))
        return
      }

      resolve(base64)
    }

    reader.onerror = () => {
      reject(new Error('画像の読み込みに失敗しました'))
    }

    reader.readAsDataURL(file)
  })
}

export async function convertToPng(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)

  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvasを作成できませんでした')
  }

  context.drawImage(bitmap, 0, 0)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('PNGへの変換に失敗しました'))
      }
    }, 'image/png')
  })

  bitmap.close()

  const baseName = file.name.replace(/\.[^.]+$/, '')

  return new File(
    [blob],
    `${baseName}.png`,
    { type: 'image/png' }
  )
}