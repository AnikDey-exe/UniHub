package com.unihub.app.controller;

import com.unihub.app.dto.AppUserDTO;
import com.unihub.app.dto.request.LoginRequest;
import com.unihub.app.dto.request.UpdateUserRequest;
import com.unihub.app.dto.request.VerificationRequest;
import com.unihub.app.dto.response.LoginResponse;
import com.unihub.app.dto.response.VerificationResponse;
import com.unihub.app.model.AppUser;
import com.unihub.app.service.AppUserService;
import com.unihub.app.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "https://3u8e7mvzmi.us-east-2.awsapprunner.com"})
public class AppUserController {
    @Autowired
    private AppUserService appUserService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/")
    public ResponseEntity<List<AppUserDTO>> getUsers() {
        return ResponseEntity.ok().body(appUserService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUserDTO> updateUserProfile(@PathVariable Integer id, @ModelAttribute UpdateUserRequest toUpdate, @RequestParam(value = "image", required = false) MultipartFile image) throws FileUploadException {
        return ResponseEntity.ok().body(appUserService.updateUserProfile(id, toUpdate, image));
    }

    @PostMapping("/register")
    public ResponseEntity<AppUserDTO> register(@ModelAttribute AppUser user, @RequestParam(value = "image", required = false) MultipartFile image) throws FileUploadException {
        return ResponseEntity.ok().body(appUserService.saveUser(user, image));
    }

    @PostMapping("/send-verification")
    public ResponseEntity<VerificationResponse> sendVerificationCode(@RequestBody VerificationRequest userInput) {
        return ResponseEntity.ok().body(appUserService.sendVerificationEmail(userInput.getUserEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest userInput) {
        AppUser user = appUserService.login(userInput);

        String jwtToken = jwtService.generateToken(user);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok().body(loginResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<AppUserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername(); // email from JWT

        return ResponseEntity.ok(appUserService.me(email));
    }
}
