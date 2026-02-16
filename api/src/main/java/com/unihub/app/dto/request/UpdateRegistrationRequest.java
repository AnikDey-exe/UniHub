package com.unihub.app.dto.request;

import com.unihub.app.model.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRegistrationRequest {
    private RegistrationStatus newStatus;
}
