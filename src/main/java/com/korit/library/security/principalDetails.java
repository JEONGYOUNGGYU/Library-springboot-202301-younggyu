package com.korit.library.security;

import com.korit.library.web.dto.RoleDtlDto;
import com.korit.library.web.dto.RoleMstDto;
import com.korit.library.web.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@AllArgsConstructor
public class PrincipalDetails implements UserDetails {

    @Getter
    private final UserDto user;
    private Map<String, Object> response;

    // 권한을 리스트로 관리하는 부분
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        ArrayList<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();

        List<RoleDtlDto> roleDtlDtoList = user.getRoleDtlDto();

        for(int i = 0; i < roleDtlDtoList.size(); i++) {
            RoleDtlDto roleDtlDto = roleDtlDtoList.get(i);  // 0 = ROLE_USER, 1 = ROLE_ADMIN
            RoleMstDto roleMstDto = roleDtlDto.getRoleMstDto();
            String roleName = roleMstDto.getRoleName();

            GrantedAuthority role = new GrantedAuthority() {
                @Override
                public String getAuthority() {
                    return roleName;
                }
            };

            authorities.add(role);
//            System.out.println(roleName == role.getAuthority())
          } // ↑여기코드랑
            // ↓여기코드랑 같다
        user.getRoleDtlDto().forEach(dtl -> {                               // list를 forEach
            authorities.add(() -> dtl.getRoleMstDto().getRoleName());

        });
        return authorities;
    }

    @Override
    public String getPassword() {   //이 값으로 시큐리티 복호화
        return user.getPassword();
    }

    @Override
    public String getUsername() {   //이 값으로 시큐리티 복호화
        return user.getUsername();
    }

    /*
        계정만료 여부
    */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    /*
       계정 잠김 여부
    */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    /*
       비밀번호 만료 여부 <- 비밀번호 5번 틀렸을 때 잠기는 것
    */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    /*
       사용자 활성화 여부 <- 이메일 인증을 거쳐서 성공하면 true 아니면 false, 휴면계정도 마찬가지
    */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
