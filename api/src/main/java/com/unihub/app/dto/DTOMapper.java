package com.unihub.app.dto;

import com.unihub.app.model.AppUser;
import com.unihub.app.model.Event;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring") // lets Spring inject it
public interface DTOMapper {

    // Event -> EventDTO
    @Mapping(target = "appUser", source = "appUser")
    EventDTO toEventDTO(Event event);

    // AppUser -> AppUserDTO
    @Mapping(target = "eventsCreated", source = "eventsCreated")
    AppUserDTO toAppUserDTO(AppUser appUser);

    // Smaller objects
    AppUserSummaryDTO toAppUserSummaryDTO(AppUser appUser);

    EventSummaryDTO toEventSummaryDTO(Event event);

    List<EventSummaryDTO> toEventSummaryDTO(List<Event> events);
}