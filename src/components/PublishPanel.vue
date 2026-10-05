<script setup lang="ts">
const apiKey = defineModel<string>('apiKey', {
  required: true
})

defineProps<{
  sitePreviewStatus:
    | 'idle'
    | 'creating'
    | 'waiting'
    | 'success'
    | 'failure'

  sitePreviewUrl: string

  publishStatus:
    | 'idle'
    | 'publishing'
    | 'waiting'
    | 'success'
    | 'failure'

  publishedArticleUrl: string
  previewCleanupFailed: boolean
}>()

const emit = defineEmits<{
  sitePreview: []
  publish: []
}>()
</script>

<template>
  <div>
    <div>
      <label>APIキー</label>
      <input
        v-model="apiKey"
        type="password"
        autocomplete="off"
        placeholder="実サイトプレビュー時に入力"
      />
    </div>

    <button
      @click="emit('sitePreview')"
      :disabled="
        sitePreviewStatus === 'creating' ||
        sitePreviewStatus === 'waiting'
      "
    >
      実サイトプレビュー
    </button>

    <p v-if="sitePreviewStatus === 'creating'">
      プレビューを作成しています…
    </p>

    <p v-else-if="sitePreviewStatus === 'waiting'">
      実サイトプレビューを生成しています…
    </p>

    <p v-else-if="sitePreviewStatus === 'success'">
      プレビューの準備ができました。
      <a
        :href="sitePreviewUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        プレビューを開く
      </a>
    </p>

    <p v-else-if="sitePreviewStatus === 'failure'">
      プレビューの生成に失敗しました。
    </p>

    <button
      @click="emit('publish')"
      :disabled="
        publishStatus === 'publishing' ||
        publishStatus === 'waiting'
      "
    >
      公開
    </button>

    <p v-if="publishStatus === 'publishing'">
      公開コミットを作成しています…
    </p>

    <p v-else-if="publishStatus === 'waiting'">
      ブログを公開しています…
    </p>

    <div v-else-if="publishStatus === 'success'">
      <p>公開しました。</p>

      <p v-if="previewCleanupFailed">
        ※ プレビューブランチの削除には失敗しました。
      </p>

      <a
        :href="publishedArticleUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        公開した記事を開く
      </a>
    </div>

    <p v-else-if="publishStatus === 'failure'">
      記事の公開に失敗しました。
    </p>
  </div>
</template>