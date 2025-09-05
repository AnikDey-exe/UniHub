package com.unihub.app.controller;

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
    public ResponseEntity<List<Event>> getEvents() {
        return ResponseEntity.ok().body(eventService.getAllEvents());
    }

    @PostMapping("/")
    public ResponseEntity<Event> saveEvent(@RequestBody Event event) {
        return ResponseEntity.ok().body(eventService.saveEvent(event));
    }
}
