package com.korit.library.web.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDto {
    private int userId;

    @NotBlank
    @ApiModelProperty(name = "username", value = "사용자이름", example = "abc", required = true)
    private String username;

    @NotBlank
    @ApiModelProperty(name = "username", value = "사용자이름", example = "abc", required = true)
    private String password;

    @NotBlank
    @ApiModelProperty(name = "username", value = "사용자이름", example = "abc", required = true)
    private String repassword;

    @NotBlank
    @Email
    @ApiModelProperty(name = "username", value = "사용자이름", example = "abc", required = true)
    private String email;


    private List<RoleDtlDto> roleDtlDto;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;

}
