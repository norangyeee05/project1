package com.logic.project.controller;

import com.logic.project.entity.Member;
import com.logic.project.entity.MemberRole;
import com.logic.project.entity.MemberStatus;
import com.logic.project.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final MemberService memberService;

    // 관리자 + 로그인 체크 통합
    private Member checkAdmin(HttpSession session) {
        Member member = (Member) session.getAttribute("loginMember");
        if (member == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        if (member.getRole() != MemberRole.ADMIN) {
            throw new IllegalStateException("관리자만 접근 가능합니다.");
        }
        return member;
    }

    // 1. 회원 목록
    @GetMapping("/members")
    public String memberList(HttpSession session, Model model) {
        try {
            checkAdmin(session);
            List<Member> members = memberService.findAll();
            model.addAttribute("members", members);
            return "admin/member/list";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "redirect:/";
        }
    }

    // 2. 회원 상세
    @GetMapping("/members/{id}")
    public String memberDetail(@PathVariable("id") Long id,
                               HttpSession session,
                               Model model) {
        try {
            checkAdmin(session);
            Member member = memberService.findById(id);
            model.addAttribute("member", member);
            return "admin/member/detail";

        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "redirect:/";
        }
    }

    // 3. 회원 활성화
    @PostMapping("/members/{id}/activate")
    public String activate(@PathVariable("id") Long id, HttpSession session) {
        try {
            checkAdmin(session);
            Member member = memberService.findById(id);
            member.setStatus(MemberStatus.ACTIVE); // Dirty Checking
            return "redirect:/admin/members";
        } catch (IllegalArgumentException e) {
            return "redirect:/";
        }
    }

    // 4. 회원 비활성화
    @PostMapping("/members/{id}/deactivate")
    public String deactivate(@PathVariable("id") Long id, HttpSession session) {
        try {
            checkAdmin(session);
            Member member = memberService.findById(id);
            member.setStatus(MemberStatus.INACTIVE); // Dirty Checking
            return "redirect:/admin/members";
        } catch (IllegalArgumentException e) {
            return "redirect:/";
        }
    }

    // 5. 회원 강퇴
    @PostMapping("/members/{id}/kick")
    public String kick(@PathVariable("id") Long id, HttpSession session) {
        try {
            checkAdmin(session);
            memberService.forceKick(id);
            return "redirect:/admin/members";
        } catch (IllegalArgumentException e) {
            return "redirect:/";
        }
    }
}