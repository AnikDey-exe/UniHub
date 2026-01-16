package com.unihub.app.dto;

import com.unihub.app.model.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationSummaryDTO {
    private Integer id;
    private String displayName;
    private Integer tickets;
    private RegistrationStatus status;
}
