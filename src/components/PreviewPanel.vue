<script setup lang="ts">
defineProps<{
  previewHtml: string
}>()
</script>

<template>
  <section class="preview-panel">
    <h2>Preview</h2>

    <div
      class="preview"
      v-html="previewHtml"
    ></div>
  </section>
</template>

<style scoped>
.preview-panel {
  margin-top: 2rem;
  padding: 1.5rem;

  border: 2px solid #4caf50;
  border-radius: 8px;
}

.preview {
  line-height: 1.7;
}

.preview :deep(p:has(.article-image)) {
  text-align: center;
}

.preview :deep(.article-image) {
  display: inline-block;
  vertical-align: middle;
}
</style>