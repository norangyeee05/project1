package com.lee.notice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notice")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //값을 자동으로 증가시킴
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT") //글자수가 150 넘어가면 TEXT로 해주어야 함
    private String content;

    @Column(nullable = false, length = 50)
    @Builder.Default //builder 패턴 사용 시 초기화
    private String author = "admin";

    @Builder.Default //기본값으로 사용하기 위해 지정하는 것
    @Column(nullable = false)
    private Long hits = 0L;

    //DB에서는 대소문자 구분 X, 자동으로 _at로 안되는 경우가 있어서 아래처럼 name으로 지정해주기
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (hits == null) {
            hits = 0L;
        }
        if (author == null) {
            author = "admin";
        }
    }
}
