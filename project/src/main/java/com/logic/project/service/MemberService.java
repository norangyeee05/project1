package com.logic.project.service;

import com.logic.project.entity.Member;
import com.logic.project.entity.MemberRole;
import com.logic.project.entity.MemberStatus;
import com.logic.project.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional // 기본: 쓰기 트랜잭션
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 1. 회원 가입
    public Member register(Member member) {

        // 아이디 중복 체크
        if (memberRepository.existsByLoginId(member.getLoginId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        // 이메일 중복 체크
        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 약관 동의 체크
        if (!member.isTermsAgreed()) {
            throw new IllegalArgumentException("이용약관에 동의해야 합니다.");
        }

        if (!member.isPrivacyAgreed()) {
            throw new IllegalArgumentException("개인정보 수집 및 이용에 동의해야 합니다.");
        }

        // 비밀번호 암호화
        member.setPassword(passwordEncoder.encode(member.getPassword()));

        // role 기본값
        if (member.getRole() == null) {
            member.setRole(MemberRole.USER);
        }

        // status 기본값
        if (member.getStatus() == null) {
            member.setStatus(MemberStatus.ACTIVE);
        }

        return memberRepository.save(member);
    }

    // 2. 로그인 (조회)
    @Transactional(readOnly = true)
    public Member login(String loginId, String password) {

        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("아이디가 존재하지 않습니다."));

        if (member.getStatus() != MemberStatus.ACTIVE) {
            throw new IllegalStateException("비활성화 또는 제한된 계정입니다.");
        }

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return member;
    }

    // 3. ID로 회원 조회
    @Transactional(readOnly = true)
    public Member findById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
    }

    // 4. loginId로 조회
    @Transactional(readOnly = true)
    public Member findByLoginId(String loginId) {
        return memberRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
    }

    // 5. 전체 회원 목록
    @Transactional(readOnly = true)
    public List<Member> findAll() {
        return memberRepository.findAllByOrderByIdDesc();
    }

    // 6. 상태별 회원 목록
    @Transactional(readOnly = true)
    public List<Member> findByStatus(MemberStatus status) {
        return memberRepository.findByStatusOrderByIdDesc(status);
    }

    // 7. 회원 정보 수정 (Dirty Checking)
    public Member update(Long id, String name, String email, String phone) {

        Member member = findById(id);

        if (!member.getEmail().equals(email) && memberRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }

        member.setName(name);
        member.setEmail(email);
        member.setPhone(phone);

        // memberRepository.save(member); // ❌ Dirty Checking으로 자동 반영

        return member;
    }

    // 8. 회원 탈퇴 (Soft Delete)
    public void delete(Long id) {
        Member member = findById(id);
        member.setStatus(MemberStatus.KICK);

        // memberRepository.save(member); // ❌ Dirty Checking
    }

    // 9. 관리자 - 상태 토글
    public void toggleStatus(Long id) {
        Member member = findById(id);

        if (member.getStatus() == MemberStatus.ACTIVE) {
            member.setStatus(MemberStatus.INACTIVE);
        } else {
            member.setStatus(MemberStatus.ACTIVE);
        }

        // memberRepository.save(member); // ❌ Dirty Checking
    }

    // 10. 관리자 - 강퇴
    public void forceKick(Long id) {
        Member member = findById(id);
        member.setStatus(MemberStatus.KICK);

        // memberRepository.save(member); // ❌ Dirty Checking
    }
}