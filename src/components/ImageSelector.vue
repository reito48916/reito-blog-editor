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

const imageWidth = ref(95)


function setImageWidth(width: number) {
  imageWidth.value = width
}

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

  const imageMarkdown =
    `![画像](${publicPath}){ width="${imageWidth.value}%" .article-image }`

  emit('insert', image, imageMarkdown)

  selectedImageFile.value = null
  selectedImageUrl.value = ''
}
</script>

<template>
  <div class="image-selector">
    <label class="file-select-button">
      挿入画像を選択

      <input
        class="file-input"
        type="file"
        accept="image/*"
        @change="onImageSelected"
      />
    </label>

    <img
      v-if="selectedImageUrl"
      :src="selectedImageUrl"
      class="image-thumbnail"
      alt="選択中の画像"
    />
    <input
      v-model.number="imageWidth"
      type="number"
      min="1"
      max="100"
    />
    <span>%</span>

    <div class="width-presets">
      <button type="button" @click="setImageWidth(22)">22%</button>
      <button type="button" @click="setImageWidth(30)">30%</button>
      <button type="button" @click="setImageWidth(45)">45%</button>
      <button type="button" @click="setImageWidth(60)">60%</button>
      <button type="button" @click="setImageWidth(95)">95%</button>
    </div>

    <button
      type="button"
      :disabled="!selectedImageFile"
      @click="insertImage"
    >
      本文に画像を挿入
    </button>
  </div>
</template>

<style scoped>
.image-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.file-input {
  display: none;
}

.file-select-button {
  display: inline-block;
  padding: 0.6rem 1rem;
  border: 1px solid var(--accent);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}

.image-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid var(--border);
  border-radius: 6px;
}

button {
  padding: 0.6rem 1rem;
}
</style>