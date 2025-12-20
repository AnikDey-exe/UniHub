package com.unihub.app.controller;

import com.unihub.app.dto.CollegeDTO;
import com.unihub.app.dto.EventDTO;
import com.unihub.app.model.College;
import com.unihub.app.model.Event;
import com.unihub.app.service.CollegeService;
import com.unihub.app.service.EventService;
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

//    @PostMapping("/scrape")
//    public ResponseEntity<String> scrapeColleges() {
//        collegeService.scrapeColleges();
//        return ResponseEntity.ok().body("Successfully scraped colleges");
//    }

}
