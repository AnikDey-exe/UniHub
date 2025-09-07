package com.unihub.app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventSummaryDTO {
    private Integer id;

    private String name;

    private String type;

    private String description;

    private String location;

    private int capacity;
}
