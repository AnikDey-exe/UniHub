package com.unihub.app.service;

import com.unihub.app.dto.AppUserDTO;
import com.unihub.app.dto.DTOMapper;
import com.unihub.app.dto.request.UpdateUserRequest;
import com.unihub.app.exception.UserNotFoundException;
import com.unihub.app.model.AppUser;
import com.unihub.app.repository.AppUserRepo;
import com.unihub.app.repository.EventRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppUserService {
    @Autowired
    private EventRepo eventRepo;
    @Autowired
    private AppUserRepo appUserRepo;
    @Autowired
    private DTOMapper dtoMapper;

    public List<AppUserDTO> getAllUsers(){
        List<AppUser> appUsers = appUserRepo.findAll();
        List<AppUserDTO> appUserDTOS = new ArrayList<AppUserDTO>();
        for(AppUser user: appUsers) {
            appUserDTOS.add(dtoMapper.toAppUserDTO(user));
        }
        return appUserDTOS;
    }

    public AppUserDTO saveUser(AppUser user) {
        AppUser savedUser = appUserRepo.save(user);
        AppUserDTO userDTO = dtoMapper.toAppUserDTO(savedUser);
        log.info("User with name: {} saved successfully", user.getFirstName());
        return userDTO;
    }

    public AppUserDTO updateUserProfile(Integer id, UpdateUserRequest toUpdate) {
        AppUser user = appUserRepo.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (toUpdate.getFirstName() != null) user.setFirstName(toUpdate.getFirstName());
        if (toUpdate.getLastName() != null) user.setLastName(toUpdate.getLastName());
        if (toUpdate.getMiddleName() != null) user.setMiddleName(toUpdate.getMiddleName());
        if (toUpdate.getPhoneNumber() != null) user.setPhoneNumber(toUpdate.getPhoneNumber());
        if (toUpdate.getAbout() != null) user.setAbout(toUpdate.getAbout());
        if (toUpdate.getProfilePicture() != null) user.setProfilePicture(toUpdate.getProfilePicture());

        AppUser updatedUser = appUserRepo.save(user);
        return dtoMapper.toAppUserDTO(updatedUser);
    }
}
