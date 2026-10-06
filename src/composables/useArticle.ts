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

  const title = ref('タイトル')

  const body = ref(`ここに本文を書きます。

## 見出し

文章の中では **太字** や *斜体* を使えます。

### 小見出し

箇条書きはこんな感じ。

- 項目1
- 項目2
- 項目3

番号付きリストも使えます。

1. 最初にやること
2. 次にやること
3. 最後にやること

> 引用文を書く場合はこんな感じ。

リンクは [リンク名](https://example.com) のように書きます。

画像は「画像を挿入」から追加できます。

インラインコードは \`const value = 1\` のように書けます。

\`\`\`ts
const message = 'コードブロックも使えます'
console.log(message)
\`\`\``)

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