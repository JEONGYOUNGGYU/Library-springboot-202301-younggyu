package com.korit.library.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/account")
public class AccountController {


    @GetMapping("/login")
    public String login(){
        return "account/login";
    }

    @GetMapping("register")
    public String register(){
        return "account/register";
    }
}
