package com.unihub.app.repository;

import com.unihub.app.model.AppUser;
import com.unihub.app.model.Event;
import com.unihub.app.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepo extends JpaRepository<Registration, Integer>  {
    Optional<Registration> findByEventAndAttendee(Event event, AppUser attendee);
    void deleteByEventAndAttendee(Event event, AppUser attendee);

    List<Registration> findAllByEvent(Event event);

    boolean existsByEventIdAndAttendeeId(Integer eventId, Integer attendeeId);
}
