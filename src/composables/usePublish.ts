import { ref } from 'vue'
import {
  publish,
  getPublishStatus,
  deletePreviewBranches,
  type ImagePayload
} from '../services/blogApi'

type PublishStatus =
  | 'idle'
  | 'publishing'
  | 'waiting'
  | 'success'
  | 'failure'

export function usePublish() {
  const publishStatus = ref<PublishStatus>('idle')
  const publishedArticleUrl = ref('')
  const previewCleanupFailed = ref(false)

  async function waitForPublish(
    commitSha: string,
    apiKey: string
  ) {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 3000))

      const result = await getPublishStatus(
        apiKey,
        commitSha
      )

      if (result.status === 'success') {
        try {
          await deletePreviewBranches(apiKey)
        } catch (error) {
          previewCleanupFailed.value = true
          console.error(
            'プレビューブランチの削除に失敗しました:',
            error
          )
        }

        publishStatus.value = 'success'
        return
      }

      if (result.status === 'failure') {
        publishStatus.value = 'failure'

        throw new Error(
          `サイトのデプロイに失敗しました: ${result.conclusion ?? 'unknown'}`
        )
      }

      publishStatus.value = 'waiting'
    }
  }

  async function publishArticle(
    apiKey: string,
    date: string,
    title: string,
    markdown: string,
    images: ImagePayload[]
  ) {
    publishStatus.value = 'publishing'
    publishedArticleUrl.value = ''
    previewCleanupFailed.value = false

    try {
      const result = await publish(
        apiKey,
        date,
        markdown,
        images
      )

      const [year, month, day] = date.split('-')

      publishedArticleUrl.value = `https://reito48916.github.io/reito_site/blog/${year}/${month}/${day}/${encodeURIComponent(title.trim())}/`

      publishStatus.value = 'waiting'

      await waitForPublish(
        result.commitSha,
        apiKey
      )
    } catch (error) {
      publishStatus.value = 'failure'
      throw error
    }
  }

  return {
    publishStatus,
    publishedArticleUrl,
    previewCleanupFailed,
    publishArticle
  }
}