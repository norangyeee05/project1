<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNoticeStore } from '../stores/notice'

const props = defineProps({
  id: { type: Number, required: true }
})

const router = useRouter()
const store = useNoticeStore()

function formatDate(value) {
  return value ? value.replace('T', ' ').slice(0, 16) : ''
}

// 상세 조회 시 백엔드가 hits를 1 증가시키고, 증가된 조회수를 그대로 표시한다. (FR-02, AC-02)
async function load() {
  await store.fetchNotice(props.id)
}

async function onDelete() {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await store.deleteNotice(props.id)
    router.push('/notices')
  } catch (e) {
    alert(e.message)
  }
}

onMounted(load)
watch(() => props.id, load)
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10">
    <div v-if="store.loading" class="text-center text-gray-500">불러오는 중...</div>
    <div v-else-if="store.error" class="text-center text-red-500">{{ store.error }}</div>
    <div v-else-if="store.currentNotice">
      <h1 class="text-2xl font-bold text-gray-800">{{ store.currentNotice.title }}</h1>
      <div class="mt-2 flex gap-4 text-sm text-gray-500">
        <span>작성자 {{ store.currentNotice.author }}</span>
        <span>조회수 {{ store.currentNotice.hits }}</span>
        <span>{{ formatDate(store.currentNotice.createdAt) }}</span>
      </div>
      <div class="mt-6 whitespace-pre-wrap rounded-lg border border-gray-200 p-4 text-gray-700">
        {{ store.currentNotice.content }}
      </div>
      <div class="mt-6 flex justify-between">
        <router-link
          to="/notices"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          목록
        </router-link>
        <div class="flex gap-2">
          <router-link
            :to="`/notices/${id}/edit`"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            수정
          </router-link>
          <button
            type="button"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            @click="onDelete"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
