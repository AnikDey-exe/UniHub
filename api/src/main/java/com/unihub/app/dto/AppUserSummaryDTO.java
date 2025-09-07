package com.unihub.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUserSummaryDTO {
    private Integer id;

    private String email;

    private String phoneNumber;

    private String firstName;

    private String middleName;

    private String lastName;

    private String about;

    private String profilePicture;
}
