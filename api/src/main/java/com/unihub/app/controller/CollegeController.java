package com.unihub.app.controller;

import com.unihub.app.dto.CollegeDTO;
import com.unihub.app.model.College;
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

}
