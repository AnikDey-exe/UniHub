package com.unihub.app.repository;

import com.unihub.app.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepo extends JpaRepository<AppUser, Integer> {
    Optional<AppUser> findByEmail(String email);
}
