<script setup lang="ts">

import { ref, computed } from 'vue'
import { marked } from 'marked'

import {
  fileToBase64
} from './utils/image'

import { useArticle } from './composables/useArticle'
const {
  date,
  title,
  body,
  images,
  articleMarkdown,
  markdown,
  usedImages
} = useArticle()
import type { ArticleImage } from './composables/useArticle'

import { useSitePreview } from './composables/useSitePreview'
const {
  sitePreviewStatus,
  sitePreviewUrl,
  openSitePreview
} = useSitePreview()

import { usePublish } from './composables/usePublish'
const {
  publishStatus,
  publishedArticleUrl,
  previewCleanupFailed,
  publishArticle
} = usePublish()


import PreviewPanel from './components/PreviewPanel.vue'
import ArticleEditor from './components/ArticleEditor.vue'
import ImageSelector from './components/ImageSelector.vue'
import PublishPanel from './components/PublishPanel.vue'

async function handleSitePreview() {
  if (!apiKey.value) {
    alert('APIキーを入力してください')
    return
  }

  const apiKeyValue = apiKey.value

  try {
    const imagePayloads = await Promise.all(
      usedImages.value.map(async image => ({
        path: image.repositoryPath,
        contentBase64: await fileToBase64(image.file)
      }))
    )

    await openSitePreview(
      apiKeyValue,
      date.value,
      markdown.value,
      imagePayloads
    )
  } catch (error) {
    console.error(error)
  } finally {
    apiKey.value = ''
  }
}

async function handlePublish() {
  if (!apiKey.value) {
    alert('APIキーを入力してください')
    return
  }

  const apiKeyValue = apiKey.value

  try {
    const imagePayloads = await Promise.all(
      usedImages.value.map(async image => ({
        path: image.repositoryPath,
        contentBase64: await fileToBase64(image.file)
      }))
    )

    await publishArticle(
      apiKeyValue,
      date.value,
      title.value,
      markdown.value,
      imagePayloads
    )
  } catch (error) {
    console.error(error)
  } finally {
    apiKey.value = ''
  }
}

const isPreview = ref(false)
const apiKey = ref('')

const articleEditor =
  ref<InstanceType<typeof ArticleEditor> | null>(null)

const previewHtml = computed<string>(() => {
  let result = articleMarkdown.value

  for (const image of usedImages.value) {
    result = result.replaceAll(
      image.publicPath,
      image.previewUrl
    )
  }

  return marked.parse(result, {
    async: false
  })
})

function handleImageInsert(
  image: ArticleImage,
  imageMarkdown: string
) {
  images.value.push(image)

  articleEditor.value?.insertText(imageMarkdown)
}
</script>

<template>
  <main>
    <h1>テスト</h1>
    <ArticleEditor
      ref="articleEditor"
      v-model:date="date"
      v-model:title="title"
      v-model:body="body"
    />

    <ImageSelector
      :date="date"
      :image-count="images.length"
      @insert="handleImageInsert"
    />

    <button @click="isPreview = !isPreview">プレビュー</button>

    <PreviewPanel
      v-if="isPreview"
      :markdown="markdown"
      :preview-html="previewHtml"
    />

    <PublishPanel
      v-model:api-key="apiKey"
      :site-preview-status="sitePreviewStatus"
      :site-preview-url="sitePreviewUrl"
      :publish-status="publishStatus"
      :published-article-url="publishedArticleUrl"
      :preview-cleanup-failed="previewCleanupFailed"
      @site-preview="handleSitePreview"
      @publish="handlePublish"
    />
  </main>
</template>

<style scoped>
.preview-area {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}

.markdown-preview,
.html-preview {
  flex: 1;
  min-width: 0;
}

.markdown-preview pre {
  padding: 1rem;
  overflow-x: auto;
  white-space: pre-wrap;
  border: 1px solid #ccc;
}

.preview {
  padding: 1.5rem;
  border: 1px solid #ccc;
  line-height: 1.7;
}

@media (max-width: 800px) {
  .preview-area {
    flex-direction: column;
  }
}
</style>