package com.lee.notice.service;

import com.lee.notice.dto.NoticeRequest;
import com.lee.notice.dto.NoticeResponse;
import com.lee.notice.entity.Notice;
import com.lee.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.channels.IllegalChannelGroupException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) //상세보기 시 조회수 1 증가
public class NoticeService {
    private final NoticeRepository noticeRepository;

    //목록
    public List<NoticeResponse> findAll() {
        return noticeRepository.findAll(
                org.springframework.data.domain.Sort.by(Sort.Direction.DESC, "id") //id의 내림차순
                )
                .stream().map(NoticeResponse::from).toList();
        //return noticeRepository.findAll() 이렇게만 지정하면 반환타입이 List<Notice>가 돼서 오류가 발생함
        //map으로 바뀐 데이터를 toList를 해줌으로 List 형식으로 변경이 됨, NoticeResponse는 static이어야 작동됨
        //stream()은 여러건일 때 위와 같이 형식을 변경하게 선언해주는 역할임
    }

    //상세보기
    @Transactional
    public NoticeResponse findById(Long id) {
        Notice notice = noticeRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException(id+"공지사항을 찾을 수 없습니다."));

        //읽은 횟수 증가(NoticeRepository를 이용한 실제 DB, 엔티티)
        noticeRepository.increaseHits(id); // 여기서 넣은 id가 Param에 id에 대입이 되어서 작동됨
        notice.setHits(notice.getHits()+1); //사용자에게 1 증가된 수가 보여짐
        //Notice -> NoticeResponse
        return NoticeResponse.from(notice); //NoticeResponse에서 from에 엔티티를 넣었기에 값을 넣어주어야 함.
    }

    //글 등록
    @Transactional
    public NoticeResponse create(NoticeRequest request) {
        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(request.getAuthor())
                .hits(0L)
                .build();
        //request를 바로 넣으면 안되고, NoticeResponse.from를 하지 않으면 반환 타입이 notice가 됨 그럼 리스폰이 아니니까 오류가 생김
        return NoticeResponse.from(noticeRepository.save(notice));
    }

    //글 수정: findById(id) -> save(notice)
    @Transactional
    public NoticeResponse update(Long id, NoticeRequest request) { //이렇게 수정해줘
        Notice notice = noticeRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException(id+"번 글을 찾을 수 없습니다.")
        ); //notice가 바꿀 데이터가 됨 (기존 데이터 찾아온거임)
        //찾아온 notice에 request에서 가져온 값을 바꿔치기
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setAuthor(request.getAuthor());
        //위 값을 n으로 받아서 response로 반환
        //Notice n = noticeRepository.save(notice);
        //return NoticeResponse.from(n); ->
        //아래와 같이 한줄로 정리해서 사용할 수 있음
        return NoticeResponse.from(noticeRepository.save(notice));
    }

    //글 삭제
    @Transactional
    public void delete(Long id) {
        noticeRepository.deleteById(id);
    }

    //dto 사용 안하는 경우 - 보안 위험이 있음
    //dto(NoticeResponse) 사용 안하는 경우
    //글 목록
    public List<Notice> findNoticeAll() {
        return noticeRepository.findAll();
    }
    //상세보기
    public Notice findNoticeById(Long id) {
        return noticeRepository.findById(id).orElseThrow(()-> new IllegalArgumentException(id+"번 글이 존재하지 않습니다."));
    }

    //dto(NoticeResponse, NoticeRequest) 사용 안하는 경우
    //글 등록
    public Notice saveNotice(Notice notice) {
        return noticeRepository.save(notice);
    }
    //글 수정
    public Notice updateNotice(Long id, Notice notice) {
        Notice no = noticeRepository.findById(id).orElseThrow( () -> new IllegalArgumentException(id+"번 글이 존재하지 않습니다."));
        no.setTitle(notice.getTitle());
        no.setContent(notice.getContent());
        no.setAuthor(notice.getAuthor());
        return noticeRepository.save(no);
    }
    //글 삭제
    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}
