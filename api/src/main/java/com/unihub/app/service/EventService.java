package com.unihub.app.service;

import com.unihub.app.dto.DTOMapper;
import com.unihub.app.dto.EventDTO;
import com.unihub.app.dto.request.EventSearchRequest;
import com.unihub.app.dto.request.UpdateEventRequest;
import com.unihub.app.dto.response.SearchedEventsResponse;
import com.unihub.app.exception.CapacityLimitReachedException;
import com.unihub.app.exception.EventNotFoundException;
import com.unihub.app.exception.UserAlreadyRegisteredException;
import com.unihub.app.exception.UserNotFoundException;
import com.unihub.app.model.AppUser;
import com.unihub.app.model.Event;
import com.unihub.app.repository.AppUserRepo;
import com.unihub.app.repository.EventRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
    @Autowired
    private EntityManager em;

    public List<EventDTO> getAllEvents(){
        List<Event> events = eventRepo.findAll();
        List<EventDTO> eventDTOs = new ArrayList<EventDTO>();

        for (Event event : events) {
            eventDTOs.add(dtoMapper.toEventDTO(event));
        }

        return eventDTOs;
    }

    public SearchedEventsResponse getEvents(EventSearchRequest request){
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT *, ");

        float[] embedding = null;
        Float[] embeddingObj = null;
        if (request.getSearchQuery() != null) {
            embedding = openAIService.generateEmbedding(request.getSearchQuery());
            embeddingObj = new Float[embedding.length];

            float norm = 0f;
            for (float f : embedding) {
                norm += f * f;
            }
            norm = (float) Math.sqrt(norm);
            if (norm > 0) {
                for (int i = 0; i < embedding.length; i++) {
                    embedding[i] /= norm;
                }
            }

            for (int i = 0; i < embedding.length; i++) {
                embeddingObj[i] = embedding[i];
            }
            String embeddingLiteral = "[" + Arrays.stream(embeddingObj)
                    .map(f -> Float.toString(f))
                    .collect(Collectors.joining(",")) + "]";

            sql.append("(e.embedding <=> '").append(embeddingLiteral).append("'::vector) AS distance ");
        } else {
            sql.append("NULL AS similarity ");
        }

        sql.append("FROM events.event e WHERE 1=1 ");

        if (request.getTypes() != null && !request.getTypes().isEmpty()) {
            sql.append("AND e.type = ANY(:types) ");
        }
        if (request.getStartDate() != null) {
            sql.append("AND e.event_start_date_utc >= :startDate ");
        }
        if (request.getEndDate() != null) {
            sql.append("AND e.event_end_date_utc <= :endDate ");
        }
        if (request.getMinAttendees() != null) {
            sql.append("AND e.num_attendees >= :minAttendees ");
        }
        if (request.getLastNumAttendees() != null) {
            sql.append("AND e.num_attendees < :lastNumAttendees ");
        }
        if (request.getLastStartDate() != null) {
            sql.append("AND e.event_start_date_utc > :lastStartDate ");
        }

        if (embedding != null) {
            float similarityThreshold = 0.8f;
            String embeddingLiteral = "[" + Arrays.stream(embeddingObj)
                    .map(f -> Float.toString(f))
                    .collect(Collectors.joining(",")) + "]";
            float distanceThreshold = 1 - similarityThreshold;

            sql.append("AND (e.embedding <=> '").append(embeddingLiteral).append("'::vector <= ")
                    .append(distanceThreshold)
                    .append(") ");
        }

        sql.append("ORDER BY ");
        if ("popularity".equals(request.getSortBy())) {
            sql.append("e.num_attendees DESC, ");
        } else {
            sql.append("e.event_start_date_utc ASC, ");
        }

        if (embedding != null) {
            String embeddingLiteral = "[" + Arrays.stream(embeddingObj)
                    .map(f -> Float.toString(f))
                    .collect(Collectors.joining(",")) + "]";
            sql.append("(e.embedding <=> '").append(embeddingLiteral).append("'::vector) ASC, ");
        }
        sql.append("e.id ASC ");
        sql.append("LIMIT :limit");

        Query query = em.createNativeQuery(sql.toString(), Event.class);

        if (request.getTypes() != null && !request.getTypes().isEmpty()) {
            query.setParameter("types", request.getTypes().toArray(new String[0]));
        }
        if (request.getStartDate() != null) {
            query.setParameter("startDate", request.getStartDate());
        }
        if (request.getEndDate() != null) {
            query.setParameter("endDate", request.getEndDate());
        }
        if (request.getMinAttendees() != null) {
            query.setParameter("minAttendees", request.getMinAttendees());
        }
        if (request.getLastNumAttendees() != null) {
            query.setParameter("lastNumAttendees", request.getLastNumAttendees());
        }
        if (request.getLastStartDate() != null) {
            query.setParameter("lastStartDate", request.getLastStartDate());
        }
        query.setParameter("limit", request.getLimit());

        List<Event> events = query.getResultList();

        List<EventDTO> eventDTOs = new ArrayList<EventDTO>();

        for (Event event : events) {
            eventDTOs.add(dtoMapper.toEventDTO(event));
        }

        SearchedEventsResponse response;
        if (events.size() == request.getLimit()) {
            response = new SearchedEventsResponse(
                    eventDTOs,
                    events.get(request.getLimit() - 1).getNumAttendees(),
                    events.get(request.getLimit() - 1).getEventStartDateUtc(),
                    true
            );
        } else {
            response = new SearchedEventsResponse(
                    eventDTOs,
                    0,
                    null,
                    false
            );
        }

        return response;
    }

    public EventDTO getEvent(Integer eventId) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new EventNotFoundException("Event not found"));
        EventDTO eventDto = dtoMapper.toEventDTO(event);

        return eventDto;
    }

//    fix
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
            user = appUserRepo.findById(event.getCreator().getId())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));
        }
        if (user != null) {
            event.setCreator(user);
            user.getEventsCreated().add(event);
        }

        String textForEmbedding = event.getName() + event.getName() + event.getName();
        if (event.getDescription() != null && !event.getDescription().isEmpty()) {
            textForEmbedding += " " + event.getDescription();
        }
        float[] embedding = openAIService.generateEmbedding(textForEmbedding);
        float norm = 0f;
        for (float f : embedding) {
            norm += f * f;
        }
        norm = (float) Math.sqrt(norm);

        if (norm > 0) {
            for (int i = 0; i < embedding.length; i++) {
                embedding[i] /= norm;
            }
        }
        event.setEmbedding(embedding);

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.length; i++) {
            sb.append(embedding[i]);
            if (i < embedding.length - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        String embeddingLiteral = sb.toString();

        String sql = String.format("""
            INSERT INTO events.event (
                name, type, description, location, capacity,
                num_attendees, event_start_date_utc, event_end_date_utc,
                event_timezone, creator_user_id, embedding
            )
            VALUES (
                :name, :type, :description, :location, :capacity,
                :numAttendees, :startDate, :endDate,
                :timezone, :creatorId, '%s'::vector
            )
            RETURNING id
            """, embeddingLiteral);

        Integer generatedId = (Integer) em.createNativeQuery(sql)
                .setParameter("name", event.getName())
                .setParameter("type", event.getType())
                .setParameter("description", event.getDescription())
                .setParameter("location", event.getLocation())
                .setParameter("capacity", event.getCapacity())
                .setParameter("numAttendees", event.getNumAttendees())
                .setParameter("startDate", event.getEventStartDateUtc())
                .setParameter("endDate", event.getEventEndDateUtc())
                .setParameter("timezone", event.getEventTimezone())
                .setParameter("creatorId", user != null ? user.getId() : null)
                .getSingleResult();

        event.setId(generatedId);
        EventDTO eventDTO = dtoMapper.toEventDTO(event);
        log.info("Event with id: {} saved successfully", event.getName());
        return eventDTO;
    }

    @Transactional
    public void rsvpEvent(Integer eventId, String userEmail) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
        AppUser attendee = appUserRepo.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (event.getAttendees().contains(attendee)) {
            throw new UserAlreadyRegisteredException("User is already registered for event.");
        }
        if (event.getNumAttendees() >= event.getCapacity()) {
            throw new CapacityLimitReachedException("Event is at full capacity.");
        }

        em.detach(event);

        em.createNativeQuery("""
            UPDATE events.event
            SET num_attendees = num_attendees + 1
            WHERE id = :eventId
        """)
                .setParameter("eventId", eventId)
                .executeUpdate();


        em.createNativeQuery("""
            INSERT INTO events.attendee (event_id, attendee_user_id)
            VALUES (:eventId, :userId)
            ON CONFLICT DO NOTHING
        """)
                .setParameter("eventId", eventId)
                .setParameter("userId", attendee.getId())
                .executeUpdate();

        event.setNumAttendees(event.getNumAttendees() + 1);
        event.getAttendees().add(attendee);
        attendee.getEventsAttended().add(event);
    }
}
