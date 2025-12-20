package com.unihub.app.repository;

import com.unihub.app.model.College;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CollegeRepo extends JpaRepository<College, Integer>  {
    Optional<College> findByName(String name);
}

