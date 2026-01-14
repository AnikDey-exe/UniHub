package com.unihub.app.dto.request;

import com.unihub.app.dto.AppUserSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequest {
    private String name;
    private String type;
    private String description;
    private String location;
    private int capacity;
    private Instant eventStartDateUtc;
    private Instant eventEndDateUtc;
    private String eventTimezone;
    private int creatorId;
    private String questionsJson;
    private int maxTickets;
    private boolean requiresApproval;
    private String approvalSuccessMessage;
}
