import { computed, ref } from 'vue'

export type ArticleImage = {
  publicPath: string
  repositoryPath: string
  previewUrl: string
  file: File
}

export function useArticle() {
  const now = new Date()

  const date = ref(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  )

  const title = ref('初期状態')
  const body = ref(`本文の
初期のモード！`)

  const images = ref<ArticleImage[]>([])

  const articleBody = computed(() => {
    const normalizedBody = body.value.trim()
    const paragraphs = normalizedBody.split(/\n\s*\n/)

    if (paragraphs.length <= 1) {
      return normalizedBody
    }

    return `${paragraphs[0]}

<!-- more -->

${paragraphs.slice(1).join('\n\n')}`
  })

  const articleMarkdown = computed(() => {
    return `# ${title.value.trim()}

${articleBody.value}`
  })

  const markdown = computed(() => {
    return `---
date:
  created: ${date.value}
---

${articleMarkdown.value}`
  })

  const usedImages = computed(() => {
    return images.value.filter(image =>
      body.value.includes(image.publicPath)
    )
  })

  return {
    date,
    title,
    body,
    images,
    articleBody,
    articleMarkdown,
    markdown,
    usedImages
  }
}