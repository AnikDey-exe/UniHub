package com.unihub.app.dto;

import com.unihub.app.dto.request.UpdateUserRequest;
import com.unihub.app.model.AppUser;
import com.unihub.app.model.Event;

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
    AppUserDTO toAppUserDTO(AppUser appUser);

    // Smaller objects
    AppUserSummaryDTO toAppUserSummaryDTO(AppUser appUser);

    EventSummaryDTO toEventSummaryDTO(Event event);

    List<EventSummaryDTO> toEventSummaryDTO(List<Event> events);
}