package com.unihub.app.repository;

import com.unihub.app.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepo extends JpaRepository<AppUser, Integer> {
    AppUser findByEmail(String email);
}
