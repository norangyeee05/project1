<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <h1 class="text-3xl font-bold text-gray-800">Notice Project</h1>
    <p class="mt-3 max-w-md text-gray-500">
      Spring Boot와 Vue 3로 만든 가장 단순한 공지사항 CRUD 학습 프로젝트입니다.
    </p>
    <button
      class="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      @click="router.push('/notices')"
    >
      공지사항 바로가기
    </button>
  </div>
</template>
