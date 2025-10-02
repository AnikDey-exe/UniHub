package com.unihub.app.service;

import com.unihub.app.dto.CollegeDTO;
import com.unihub.app.dto.DTOMapper;
import com.unihub.app.exception.UserNotFoundException;
import com.unihub.app.model.AppUser;
import com.unihub.app.model.College;
import com.unihub.app.repository.CollegeRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollegeService {
    @Autowired
    private CollegeRepo collegeRepo;

    @Autowired
    private DTOMapper dtoMapper;

    public CollegeDTO saveCollege(College college) {
        College savedCollege = collegeRepo.save(college);
        CollegeDTO collegeDTO = dtoMapper.toCollegeDTO(savedCollege);

        return collegeDTO;
    }
}
