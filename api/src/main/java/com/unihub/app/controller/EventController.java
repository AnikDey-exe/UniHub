package com.unihub.app.controller;

import com.unihub.app.dto.EventDTO;
import com.unihub.app.dto.request.RsvpRequest;
import com.unihub.app.model.Event;
import com.unihub.app.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @GetMapping("/")
    public ResponseEntity<List<EventDTO>> getEvents() {
        return ResponseEntity.ok().body(eventService.getAllEvents());
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable Integer eventId) { return ResponseEntity.ok().body(eventService.getEvent(eventId)); }

    @PostMapping("/")
    public ResponseEntity<EventDTO> saveEvent(@RequestBody Event event) {
        return ResponseEntity.ok().body(eventService.saveEvent(event));
    }

    @PostMapping("/rsvp")
    public ResponseEntity<String> rsvpEvent(@RequestBody RsvpRequest rsvpBody) {
        eventService.rsvpEvent(rsvpBody.getEventId(), rsvpBody.getUserEmail());
        return ResponseEntity.ok().body(rsvpBody.getUserEmail()+" has successfully rsvp'd to event with id: "+rsvpBody.getEventId().toString());
    }
}
