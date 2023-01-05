package com.korit.library.config;


import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {


//    @Bean
//    public BCryptPasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());  //
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.httpBasic().disable(); // 기본 로그인 페이지를 제한걸어줌
        http.authorizeRequests()
                .antMatchers("/mypage/**", "/security/**")                 // /mypage에 들어오는 요청에는
                .authenticated()                                                      // 인증이 필요하다
                .anyRequest()                                                        // 다른것들은
                .permitAll()                                                         // 인증 필요없다
                .and()
                .formLogin()                                                       //우리가 로그인 할건데 form을 통한 로그인을 하겠다
                .loginPage("/account/login")                                        //로그인 페이지 get요청
                .loginProcessingUrl("/account/login")                               // 로그인 인증 post요청
                .defaultSuccessUrl("/index");

    }


}
