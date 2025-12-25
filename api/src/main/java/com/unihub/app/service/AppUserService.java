package com.unihub.app.service;

import com.unihub.app.dto.AppUserDTO;
import com.unihub.app.dto.DTOMapper;
import com.unihub.app.dto.EmailDTO;
import com.unihub.app.dto.request.LoginRequest;
import com.unihub.app.dto.request.UpdateUserRequest;
import com.unihub.app.dto.response.VerificationResponse;
import com.unihub.app.exception.UserNotFoundException;
import com.unihub.app.model.AppUser;
import com.unihub.app.repository.AppUserRepo;
import com.unihub.app.repository.EventRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

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
    @Autowired
    private EmailService emailService;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public List<AppUserDTO> getAllUsers(){
        List<AppUser> appUsers = appUserRepo.findAll();
        List<AppUserDTO> appUserDTOS = new ArrayList<AppUserDTO>();
        for(AppUser user: appUsers) {
            appUserDTOS.add(dtoMapper.toAppUserDTO(user));
        }
        return appUserDTOS;
    }

    public AppUserDTO saveUser(AppUser userInput) {
        AppUser user = new AppUser();

        user.setId(userInput.getId());
        user.setEmail(userInput.getEmail());
        user.setPhoneNumber(userInput.getPhoneNumber());
        user.setFirstName(userInput.getFirstName());
        user.setMiddleName(userInput.getMiddleName());
        user.setLastName(userInput.getLastName());
        user.setAbout(userInput.getAbout());
        user.setProfilePicture(userInput.getProfilePicture());
        user.setPassword(passwordEncoder.encode(userInput.getPassword()));


        AppUser savedUser = appUserRepo.save(user);
        AppUserDTO userDTO = dtoMapper.toAppUserDTO(savedUser);
        log.info("User with name: {} saved successfully", user.getFirstName());
        return userDTO;
    }

    public VerificationResponse sendVerificationEmail(String userEmail) {
        Random random = new Random();
        DecimalFormat decimalFormat = new DecimalFormat("000000");

        int randomNumber = random.nextInt(999999)+1;
        String verificationCode = decimalFormat.format(randomNumber);

        EmailDTO email = new EmailDTO(userEmail, "Your verification code is "+verificationCode, "UniHub: Verify Your Identity");
        emailService.sendSimpleEmailAsync(email);

        return new VerificationResponse(verificationCode);
    }

    public AppUser login(LoginRequest userInput) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userInput.getEmail(),
                        userInput.getPassword()
                )
        );

        AppUser user = appUserRepo.findByEmail(userInput.getEmail()).orElseThrow(() -> new UserNotFoundException("User not found"));
        // check if password length is not 0 because if it is then it is OAuth2 Account
        return user;
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

    public AppUserDTO me(String email) {
        AppUser user = appUserRepo.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        return dtoMapper.toAppUserDTO(user);
    }
}
