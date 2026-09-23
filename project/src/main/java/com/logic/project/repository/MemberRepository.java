package com.logic.project.repository;

import com.logic.project.entity.Member;
import com.logic.project.entity.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long>{
    // loginId로 조회
    Optional<Member> findByLoginId(String loginId);

    // email로 조회
    Optional<Member> findByEmail(String email);

    // loginId 존재 여부
    boolean existsByLoginId(String loginId);

    // email 존재 여부
    boolean existsByEmail(String email);

    // 회원 목록 (회원번호 내림차순)
    List<Member> findAllByOrderByIdDesc();

    // 회원 목록 (상태별 + 회원번호 내림차순)
    List<Member> findByStatusOrderByIdDesc(MemberStatus status);
}
