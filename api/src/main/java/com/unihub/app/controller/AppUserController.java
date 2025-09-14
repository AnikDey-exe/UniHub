package com.unihub.app.controller;

import com.unihub.app.dto.AppUserDTO;
import com.unihub.app.dto.request.LoginRequest;
import com.unihub.app.dto.request.UpdateUserRequest;
import com.unihub.app.dto.response.LoginResponse;
import com.unihub.app.model.AppUser;
import com.unihub.app.service.AppUserService;
import com.unihub.app.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Slf4j
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
    public ResponseEntity<AppUserDTO> updateUserProfile(@PathVariable Integer id, @RequestBody UpdateUserRequest toUpdate) {
        return ResponseEntity.ok().body(appUserService.updateUserProfile(id, toUpdate));
    }

    @PostMapping("/register")
    public ResponseEntity<AppUserDTO> register(@RequestBody AppUser user) {
        return ResponseEntity.ok().body(appUserService.saveUser(user));
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
}
