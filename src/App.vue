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

import ArticleEditor from './components/ArticleEditor.vue'
import ImageSelector from './components/ImageSelector.vue'
import PublishPanel from './components/PublishPanel.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import MarkdownPanel from './components/MarkdownPanel.vue'

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

type DisplayPanel = 'preview' | 'markdown' | null
const displayPanel = ref<DisplayPanel>(null)
function togglePanel(panel: 'preview' | 'markdown') {
  displayPanel.value =
    displayPanel.value === panel
      ? null
      : panel
}

const apiKey = ref('')

const articleEditor =
  ref<InstanceType<typeof ArticleEditor> | null>(null)

const previewHtml = computed<string>(() => {
  let result = articleMarkdown.value

  // 公開用画像パス → ローカルプレビューURL
  for (const image of usedImages.value) {
    result = result.replaceAll(
      image.publicPath,
      image.previewUrl
    )
  }

  // MkDocs attr_list の画像幅指定を簡易プレビュー用HTMLへ変換
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)\{\s*width="(\d+)%"(?:\s+\.article-image)?\s*\}/g,
    '<img src="$2" alt="$1" class="article-image" style="width: $3%; height: auto;">'
  )

  return marked.parse(result, { async: false })
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
    <h1>記事編集ツール</h1>
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

    <div class="panel-controls">
      <button
        type="button"
        @click="togglePanel('preview')"
      >
        プレビュー
      </button>

      <button
        type="button"
        @click="togglePanel('markdown')"
      >
        生成Markdownを確認
      </button>
    </div>

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

    <PreviewPanel
      v-if="displayPanel === 'preview'"
      :preview-html="previewHtml"
    />

    <MarkdownPanel
      v-else-if="displayPanel === 'markdown'"
      :markdown="markdown"
    />
  </main>
</template>

<style scoped>
.preview-area {
  margin-top: 2rem;
}

.html-preview,
.markdown-preview {
  width: 100%;
}

.markdown-preview {
  margin-top: 1rem;
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