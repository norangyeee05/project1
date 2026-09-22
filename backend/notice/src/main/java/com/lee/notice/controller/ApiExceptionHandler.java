package com.lee.notice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    //입력값(파라미터값) 잘못된 경우 : 400 -> HttpStatus.BAD_REQUEST
    //권한없음(로그인 안된 상태) : 401 -> HttpStatus.UNAUTHORIZED
    //인가는 됐으나 권한이 없음 : 403 -> HttpStatus.FORBIDDEN
    //잘못된 URL 요청 : 404 -> HttpStatus.NOT_FOUND
    //잘못된 요청방식 (POST로 했는데 GET으로 하는 거) : 405 -> HttpStatus.METHOD_NOT_ALLOWED
    //핸들링 되지 않는 모든 예외(서버 처리 불가): 500 -> HttpStatus.INTERNAL_SERVER_ERROR

    //400 오류 - 입력값을 확인해주세요
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidation(MethodArgumentNotValidException e) {
        //메세지를 getBindingResult에서 가져옴, getFieldErrors - 리스트인 경우
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(field -> field.getDefaultMessage())
                .orElse("입력값을 확인해주세요");
        return error(HttpStatus.BAD_REQUEST.value(), message);
    }

    //404 오류 http://localhost:8081/api/notices/1 << 이 형식이 아니라 다른 형식으로 요청이 된 경우, 기본메세지
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleIllegalArgumentException(IllegalArgumentException e) {
        return error(HttpStatus.NOT_FOUND.value(), e.getMessage());
    }

    //500 오류 - 서버 오류가 발생하였습니다.
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> internalServerError(IllegalArgumentException e) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버 오류가 발생하였습니다.");
    }

    //java map -> json으로 내보내는 방법
    public Map<String, Object> error(int status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status);
        body.put("message", message);
        /*
        json에서 아래와 같이 처리가 됨
        {
        "status": 400,
        "message": "입력값을 확인해주세요"
        }
        */
        return body;
    }
}
