package com.unihub.app.dto;

import com.unihub.app.model.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Integer id;
    private String question;
    private QuestionType type;
    private String[] choices;
    private boolean required;
}
