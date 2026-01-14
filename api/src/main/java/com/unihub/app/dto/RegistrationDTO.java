package com.unihub.app.dto;

import com.unihub.app.model.AppUser;
import com.unihub.app.model.Event;
import com.unihub.app.model.RegistrationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDTO {
    private Integer id;
    private String displayName;
    private Integer tickets;
    private RegistrationStatus status;
    private AppUserSummaryDTO attendee;
    private EventSummaryDTO event;
    private List<AnswerDTO> answers;
}
