package com.korit.library.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@AllArgsConstructor
@Data
public class UserDto {
    private int userId;

    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotBlank
    private String name;
    @NotBlank
    @Email
    private String email;


    private List<RoleDtlDto> roleDtlDto;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}
