# notice-frontend (React)

`backend/notice` (Spring Boot, `com.lee.notice`) 프로젝트와 연동되는 React 프런트엔드입니다.
`notice_react_version.md` PRD를 기준으로 구성했습니다.

## PRD와 실제 구현의 차이 (중요)

업로드된 PRD는 이전 Vue PRD를 React로 텍스트 치환한 문서라, React에 존재하지 않거나
맞지 않는 항목이 섞여 있었습니다. 아래와 같이 React에 맞는 방식으로 대체했습니다.

| PRD 표기 | 실제 구현 | 이유 |
|---|---|---|
| Pinia | React Context + `useReducer` (`src/store/NoticeContext.jsx`) | Pinia는 Vue 전용 라이브러리로 React에는 존재하지 않음. 새 라이브러리 추가 없이(NFR-01) `notices/currentNotice/loading/error` 상태와 5개 액션을 동일하게 구현 |
| `<script setup>`, React SFC, `.react` 파일 | 표준 함수형 컴포넌트 + Hooks, `.jsx` 확장자 | React에는 없는 Vue 전용 문법/확장자 |
| React Router | `react-router-dom` | 실제 존재하는 React용 라우터 |

API 계약(`/api/notices` 5종), 클라이언트 검색/페이징(FR-06, FR-07), URL query 복원(AC-10),
입력 검증(FR-08) 등 기능 요구사항은 Vue 버전과 동일하게 구현했습니다.

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

## 참고

- 백엔드 서버 포트는 `application.yaml` 기준 **8081**입니다.
- 백엔드에 별도 CORS 설정이 없어, `vite.config.js`의 dev proxy(`/api` → `http://localhost:8081`)로
  CORS 문제를 해결했습니다. (NFR-05: proxy와 Spring CORS 중 하나만 사용)
- 백엔드 API 중 `/api/notices/v2` 계열(Entity 직접 노출)은 PRD 범위 밖이라 사용하지 않고,
  DTO 기반 정식 API(`/api/notices`)만 연동했습니다.

## 구조

```text
src/
  api/axios.js              공통 axios 인스턴스 + 오류 처리
  api/noticeApi.js           Notice REST API 호출 함수
  store/NoticeContext.jsx    Context 기반 store (notices/currentNotice/loading/error)
  App.jsx                    라우트 정의 (/, /notices, /notices/new, /notices/:id, /notices/:id/edit)
  main.jsx                   진입점 (BrowserRouter + NoticeProvider)
  views/HomeView.jsx
  views/NoticeListView.jsx   검색 + 페이징(10건) + URL query 동기화
  views/NoticeDetailView.jsx
  views/NoticeFormView.jsx   등록/수정 공용 폼
  components/Pagination.jsx
```
