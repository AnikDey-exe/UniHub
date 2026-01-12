package com.unihub.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Integer id;
    private String name;
    private String type;
    private String description;
    private String location;
    private String image;
    private int capacity;
    private int numAttendees;
    private Instant eventStartDateUtc;
    private Instant eventEndDateUtc;
    private String eventTimezone;
    private AppUserSummaryDTO creator;
    private Set<RegistrationDTO> attendees;
}

