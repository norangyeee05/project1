<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoticeStore } from '../stores/notice'
import Pagination from '../components/Pagination.vue'

const PAGE_SIZE = 10

const route = useRoute()
const router = useRouter()
const store = useNoticeStore()

// 검색어/현재 페이지는 URL query에서 읽어온다. (FR-07, AC-10)
const keyword = computed(() => route.query.keyword || '')
const currentPage = computed(() => {
  const page = Number(route.query.page)
  return Number.isInteger(page) && page > 0 ? page : 1
})

function updateQuery(next) {
  const query = { ...route.query, ...next }
  if (!query.keyword) delete query.keyword
  if (!query.page || Number(query.page) <= 1) delete query.page
  router.replace({ query })
}

// title/content/author 대상, 대소문자 구분 없이 검색한다. (FR-06)
const filteredNotices = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return store.notices
  return store.notices.filter((notice) =>
    [notice.title, notice.content, notice.author]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(kw))
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredNotices.value.length / PAGE_SIZE)))

// 전체 목록 -> 검색 필터 -> filteredNotices -> 10건 slice -> 현재 페이지 출력 (FR-07)
const paginatedNotices = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredNotices.value.slice(start, start + PAGE_SIZE)
})

// 검색 결과가 줄어들어 현재 페이지가 범위를 벗어나면 마지막 페이지로 보정한다.
watch(totalPages, (max) => {
  if (currentPage.value > max) {
    updateQuery({ page: max })
  }
})

// 검색어가 바뀌면 1페이지로 돌아간다. (FR-06)
function onSearchInput(event) {
  updateQuery({ keyword: event.target.value, page: 1 })
}

function onPageChange(page) {
  updateQuery({ page })
}

function formatDate(value) {
  return value ? value.replace('T', ' ').slice(0, 16) : ''
}

onMounted(() => {
  store.fetchNotices()
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">공지사항</h1>
      <router-link
        to="/notices/new"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        등록
      </router-link>
    </div>

    <div class="mt-6">
      <input
        type="text"
        placeholder="제목, 내용, 작성자로 검색"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        :value="keyword"
        @input="onSearchInput"
      />
    </div>

    <div v-if="store.loading" class="mt-10 text-center text-gray-500">불러오는 중...</div>
    <div v-else-if="store.error" class="mt-10 text-center text-red-500">{{ store.error }}</div>
    <div v-else-if="paginatedNotices.length === 0" class="mt-10 text-center text-gray-500">
      데이터가 없습니다.
    </div>
    <table v-else class="mt-6 w-full border-collapse text-sm">
      <thead>
        <tr class="border-b border-gray-200 text-left text-gray-500">
          <th class="w-16 py-2">번호</th>
          <th class="py-2">제목</th>
          <th class="w-28 py-2">작성자</th>
          <th class="w-20 py-2 text-right">조회수</th>
          <th class="w-40 py-2 text-right">등록일</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="notice in paginatedNotices"
          :key="notice.id"
          class="border-b border-gray-100 hover:bg-gray-50"
        >
          <td class="py-3 text-gray-500">{{ notice.id }}</td>
          <td class="py-3">
            <router-link :to="`/notices/${notice.id}`" class="text-gray-800 hover:text-blue-600">
              {{ notice.title }}
            </router-link>
          </td>
          <td class="py-3 text-gray-600">{{ notice.author }}</td>
          <td class="py-3 text-right text-gray-500">{{ notice.hits }}</td>
          <td class="py-3 text-right text-gray-400">{{ formatDate(notice.createdAt) }}</td>
        </tr>
      </tbody>
    </table>

    <Pagination :current-page="currentPage" :total-pages="totalPages" @change="onPageChange" />
  </div>
</template>
