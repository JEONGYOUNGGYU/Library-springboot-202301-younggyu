package com.korit.library.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {


    @GetMapping({"", "/index"})     // 두가지 요청을 다 쓸 수 있음  localhost:8000 으로 들어가나 localhost:8000/index로 들어가나 같음
    public String index(){
    return "index";
    }
}
