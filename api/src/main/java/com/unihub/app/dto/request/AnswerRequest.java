package com.unihub.app.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    private Integer questionId;
    private String singleAnswer;
    private List<String> multiAnswer;
}
