package com.unihub.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class EmailDTO {
    private String recipient;
    private String messageBody;
    private String subject;
}
