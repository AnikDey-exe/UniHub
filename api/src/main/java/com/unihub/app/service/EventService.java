package com.unihub.app.service;

import com.unihub.app.dto.DTOMapper;
import com.unihub.app.dto.EventDTO;
import com.unihub.app.dto.request.UpdateEventRequest;
import com.unihub.app.exception.CapacityLimitReachedException;
import com.unihub.app.exception.EventNotFoundException;
import com.unihub.app.exception.UserAlreadyRegisteredException;
import com.unihub.app.exception.UserNotFoundException;
import com.unihub.app.model.AppUser;
import com.unihub.app.model.Event;
import com.unihub.app.repository.AppUserRepo;
import com.unihub.app.repository.EventRepo;
import com.unihub.app.util.EmbeddingUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {
    @Autowired
    private EventRepo eventRepo;
    @Autowired
    private AppUserRepo appUserRepo;
    @Autowired
    private DTOMapper dtoMapper;
    @Autowired
    private OpenAIService openAIService;

    public List<EventDTO> getAllEvents(){
        List<Event> events = eventRepo.findAll();
        List<EventDTO> eventDTOs = new ArrayList<EventDTO>();

        for (Event event : events) {
            eventDTOs.add(dtoMapper.toEventDTO(event));
        }

        return eventDTOs;
    }

    public EventDTO getEvent(Integer eventId) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new EventNotFoundException("Event not found"));
        EventDTO eventDto = dtoMapper.toEventDTO(event);

        return eventDto;
    }

    public EventDTO updateEvent(Integer eventId, UpdateEventRequest toUpdate) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new EventNotFoundException("Event not found"));

        if (toUpdate.getName() != null) event.setName(toUpdate.getName());
        if (toUpdate.getType() != null) event.setType(toUpdate.getType());
        if (toUpdate.getDescription() != null) event.setDescription(toUpdate.getDescription());
        if (toUpdate.getLocation() != null) event.setLocation(toUpdate.getLocation());
        if (toUpdate.getCapacity() != null) event.setCapacity(toUpdate.getCapacity());

        Event updatedEvent = eventRepo.save(event);
        return dtoMapper.toEventDTO(updatedEvent);
    }

    public EventDTO saveEvent(Event event) {
        AppUser user = null;
        if (event.getCreator() != null) {
            user = appUserRepo.findById(event.getCreator().getId()).orElseThrow(() -> new UserNotFoundException("User not found"));
        }
        if (user != null) {
            event.setCreator(user);
            user.getEventsCreated().add(event);
        }
        String textForEmbedding = event.getName();
        if (event.getDescription() != null && !event.getDescription().isEmpty()) {
            textForEmbedding += " " + event.getDescription();
        }
        float[] embedding = openAIService.generateEmbedding(textForEmbedding);
        event.setEmbedding(embedding);
        Event savedEvent = eventRepo.save(event);
        EventDTO eventDTO = dtoMapper.toEventDTO(event);
        log.info("Event with id: {} saved successfully", event.getName());
        return eventDTO;
    }

    @Transactional
    public void rsvpEvent(Integer eventId, String userEmail) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new EventNotFoundException("Event not found"));
        AppUser attendee = appUserRepo.findByEmail(userEmail).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (event.getAttendees().contains(attendee)) throw new UserAlreadyRegisteredException("User is already registered for event.");
        if (event.getAttendees().size() >= event.getCapacity()) throw new CapacityLimitReachedException("Event is at full capacity.");

        event.getAttendees().add(attendee);
        attendee.getEventsAttended().add(event);

        eventRepo.save(event);
    }
}
