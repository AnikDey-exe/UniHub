package com.unihub.app.service;

import com.unihub.app.model.AppUser;
import com.unihub.app.repository.AppUserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppUserService {
    @Autowired
    private AppUserRepo appUserRepo;

    public List<AppUser> getAllUsers(){
        return appUserRepo.findAll();
    }

    public AppUser saveUser(AppUser user) {
        AppUser savedUser = appUserRepo.save(user);

        log.info("User with name: {} saved successfully", user.getFirstName());
        return savedUser;
    }
}
