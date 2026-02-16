package com.unihub.app.dto.response;

import com.unihub.app.model.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredResponse {
    private boolean exists;
    private int id;
    private String displayName;
    private RegistrationStatus status;
}
