<script setup lang="ts">
defineProps<{
  markdown: string
}>()
</script>

<template>
  <section class="markdown-panel">
    <h2>生成Markdown</h2>

    <pre>{{ markdown }}</pre>
  </section>
</template>

<style scoped>
.markdown-panel {
  margin-top: 2rem;
  padding: 1.5rem;

  border: 2px solid #aa3bff;
  border-radius: 8px;
}

pre {
  margin: 0;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>