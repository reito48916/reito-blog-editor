import { ref } from 'vue'
import {
  createPreview,
  getPreviewStatus,
  type ImagePayload
} from '../services/blogApi'

type SitePreviewStatus =
  | 'idle'
  | 'creating'
  | 'waiting'
  | 'success'
  | 'failure'

export function useSitePreview() {
  const sitePreviewStatus = ref<SitePreviewStatus>('idle')
  const sitePreviewUrl = ref('')

  async function waitForSitePreview(
    previewId: string,
    apiKey: string
  ) {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 3000))

      const result = await getPreviewStatus(
        apiKey,
        previewId
      )

      if (result.status === 'success') {
        sitePreviewStatus.value = 'success'
        sitePreviewUrl.value = result.previewUrl
        return
      }

      if (result.status === 'failure') {
        sitePreviewStatus.value = 'failure'

        throw new Error(
          `プレビュー生成に失敗しました: ${result.conclusion ?? 'unknown'}`
        )
      }

      sitePreviewStatus.value = 'waiting'
    }
  }

  async function openSitePreview(
    apiKey: string,
    date: string,
    markdown: string,
    images: ImagePayload[]
  ) {
    sitePreviewStatus.value = 'creating'
    sitePreviewUrl.value = ''

    try {
      const result = await createPreview(
        apiKey,
        date,
        markdown,
        images
      )

      sitePreviewStatus.value = 'waiting'

      await waitForSitePreview(
        result.previewId,
        apiKey
      )
    } catch (error) {
      sitePreviewStatus.value = 'failure'
      throw error
    }
  }

  return {
    sitePreviewStatus,
    sitePreviewUrl,
    openSitePreview
  }
}