-- =========================
-- Notice 테이블 기본 DML
-- =========================

-- 1. INSERT (등록)
INSERT INTO notice (title, content, author, hits, created_at)
VALUES ('제목1', '내용1', 'admin', 0, NOW());

-- (간단 버전)
INSERT INTO notice (title, content, author)
VALUES ('제목2', '내용2', 'admin');


-- 2. SELECT (전체 조회)
SELECT *
FROM notice
ORDER BY id DESC;


-- 3. SELECT (단건 조회)
SELECT *
FROM notice
WHERE id = 1;


-- 4. UPDATE (수정)
UPDATE notice
SET title = '제목 수정',
    content = '내용 수정',
    author = 'user'
WHERE id = 1;


-- 5. DELETE (삭제)
DELETE FROM notice
WHERE id = 1;


-- =========================
-- 추가 실무 쿼리
-- =========================

-- 6. 조회수 증가
UPDATE notice
SET hits = hits + 1
WHERE id = 1;


-- 7. 최신 글 10개
SELECT *
FROM notice
ORDER BY id DESC
LIMIT 10;


-- 8. 제목 검색
SELECT *
FROM notice
WHERE title LIKE '%검색어%';


-- 9. 작성자 검색
SELECT *
FROM notice
WHERE author = 'admin';


-- 10. 페이징
SELECT *
FROM notice
ORDER BY id DESC
LIMIT 10 OFFSET 0;