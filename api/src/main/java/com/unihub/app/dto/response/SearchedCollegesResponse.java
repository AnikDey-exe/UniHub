package com.unihub.app.dto.response;

import com.unihub.app.dto.CollegeDTO;
import com.unihub.app.dto.EventDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchedCollegesResponse {
    private List<CollegeDTO> colleges;
    private String lastNameASC;
    private boolean hasNext;
}
