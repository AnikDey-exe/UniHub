package com.unihub.app.service;

import com.unihub.app.model.Event;
import com.unihub.app.repository.EventRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {
    @Autowired
    private EventRepo eventRepo;

    public List<Event> getAllEvents(){
        return eventRepo.findAll();
    }

    public Event saveEvent(Event event) {
        Event savedEvent = eventRepo.save(event);

        log.info("Employee with id: {} saved successfully", event.getName());
        return savedEvent;
    }
}
