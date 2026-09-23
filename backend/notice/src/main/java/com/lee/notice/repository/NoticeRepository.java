package com.lee.notice.repository;

import com.lee.notice.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Modifying //수정자: 기존 메서드를 내가 만들어서 사용할게
    @Query("update Notice n set n.hits = n.hits + 1 where n.id = :id")
    int increaseHits(@Param("id") Long id);
    //테이블이 아닌 엔티티가 들어감, 알리아스로 엔티티를 줄여서 n으로 표시, :id와 Long id가 일치
    //디비에서 사용할 때 Param을 이용하여 자바의 id를 sql의 id로 대입
}
