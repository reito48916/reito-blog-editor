<script setup lang="ts">
defineProps<{
  markdown: string
  previewHtml: string
}>()
</script>

<template>
  <section class="preview-area">
    <div class="markdown-preview">
      <h2>Markdown</h2>
      <pre>{{ markdown }}</pre>
    </div>

    <div class="html-preview">
      <h2>Preview</h2>
      <div class="preview" v-html="previewHtml"></div>
    </div>
  </section>
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