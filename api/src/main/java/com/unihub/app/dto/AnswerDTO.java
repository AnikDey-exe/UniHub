package com.unihub.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDTO {
    private Integer id;
    private String singleAnswer;
    private String[] multiAnswer;
    private QuestionDTO question;
    private RegistrationSummaryDTO registration;
}
