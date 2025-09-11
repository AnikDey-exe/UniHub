package com.unihub.app.dto.request;

import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventRequest {
    private String name;
    private String type;
    private String description;
    private String location;
    private Integer capacity;
}
