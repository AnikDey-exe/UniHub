package com.unihub.app.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollegeSearchRequest {
    private String location;
    private String searchQuery;
    private String sortBy = "name_asc";
    private int limit = 3;
    private String lastNameASC;
}
