<script setup lang="ts">
import { ref } from 'vue'
import { convertToPng } from '../utils/image'
import type { ArticleImage } from '../composables/useArticle'

const props = defineProps<{
  date: string
  imageCount: number
}>()

const emit = defineEmits<{
  insert: [image: ArticleImage, markdown: string]
}>()

const selectedImageFile = ref<File | null>(null)
const selectedImageUrl = ref('')

async function onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const pngFile = await convertToPng(file)

  selectedImageFile.value = pngFile
  selectedImageUrl.value = URL.createObjectURL(pngFile)
}

function insertImage() {
  if (
    !selectedImageFile.value ||
    !selectedImageUrl.value
  ) {
    return
  }

  const fileName =
    `${String(props.imageCount + 1).padStart(2, '0')}.png`

  const [year, month, day] = props.date.split('-')

  const publicPath =
    `../../../../images/disposable/${year}/${month}/${day}/${fileName}`

  const repositoryPath =
    `docs/images/disposable/${year}/${month}/${day}/${fileName}`

  const image: ArticleImage = {
    publicPath,
    repositoryPath,
    previewUrl: selectedImageUrl.value,
    file: selectedImageFile.value
  }

  const markdown =
    `![画像](${publicPath})`

  emit('insert', image, markdown)

  selectedImageFile.value = null
  selectedImageUrl.value = ''
}
</script>

<template>
  <div>
    <label>画像</label>

    <input
      type="file"
      accept="image/*"
      @change="onImageSelected"
    />

    <button
      @click="insertImage"
      :disabled="!selectedImageFile"
    >
      画像を挿入
    </button>
  </div>
</template>