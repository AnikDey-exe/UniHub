package com.unihub.app.dto.request;

import com.unihub.app.model.RegistrationStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RsvpRequest {
    private Integer eventId;
    private String userEmail;
    private String displayName;
    private Integer tickets = 1;
    private RegistrationStatus status;
    private List<AnswerRequest> answers;
}