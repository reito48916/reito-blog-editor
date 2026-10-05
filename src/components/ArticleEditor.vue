<script setup lang="ts">
import { ref } from 'vue'

const date = defineModel<string>('date', {
  required: true
})

const title = defineModel<string>('title', {
  required: true
})

const body = defineModel<string>('body', {
  required: true
})

const bodyInput = ref<HTMLTextAreaElement | null>(null)

function insertText(text: string) {
  if (!bodyInput.value) {
    return
  }

  const textarea = bodyInput.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  body.value =
    body.value.slice(0, start) +
    text +
    body.value.slice(end)
}

defineExpose({
  insertText
})
</script>

<template>
  <div>
    <label>日付</label>
    <input v-model="date" type="date" />
  </div>

  <div>
    <label>タイトル</label>
    <input v-model="title" type="text" />
  </div>

  <div>
    <label>本文</label>
    <textarea
      ref="bodyInput"
      v-model="body"
    ></textarea>
  </div>
</template>