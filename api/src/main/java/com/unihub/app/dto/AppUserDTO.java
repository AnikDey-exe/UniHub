package com.unihub.app.dto;

import com.unihub.app.dto.EventSummaryDTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUserDTO {
    private Integer id;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String middleName;
    private String lastName;
    private String about;
    private String profilePicture;
    List<EventSummaryDTO> eventsCreated;
    List<EventSummaryDTO> eventsAttended;
}
