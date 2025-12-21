package com.unihub.app.controller;

import com.unihub.app.dto.CollegeDTO;
import com.unihub.app.dto.request.CollegeSearchRequest;
import com.unihub.app.dto.response.SearchedCollegesResponse;
import com.unihub.app.model.College;
import com.unihub.app.service.CollegeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
@Slf4j
public class CollegeController {
    @Autowired
    private CollegeService collegeService;

    @GetMapping("/")
    public ResponseEntity<List<CollegeDTO>> getColleges() {
        return ResponseEntity.ok().body(collegeService.getAllColleges());
    }

    @PostMapping("/create")
    public ResponseEntity<CollegeDTO> saveCollege(@RequestBody College college) {
        return ResponseEntity.ok().body(collegeService.saveCollege(college));
    }

    @GetMapping("/search")
    public ResponseEntity<SearchedCollegesResponse> getSearchedColleges(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "3") int limit,
            @RequestParam(required = false) String lastNameASC
    ) {
        CollegeSearchRequest request = new CollegeSearchRequest(location, searchQuery, sortBy, limit, lastNameASC);
        return ResponseEntity.ok().body(collegeService.getColleges(request));
    }

    // will need to run scraping script in prod
//    @PostMapping("/scrape")
//    public ResponseEntity<String> scrapeColleges() {
//        collegeService.scrapeColleges();
//        return ResponseEntity.ok().body("Successfully scraped colleges");
//    }

}
