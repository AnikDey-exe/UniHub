package com.unihub.app.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventSearchRequest {
    private List<String> types;
    private Instant startDate;
    private Instant endDate;
    private Integer minAttendees;
    private String searchQuery;
    private String sortBy = "recency";
    private int limit = 3;
    private Integer lastNumAttendees;
    private Instant lastStartDate;
}
