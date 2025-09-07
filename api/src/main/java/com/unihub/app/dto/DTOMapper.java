package com.unihub.app.dto;

import com.unihub.app.model.AppUser;
import com.unihub.app.model.Event;

import java.util.ArrayList;
import java.util.List;

public class DTOMapper {
    public static EventDTO toEventDTO(Event event) {
        if (event == null) return null;

        EventDTO eventDTO = new EventDTO();

        eventDTO.setId(event.getId());
        eventDTO.setName(event.getName());
        eventDTO.setType(event.getType());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setLocation(event.getLocation());
        eventDTO.setCapacity(event.getCapacity());

        if (event.getAppUser() != null) eventDTO.setAppUser(toAppUserSummaryDTO(event.getAppUser()));

        return eventDTO;
    }

    public static AppUserDTO toAppUserDTO(AppUser appUser) {
        if (appUser == null) return null;

        AppUserDTO appUserDTO = new AppUserDTO();

        appUserDTO.setId(appUser.getId());
        appUserDTO.setEmail(appUser.getEmail());
        appUserDTO.setFirstName(appUser.getFirstName());
        appUserDTO.setMiddleName(appUser.getMiddleName());
        appUserDTO.setLastName(appUser.getLastName());
        appUserDTO.setAbout(appUser.getAbout());
        appUserDTO.setPhoneNumber(appUser.getPhoneNumber());
        appUserDTO.setProfilePicture(appUser.getProfilePicture());
        appUserDTO.setEventsCreated(toEventSummaryDTO(appUser.getEventsCreated()));

        return appUserDTO;
    }

    public static AppUserSummaryDTO toAppUserSummaryDTO(AppUser appUser) {
        AppUserSummaryDTO appUserSummaryDTO = new AppUserSummaryDTO();

        appUserSummaryDTO.setId(appUser.getId());
        appUserSummaryDTO.setEmail(appUser.getEmail());
        appUserSummaryDTO.setFirstName(appUser.getFirstName());
        appUserSummaryDTO.setMiddleName(appUser.getMiddleName());
        appUserSummaryDTO.setLastName(appUser.getLastName());
        appUserSummaryDTO.setAbout(appUser.getAbout());
        appUserSummaryDTO.setPhoneNumber(appUser.getPhoneNumber());
        appUserSummaryDTO.setProfilePicture(appUser.getProfilePicture());

        return appUserSummaryDTO;
    }

    public static List<EventSummaryDTO> toEventSummaryDTO(List<Event> events) {
        List<EventSummaryDTO> eventSummaryDTOS = new ArrayList<EventSummaryDTO>();

        for (Event event : events) {
            EventSummaryDTO eventSummaryDTO = new EventSummaryDTO();

            eventSummaryDTO.setId(event.getId());
            eventSummaryDTO.setName(event.getName());
            eventSummaryDTO.setType(event.getType());
            eventSummaryDTO.setDescription(event.getDescription());
            eventSummaryDTO.setLocation(event.getLocation());
            eventSummaryDTO.setCapacity(event.getCapacity());

            eventSummaryDTOS.add(eventSummaryDTO);
        }

        return eventSummaryDTOS;
    }
}
