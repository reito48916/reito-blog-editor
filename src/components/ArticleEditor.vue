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
  <div class="article-editor">
    <input
      v-model="date"
      class="date-input"
      type="date"
    />

    <input
      v-model="title"
      class="title-input"
      type="text"
      placeholder="タイトル"
    />

    <textarea
      ref="bodyInput"
      v-model="body"
      class="body-input"
      placeholder="本文"
    ></textarea>
  </div>
</template>

<style scoped>
.article-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.date-input {
  align-self: flex-start;
  padding: 0.5rem 0;
  border: none;
  border-bottom: 1px solid var(--border);
  background: transparent;
  color: inherit;
}

.title-input {
  width: 100%;
  padding: 0.5rem 0;
  border: none;
  border-bottom: 2px solid var(--accent);
  background: transparent;
  color: var(--text-h);
  font-size: 1.6rem;
  font-weight: 500;
  box-sizing: border-box;
}

.body-input {
  width: 100%;
  min-height: 50vh;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: inherit;
  font: inherit;
  line-height: 1.7;
  box-sizing: border-box;
  resize: vertical;
}
</style>