import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NoticeListView from '../views/NoticeListView.vue'
import NoticeDetailView from '../views/NoticeDetailView.vue'
import NoticeFormView from '../views/NoticeFormView.vue'

// id 파라미터가 양의 정수인지 검증한다. (9장 라우팅 요구사항)
function isValidId(rawId) {
  const id = Number(rawId)
  return Number.isInteger(id) && id > 0
}

function validateIdGuard(to, from, next) {
  isValidId(to.params.id) ? next() : next('/notices')
}

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/notices', name: 'notice-list', component: NoticeListView },
  { path: '/notices/new', name: 'notice-new', component: NoticeFormView },
  {
    path: '/notices/:id',
    name: 'notice-detail',
    component: NoticeDetailView,
    props: (route) => ({ id: Number(route.params.id) }),
    beforeEnter: validateIdGuard
  },
  {
    path: '/notices/:id/edit',
    name: 'notice-edit',
    component: NoticeFormView,
    props: (route) => ({ id: Number(route.params.id) }),
    beforeEnter: validateIdGuard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
