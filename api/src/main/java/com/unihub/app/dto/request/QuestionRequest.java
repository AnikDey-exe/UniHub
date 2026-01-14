package com.unihub.app.dto.request;

import com.unihub.app.model.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {
    private String question;
    private QuestionType type;
    private List<String> choices;
    private boolean required;
}

