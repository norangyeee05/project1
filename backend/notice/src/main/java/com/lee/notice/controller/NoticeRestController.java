package com.lee.notice.controller;

import com.lee.notice.dto.NoticeRequest;
import com.lee.notice.dto.NoticeResponse;
import com.lee.notice.entity.Notice;
import com.lee.notice.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeRestController {
    private final NoticeService noticeService;

    //생성: 201 -> HttpStatus.CREATED
    //삭제: 204 -> HttpStatus.NO_CONTENT
    //조회/수정: 200 -> HttpStatus.OK

    //목록: GET http://localhost:8081/api/notices
    @GetMapping //requestMapping(method = Method.GET) 이런식으로 지정을 해야 됨
    @ResponseStatus(HttpStatus.OK)
    public List<NoticeResponse> list() {
        return noticeService.findAll();
    }

    //목록: GET http://localhost:8081/api/notices/v2
    @GetMapping("/v2")
    @ResponseStatus(HttpStatus.OK)
    public List<Notice> list2() {
        return noticeService.findNoticeAll();
    }

    //글 상세보기: GET http://localhost:8081/api/notices/1
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public NoticeResponse detail(@PathVariable("id") Long id) {
        return noticeService.findById(id);
    }

    //글 상세보기: GET http://localhost:8081/api/notices/v2/1
    @GetMapping("/v2/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Notice detail2(@PathVariable("id") Long id) {
        return noticeService.findNoticeById(id);
    }

    //글 등록: POST http://localhost:8081/api/notices  text {"title": "제목1", "content": "내용1", "author": "admin"}
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoticeResponse create(@Valid @RequestBody NoticeRequest request) {
        return noticeService.create(request);
    }

    //글 등록: POST http://localhost:8081/api/notices/v2 text {"title": "제목1", "content": "내용1", "author": "admin"}
    @PostMapping("/v2")
    @ResponseStatus(HttpStatus.CREATED)
    public Notice create2(@Valid @RequestBody Notice request) {
        return noticeService.saveNotice(request);
    }


    //글 수정: PUT http://localhost:8081/api/notices/1 text {"title": "제목1 수정", "content": "내용1 수정", "author": "user"}
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public NoticeResponse update(@PathVariable("id") Long id,
                                 @Valid @RequestBody NoticeRequest request) {
        return noticeService.update(id, request);
    }

    //글 수정: PUT http://localhost:8081/api/notices/v2/1 text {"title": "제목1 수정", "content": "내용1 수정", "author": "user"}
    @PutMapping("/v2/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Notice update2(@PathVariable("id") Long id,
                                 @Valid @RequestBody Notice request) {
        return noticeService.updateNotice(id, request);
    }

    //글 삭제: Delete http://localhost:8081/api/notices/1
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        noticeService.delete(id);
    }

    //글 삭제: Delete http://localhost:8081/api/notices/v2/1
    @DeleteMapping("/v2/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete2(@PathVariable("id") Long id) {
        noticeService.deleteNotice(id);
    }
}
