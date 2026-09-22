<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

const emit = defineEmits(['change'])

function go(page) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('change', page)
}
</script>

<template>
  <nav v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-1">
    <button
      type="button"
      class="rounded px-3 py-1 text-sm text-gray-600 disabled:opacity-30"
      :disabled="currentPage === 1"
      @click="go(currentPage - 1)"
    >
      이전
    </button>
    <button
      v-for="page in totalPages"
      :key="page"
      type="button"
      class="rounded px-3 py-1 text-sm"
      :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
      @click="go(page)"
    >
      {{ page }}
    </button>
    <button
      type="button"
      class="rounded px-3 py-1 text-sm text-gray-600 disabled:opacity-30"
      :disabled="currentPage === totalPages"
      @click="go(currentPage + 1)"
    >
      다음
    </button>
  </nav>
</template>
