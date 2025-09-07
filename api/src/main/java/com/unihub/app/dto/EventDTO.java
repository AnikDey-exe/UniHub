package com.unihub.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Integer id;
    private String name;
    private String type;
    private String description;
    private String location;
    private int capacity;
    private AppUserSummaryDTO appUser;
}

