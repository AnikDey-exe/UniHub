package com.unihub.app.dto;

import com.unihub.app.model.AppUser;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class CollegeDTO {
    private Integer id;
    private String name;
    private String location;
    private String thumbnail;
    List<AppUserSummaryDTO> students;
}
