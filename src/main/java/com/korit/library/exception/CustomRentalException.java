package com.korit.library.exception;


import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;


@AllArgsConstructor // 전체생성자 만들기
@Getter
public class CustomRentalException extends RuntimeException {

    private Map<String, String> errorMap;


}
