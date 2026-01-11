package com.unihub.app.dto;

import com.unihub.app.dto.request.UpdateUserRequest;
import com.unihub.app.model.AppUser;
import com.unihub.app.model.College;
import com.unihub.app.model.Event;

import com.unihub.app.model.Registration;
import org.hibernate.sql.Update;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring") // lets Spring inject it
public interface DTOMapper {

    // Event -> EventDTO
    @Mapping(target = "creator", source = "creator")
    @Mapping(target = "attendees", source = "attendees")
    EventDTO toEventDTO(Event event);

    // AppUser -> AppUserDTO
    @Mapping(target = "eventsCreated", source = "eventsCreated")
    @Mapping(target = "eventsAttended", source = "eventsAttended")
    @Mapping(target = "college", source = "college")
    AppUserDTO toAppUserDTO(AppUser appUser);

    @Mapping(target = "students", source = "students")
    CollegeDTO toCollegeDTO(College college);

    @Mapping(target = "attendee", source = "attendee")
    @Mapping(target = "event", source = "event")
    RegistrationDTO toRegistrationDTO(Registration registration);

    // Smaller objects
    AppUserSummaryDTO toAppUserSummaryDTO(AppUser appUser);

    List<AppUserSummaryDTO> toAppSummaryDTO(List<AppUser> appUsers);

    EventSummaryDTO toEventSummaryDTO(Event event);

    List<EventSummaryDTO> toEventSummaryDTO(List<Event> events);

    CollegeSummaryDTO toCollegeSummaryDTO(College college);
}