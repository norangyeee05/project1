<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoticeStore } from '../stores/notice'

// 등록(/notices/new)과 수정(/notices/:id/edit)에서 하나의 컴포넌트를 재사용한다. (7.4)
const props = defineProps({
  id: { type: Number, default: null }
})

const route = useRoute()
const router = useRouter()
const store = useNoticeStore()

const isEdit = computed(() => route.name === 'notice-edit')

const form = reactive({
  title: '',
  content: '',
  author: ''
})

const errors = reactive({
  title: '',
  content: '',
  author: ''
})

const submitting = ref(false)
const loadError = ref('')

// 프런트엔드 입력 검증: title/author 공백 불가 + 길이 제한, content 공백 불가 (FR-08)
function validate() {
  errors.title = !form.title.trim()
    ? '제목을 입력하세요.'
    : form.title.length > 200
      ? '제목은 최대 200자까지 입력할 수 있습니다.'
      : ''
  errors.content = !form.content.trim() ? '내용을 입력하세요.' : ''
  errors.author = !form.author.trim()
    ? '작성자를 입력하세요.'
    : form.author.length > 50
      ? '작성자는 최대 50자까지 입력할 수 있습니다.'
      : ''
  return !errors.title && !errors.content && !errors.author
}

async function loadForEdit() {
  if (!isEdit.value) return
  await store.fetchNotice(props.id)
  if (store.currentNotice) {
    form.title = store.currentNotice.title
    form.content = store.currentNotice.content
    form.author = store.currentNotice.author
  } else if (store.error) {
    loadError.value = store.error
  }
}

async function onSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const payload = { title: form.title, content: form.content, author: form.author }
    if (isEdit.value) {
      await store.updateNotice(props.id, payload)
      router.push(`/notices/${props.id}`)
    } else {
      const created = await store.createNotice(payload)
      router.push(`/notices/${created.id}`)
    }
  } catch (e) {
    alert(e.message)
  } finally {
    submitting.value = false
  }
}

function onCancel() {
  router.back()
}

onMounted(loadForEdit)
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10">
    <h1 class="text-2xl font-bold text-gray-800">{{ isEdit ? '공지사항 수정' : '공지사항 등록' }}</h1>

    <div v-if="loadError" class="mt-6 text-center text-red-500">{{ loadError }}</div>
    <form v-else class="mt-6 space-y-5" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700">제목</label>
        <input
          v-model="form.title"
          type="text"
          maxlength="200"
          class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">내용</label>
        <textarea
          v-model="form.content"
          rows="8"
          class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        ></textarea>
        <p v-if="errors.content" class="mt-1 text-sm text-red-500">{{ errors.content }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">작성자</label>
        <input
          v-model="form.author"
          type="text"
          maxlength="50"
          class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
        <p v-if="errors.author" class="mt-1 text-sm text-red-500">{{ errors.author }}</p>
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          @click="onCancel"
        >
          취소
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          저장
        </button>
      </div>
    </form>
  </div>
</template>
