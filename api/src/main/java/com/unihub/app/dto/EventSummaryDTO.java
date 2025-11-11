package com.unihub.app.dto;

import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

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
    private int numAttendees;
    private Instant eventStartDateUtc;
    private Instant eventEndDateUtc;
    private String eventTimezone;
}
