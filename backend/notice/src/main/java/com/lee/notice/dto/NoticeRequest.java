package com.lee.notice.dto;
//공지사항을 받을 목적

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRequest {

    //폼검증 (@)
    @NotBlank(message = "제목을 입력하시오.")
    @Size(max = 200, message = "제목은 최대 200자까지 입력이 가능합니다.")
    private String title;

    @NotBlank(message = "내용을 입력하시오.")
    private String content;

    @NotBlank(message = "작성자를 입력하시오.")
    @Size(max = 50, message = "작성자는 최대 50자까지 가능합니다.")
    private String author;
}