package com.korit.library.repository;

import com.korit.library.entity.UserMst;
import org.apache.catalina.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountRepository {
    public UserMst findUserByUsername(String username);
    public UserMst findUserByUserId(int userId);
    public int saveUser(UserMst user);
    public int saveRole(UserMst user);

    public int setUserProvider(UserMst user);
}
