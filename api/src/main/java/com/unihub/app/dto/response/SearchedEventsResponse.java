package com.unihub.app.dto.response;

import com.unihub.app.dto.EventDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchedEventsResponse {
    private List<EventDTO> events;
    private Integer lastNumAttendees;
    private Instant lastStartDate;
    private boolean hasNext;
}
