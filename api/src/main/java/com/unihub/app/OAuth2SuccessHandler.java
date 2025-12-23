package com.unihub.app;

import com.unihub.app.model.AppUser;
import com.unihub.app.repository.AppUserRepo;
import com.unihub.app.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AppUserRepo appUserRepo;

    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();

        String email = extractEmail(user);

        if (email == null || !email.endsWith(".edu")) {
            response.sendError(403, "Only .edu emails allowed");
            return;
        }

        System.out.println("User email: "+email);

//        AppUser dbUser = appUserRepo.findByEmail(email)
//                .orElseGet(() -> createUser(user, email));
//
//        String jwt = jwtService.generateToken(dbUser);
//
//        response.sendRedirect("http://localhost:3000/oauth-success?token=" + jwt);
    }

    private String extractEmail(OAuth2User user) {
        if (user.getAttribute("email") != null)
            return user.getAttribute("email");

        return user.getAttribute("preferred_username"); // for Microsoft OAuth2
    }

    private AppUser createUser(OAuth2User user, String email) {
        AppUser u = new AppUser();
        u.setEmail(email);
        u.setFirstName(user.getAttribute("name"));
        return appUserRepo.save(u);
    }
}
