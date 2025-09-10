package com.unihub.app.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RsvpRequest {
    private Integer eventId;
    private String userEmail;
}