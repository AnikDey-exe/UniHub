package com.unihub.app.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.unihub.app.dto.EventDTO;
import com.unihub.app.dto.request.CreateEventRequest;
import com.unihub.app.dto.request.EventSearchRequest;
import com.unihub.app.dto.request.RsvpRequest;
import com.unihub.app.dto.request.UpdateEventRequest;
import com.unihub.app.dto.response.SearchedEventsResponse;
import com.unihub.app.model.Event;
import com.unihub.app.service.EventService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
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

    @GetMapping("/search")
    public ResponseEntity<SearchedEventsResponse> getSearchedEvents(
            @RequestParam(required = false) List<String> types,
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate,
            @RequestParam(required = false) Integer minAttendees,
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false, defaultValue = "recency") String sortBy,
            @RequestParam(required = false, defaultValue = "3") int limit,
            @RequestParam(required = false) Integer lastNumAttendees,
            @RequestParam(required = false) Instant lastStartDate
    ) {
        EventSearchRequest searchRequest = new EventSearchRequest(
                types, startDate, endDate, minAttendees, searchQuery,
                sortBy, limit, lastNumAttendees, lastStartDate
        );
        return ResponseEntity.ok().body(eventService.getEvents(searchRequest));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable Integer eventId) { return ResponseEntity.ok().body(eventService.getEvent(eventId)); }

    @GetMapping("/recommended/{eventId}")
    public ResponseEntity<List<EventDTO>> getRecommendedEvents(@PathVariable Integer eventId) { return ResponseEntity.ok().body(eventService.getRecommendedEvents(eventId)); }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Integer eventId, @RequestBody UpdateEventRequest toUpdate) { return ResponseEntity.ok().body(eventService.updateEvent(eventId, toUpdate)); }

    @PostMapping("/create")
    public ResponseEntity<EventDTO> saveEvent(@ModelAttribute CreateEventRequest event, @RequestParam(value = "image", required = false) MultipartFile image) throws FileUploadException, JsonProcessingException {
        return ResponseEntity.ok().body(eventService.saveEvent(event, image));
    }

    // change to registration
    @PostMapping("/rsvp")
    public ResponseEntity<Void> rsvpEvent(@RequestBody RsvpRequest rsvpBody) {
        eventService.rsvpEvent(rsvpBody.getEventId(), rsvpBody.getUserEmail(), rsvpBody.getDisplayName(), rsvpBody.getTickets(), rsvpBody.getStatus(), rsvpBody.getAnswers());
        return ResponseEntity.ok().build();
    }

    // change to registration
    @PostMapping("/unrsvp")
    public ResponseEntity<Void> unrsvpEvent(@RequestBody RsvpRequest rsvpBody) {
        eventService.unrsvpEvent(rsvpBody.getEventId(), rsvpBody.getUserEmail());
        return ResponseEntity.ok().build();
    }
}
