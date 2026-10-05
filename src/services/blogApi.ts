const API_BASE_URL =
  'https://reito-blog-editor-api.guraburu48916.workers.dev'

export type ImagePayload = {
  path: string
  contentBase64: string
}

export type PreviewResult = {
  previewId: string
  branch: string
  path: string
  images: string[]
  commitSha: string
  previewUrl: string
}

export type PreviewStatusResult =
  | {
      status: 'pending' | 'running'
    }
  | {
      status: 'success'
      previewUrl: string
    }
  | {
      status: 'failure'
      conclusion?: string
    }

export type PublishStatusResult =
  | {
      status: 'pending' | 'running'
    }
  | {
      status: 'success'
    }
  | {
      status: 'failure'
      conclusion?: string
    }

export type PublishResult = {
  status: 'published'
  path: string
  images: string[]
  commitSha: string
}

async function checkResponse(response: Response) {
  if (!response.ok) {
    const message = await response.text()

    throw new Error(
      `${response.status}: ${message}`
    )
  }

  return response
}

export async function createPreview(
  apiKey: string,
  date: string,
  markdown: string,
  images: ImagePayload[]
): Promise<PreviewResult> {
  const response = await fetch(
    `${API_BASE_URL}/preview`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date,
        markdown,
        images
      })
    }
  )

  await checkResponse(response)

  return response.json()
}

export async function getPreviewStatus(
  apiKey: string,
  previewId: string
): Promise<PreviewStatusResult> {
  const response = await fetch(
    `${API_BASE_URL}/preview-status?id=${encodeURIComponent(previewId)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  )

  await checkResponse(response)

  return response.json()
}

export async function publish(
  apiKey: string,
  date: string,
  markdown: string,
  images: ImagePayload[]
): Promise<PublishResult> {
  const response = await fetch(
    `${API_BASE_URL}/publish`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date,
        markdown,
        images
      })
    }
  )

  await checkResponse(response)

  return response.json()
}

export async function getPublishStatus(
  apiKey: string,
  commitSha: string
): Promise<PublishStatusResult> {
  const response = await fetch(
    `${API_BASE_URL}/publish-status?sha=${encodeURIComponent(commitSha)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  )

  await checkResponse(response)

  return response.json()
}

export async function deletePreviewBranches(
  apiKey: string
) {
  const response = await fetch(
    `${API_BASE_URL}/preview-branches`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  )

  await checkResponse(response)

  return response.json()
}