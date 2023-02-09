package com.korit.library.service;

import com.korit.library.entity.BookLike;
import com.korit.library.exception.CustomLikeException;
import com.korit.library.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor    // final 붙여주면 @Autowired랑 같은 역할
public class LikeService {


    public final LikeRepository likeRepository;


    public int like(int bookId, int userId){
        BookLike bookLike = BookLike.builder()
                .bookId(bookId)
                .userId(userId)
                .build();
//      좋아요가 이미 눌러진 상태일 때 좋아요를 취소해 주세요 라는 에러발생 ( > 1 일떄)
//      좋아요가 눌러지지 않은 상태일 때 좋아요를 눌러주세요 라는 에러발생 ( == 0 일때)
        if(likeRepository.getLikeStatus(bookLike) != 0){
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("likeError", "좋아요를 취소해주세요.");
            throw new CustomLikeException(errorMap);
        }

        likeRepository.addLike(bookLike);
        return likeRepository.getLikeCount(bookId);
    }


    public int disLike(int bookId, int userId){
        BookLike bookLike = BookLike.builder()
                .bookId(bookId)
                .userId(userId)
                .build();
//      좋아요가 이미 눌러진 상태일 때 좋아요를 취소해 주세요 라는 에러발생 ( > 1 일떄)
//      좋아요가 눌러지지 않은 상태일 때 좋아요를 눌러주세요 라는 에러발생 ( == 0 일때)
        if(likeRepository.getLikeStatus(bookLike) == 0){
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("likeError", "좋아요를 눌러주세요.");
            throw new CustomLikeException(errorMap);
        }

        likeRepository.deleteLike(bookLike);
        return likeRepository.getLikeCount(bookId);
    }


}
