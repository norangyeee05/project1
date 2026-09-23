package com.logic.project.controller;

import com.logic.project.entity.Member;
import com.logic.project.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    // 1. 로그인 화면 로딩
    @GetMapping("/login")
    public String loginForm() {
        return "member/login";
    }

    // 2. 로그인 처리
    @PostMapping("/login")
    public String login(@RequestParam String loginId,
                        @RequestParam String password,
                        HttpSession session,
                        Model model) {

        try {
            Member member = memberService.login(loginId, password);
            session.setAttribute("loginMember", member); // 세션 저장
            return "redirect:/";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "member/login";
        }
    }

    // 3. 로그아웃 처리
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate(); // 세션 제거
        return "redirect:/";
    }

    // 4. 약관 화면 로딩
    @GetMapping("/terms")
    public String terms() {
        return "member/terms";
    }

    // 5. 회원 가입 화면 로딩
    @GetMapping("/signup")
    public String signupForm(Model model) {
        model.addAttribute("member", new Member());
        return "member/signup";
    }

    // 6. 회원 가입 처리
    @PostMapping("/signup")
    public String signup(@ModelAttribute Member member, Model model) {

        try {
            memberService.register(member);
            return "redirect:/members/login";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "member/signup";
        }
    }

    // 7. 마이 페이지
    @GetMapping("/mypage")
    public String mypage(HttpSession session, Model model) {

        Member loginMember = (Member) session.getAttribute("loginMember");

        if (loginMember == null) {
            return "redirect:/members/login";
        }

        Member member = memberService.findById(loginMember.getId());
        model.addAttribute("member", member);

        return "member/mypage";
    }

    // 8. 회원 정보 수정 폼 로딩
    @GetMapping("/edit")
    public String editForm(HttpSession session, Model model) {

        Member loginMember = (Member) session.getAttribute("loginMember");

        if (loginMember == null) {
            return "redirect:/members/login";
        }

        model.addAttribute("member", loginMember);
        return "member/edit";
    }

    // 9. 회원 정보 수정 처리
    @PostMapping("/edit")
    public String edit(@RequestParam String name,
                       @RequestParam String email,
                       @RequestParam String phone,
                       HttpSession session) {

        Member loginMember = (Member) session.getAttribute("loginMember");

        if (loginMember == null) {
            return "redirect:/members/login";
        }

        memberService.update(loginMember.getId(), name, email, phone);

        return "redirect:/members/mypage";
    }

    // 10. 회원 탈퇴 화면 로딩
    @GetMapping("/delete")
    public String deleteForm(HttpSession session) {

        Member loginMember = (Member) session.getAttribute("loginMember");

        if (loginMember == null) {
            return "redirect:/members/login";
        }

        return "member/delete";
    }

    // 11. 회원 탈퇴 처리
    @PostMapping("/delete")
    public String delete(HttpSession session) {

        Member loginMember = (Member) session.getAttribute("loginMember");

        if (loginMember == null) {
            return "redirect:/members/login";
        }

        memberService.delete(loginMember.getId());
        session.invalidate();

        return "redirect:/";
    }
}
