package com.unihub.app.repository;

import com.unihub.app.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepo extends JpaRepository<Event, Integer> {
//    List<Event> findByName(String name);
}
