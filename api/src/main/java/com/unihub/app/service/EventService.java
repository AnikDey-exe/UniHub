package com.unihub.app.service;

import com.unihub.app.dto.DTOMapper;
import com.unihub.app.dto.EventDTO;
import com.unihub.app.model.AppUser;
import com.unihub.app.model.Event;
import com.unihub.app.repository.AppUserRepo;
import com.unihub.app.repository.EventRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {
    @Autowired
    private EventRepo eventRepo;
    @Autowired
    private AppUserRepo appUserRepo;

    public List<EventDTO> getAllEvents(){
        List<Event> events = eventRepo.findAll();
        List<EventDTO> eventDTOs = new ArrayList<EventDTO>();

        for (Event event : events) {
            eventDTOs.add(DTOMapper.toEventDTO(event));
        }

        return eventDTOs;
    }

    public EventDTO saveEvent(Event event) {
        AppUser user = null;
        if (event.getAppUser() != null) {
            user = appUserRepo.findById(event.getAppUser().getId()).orElseThrow(() -> new RuntimeException("User not found"));
        }
        if (user != null) {
            event.setAppUser(user);
            user.getEventsCreated().add(event);
        }
        Event savedEvent = eventRepo.save(event);
        EventDTO eventDTO = DTOMapper.toEventDTO(event);
        log.info("Event with id: {} saved successfully", event.getName());
        return eventDTO;
    }
}
