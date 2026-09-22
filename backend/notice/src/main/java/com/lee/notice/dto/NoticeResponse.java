package com.lee.notice.dto;
//데이터 보낼 목적, 검증 X 출력만, 가져오는 건 setter가 아니라 builder로

import com.lee.notice.entity.Notice;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NoticeResponse {

    private Long id;
    private String title;
    private String content;
    private String author;
    private Long hits;
    private LocalDateTime createdAt;

    //service에서 해도 되는데 지금은 dto에서 하는거임
    //내부에서 Notice를 받아서 -> NoticeResponse로 반환하겠다고 선언
    //나중에 from만 호출하면 Notice가 알아서 NoticeResponse가 됨
    public static NoticeResponse from(Notice notice) {
        return NoticeResponse.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .author(notice.getAuthor())
                .hits(notice.getHits())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}
