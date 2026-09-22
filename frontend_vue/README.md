# notice-frontend

`backend/notice` (Spring Boot, `com.lee.notice`) 프로젝트와 연동되는 Vue 3 프런트엔드입니다.
PRD(`notice-project-vibe-coding-prd.md`)를 기준으로 구성했습니다.

## 실행 방법

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속.

백엔드는 별도로 실행해야 합니다.

```bash
cd backend/notice
./gradlew bootRun
```

## 참고 (PRD와 실제 코드 차이)

- 백엔드 서버 포트는 `application.yaml` 기준 **8081**입니다. (PRD 본문의 8080은 예시입니다.)
- 백엔드에 별도 CORS 설정이 없어, `vite.config.js`의 dev proxy(`/api` → `http://localhost:8081`)로
  CORS 문제를 해결했습니다. (NFR-05: proxy와 Spring CORS 중 하나만 사용)
- 백엔드 API는 `/api/notices` 계열(DTO 기반, PRD와 일치) 외에 `/api/notices/v2` 계열(Entity 직접 노출)도
  제공하지만, 프런트엔드는 PRD/DTO 기준인 `/api/notices` 계열만 사용합니다.

## 구조

```text
src/
  api/axios.js          공통 axios 인스턴스 + 오류 처리
  api/noticeApi.js       Notice REST API 호출 함수
  stores/notice.js        Pinia store (notices/currentNotice/loading/error)
  router/index.js         Vue Router (/, /notices, /notices/new, /notices/:id, /notices/:id/edit)
  views/HomeView.vue
  views/NoticeListView.vue   검색 + 페이징(10건) + URL query 동기화
  views/NoticeDetailView.vue
  views/NoticeFormView.vue   등록/수정 공용 폼
  components/Pagination.vue
```
