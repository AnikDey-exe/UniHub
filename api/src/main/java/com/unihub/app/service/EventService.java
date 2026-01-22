package com.unihub.app.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unihub.app.dto.DTOMapper;
import com.unihub.app.dto.EmailDTO;
import com.unihub.app.dto.EventDTO;
import com.unihub.app.dto.RegistrationDTO;
import com.unihub.app.dto.request.*;
import com.unihub.app.dto.response.SearchedEventsResponse;
import com.unihub.app.exception.*;
import com.unihub.app.model.*;
import com.unihub.app.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static com.unihub.app.util.ArrayOperations.toPostgresArray;
import static com.unihub.app.util.FileOperations.getFileExtension;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {
    @Autowired
    private EventRepo eventRepo;
    @Autowired
    private AppUserRepo appUserRepo;
    @Autowired
    private RegistrationRepo registrationRepo;
    @Autowired
    private QuestionRepo questionRepo;
    @Autowired
    private AnswerRepo answerRepo;
    @Autowired
    private DTOMapper dtoMapper;
    @Autowired
    private OpenAIService openAIService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private EntityManager em;

    private final S3Client s3Client;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

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
                    -1,
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

    public List<RegistrationDTO> getEventRegistrations(Integer eventId) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new EventNotFoundException("Event not found"));
        List<Registration> registrations = registrationRepo.findAllByEvent(event);
        List<RegistrationDTO> registrationDtos = new ArrayList<>();
        for (Registration registration : registrations) registrationDtos.add(dtoMapper.toRegistrationDTO(registration));

        return registrationDtos;
    }

    @Transactional
    public RegistrationDTO updateRegistrationStatus(Integer registrationId, RegistrationStatus newStatus) {
        Registration registration = registrationRepo.findById(registrationId).orElseThrow(() -> new RegistrationNotFoundException("Registration not found"));

        RegistrationStatus oldStatus = registration.getStatus();
        registration.setStatus(newStatus);
        registrationRepo.save(registration);

        Event event = registration.getEvent();
        if (oldStatus == RegistrationStatus.APPROVED && List.of(RegistrationStatus.REJECTED, RegistrationStatus.CANCELLED, RegistrationStatus.PENDING).contains(newStatus)) {
            em.detach(event);
            em.createNativeQuery("""
                                       UPDATE events.event
                                       SET num_attendees = num_attendees - :tickets
                                       WHERE id = :eventId
                               """)
                    .setParameter("tickets", registration.getTickets())
                    .setParameter("eventId", event.getId())
                    .executeUpdate();
            event.setNumAttendees(event.getNumAttendees() - registration.getTickets());
        } else if (List.of(RegistrationStatus.REJECTED, RegistrationStatus.CANCELLED, RegistrationStatus.PENDING).contains(oldStatus) && newStatus == RegistrationStatus.APPROVED) {
            if (event.getNumAttendees() < event.getCapacity() && event.getNumAttendees() + registration.getTickets() < event.getCapacity()) {
                em.detach(event);
                em.createNativeQuery("""
                                       UPDATE events.event
                                       SET num_attendees = num_attendees + :tickets
                                       WHERE id = :eventId
                                """)
                        .setParameter("tickets", registration.getTickets())
                        .setParameter("eventId", event.getId())
                        .executeUpdate();
                event.setNumAttendees(event.getNumAttendees() + registration.getTickets());
            }
        }
        return dtoMapper.toRegistrationDTO(registration);
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

    // update to support questions
    @Transactional
    public EventDTO saveEvent(CreateEventRequest eventRequest, MultipartFile image) throws FileUploadException, JsonProcessingException {
        AppUser user = null;
        user = appUserRepo.findById(eventRequest.getCreatorId())
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

        Event event = new Event();
        event.setName(eventRequest.getName());
        event.setDescription(eventRequest.getDescription());
        event.setLocation(eventRequest.getLocation());
        event.setType(eventRequest.getType());
        event.setNumAttendees(0);
        event.setEventTimezone(eventRequest.getEventTimezone());
        event.setCapacity(eventRequest.getCapacity());
        event.setEventStartDateUtc(eventRequest.getEventStartDateUtc());
        event.setEventEndDateUtc(eventRequest.getEventEndDateUtc());
        event.setMaxTickets(eventRequest.getMaxTickets());
        event.setRequiresApproval(eventRequest.isRequiresApproval());
        event.setApprovalSuccessMessage(eventRequest.getApprovalSuccessMessage());

//        if (user != null) {
//            event.setCreator(user);
//            user.getEventsCreated().add(event);
//        }

        String thumbnail = "";

        if (image != null) {
            String original = Optional.ofNullable(image.getOriginalFilename())
                    .orElseThrow(() -> new UnsupportedMediaTypeException("Filename is missing"))
                    .toLowerCase();
            String contentType = Optional.ofNullable(image.getContentType())
                    .orElseThrow(() -> new UnsupportedMediaTypeException("Content-Type is unknown"));

            String ext = getFileExtension(original);
            String folder = switch (ext) {
                case "jpg", "jpeg", "png", "gif" -> "images";
                case "mp4", "mov" -> "videos";
                case "pdf", "doc", "docx", "txt" -> "documents";
                default -> throw new UnsupportedMediaTypeException("Unsupported file type: " + contentType);
            };

            String key = String.format("%s/%s-%s", folder, UUID.randomUUID(), original);

            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
                    .build();

            try {
                s3Client.putObject(req, RequestBody.fromBytes(image.getBytes()));
            } catch (IOException e) {
                throw new FileUploadException("File upload to Cloudflare R2 failed", e);
            }

            // in prod change this to custom domain
            thumbnail = String.format("https://pub-13855262101b49ee8952e3133c109be0.r2.dev/%s", key);
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
                name, type, description, location, capacity, image,
                num_attendees, event_start_date_utc, event_end_date_utc,
                event_timezone, creator_user_id, max_tickets, requires_approval, approval_success_message, embedding
            )
            VALUES (
                :name, :type, :description, :location, :capacity, :image,
                :numAttendees, :startDate, :endDate,
                :timezone, :creatorId, :maxTickets, :requiresApproval, :approvalSuccessMessage, '%s'::vector
            )
            RETURNING id
            """, embeddingLiteral);

        Integer generatedId = (Integer) em.createNativeQuery(sql)
                .setParameter("name", event.getName())
                .setParameter("type", event.getType())
                .setParameter("description", event.getDescription())
                .setParameter("location", event.getLocation())
                .setParameter("capacity", event.getCapacity())
                .setParameter("image", thumbnail)
                .setParameter("numAttendees", event.getNumAttendees())
                .setParameter("startDate", event.getEventStartDateUtc())
                .setParameter("endDate", event.getEventEndDateUtc())
                .setParameter("timezone", event.getEventTimezone())
                .setParameter("creatorId", user != null ? user.getId() : null)
                .setParameter("maxTickets", event.getMaxTickets())
                .setParameter("requiresApproval", event.isRequiresApproval())
                .setParameter("approvalSuccessMessage", event.getApprovalSuccessMessage())
                .getSingleResult();

        em.flush();
        em.clear(); // Clear the persistence context

// Now fetch it again to get a truly fresh managed entity
        Event managedEvent = em.find(Event.class, generatedId);

        if (eventRequest.getQuestionsJson() != null) {
            ObjectMapper mapper = new ObjectMapper();
            List<QuestionRequest> questions = mapper.readValue(
                    eventRequest.getQuestionsJson(),
                    new TypeReference<List<QuestionRequest>>() {
                    }
            );

            List<Question> questionEntities = questions.stream()
                    .map(qr -> {
                        Question q = new Question();
                        q.setQuestion(qr.getQuestion());
                        q.setType(qr.getType());
                        q.setChoices(qr.getChoices().toArray(new String[0]));
                        q.setRequired(qr.isRequired());
                        q.setEvent(managedEvent); // important
                        return q;
                    })
                    .toList();

            for (Question q : questionEntities) {
                questionRepo.save(q);
            }

            questionRepo.saveAll(questionEntities);
        }

        EventDTO eventDTO = dtoMapper.toEventDTO(managedEvent);
        log.info("Event with id: {} saved successfully", managedEvent.getName());
        return eventDTO;
    }

    // update to support answers
    @Transactional
    public void rsvpEvent(Integer eventId, String userEmail, String displayName, Integer tickets, RegistrationStatus status, List<AnswerRequest> answers) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
        AppUser attendee = appUserRepo.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (event.getNumAttendees() >= event.getCapacity()) throw new CapacityLimitReachedException("Event is at full capacity");
        if (event.getNumAttendees() + tickets > event.getCapacity()) throw new CapacityLimitReachedException("Event does not have enough capacity for the number of tickets you requested");
        if (tickets > event.getMaxTickets()) throw new CapacityLimitReachedException("You can only request up to "+event.getMaxTickets()+" tickets");

        boolean alreadyRegistered = em.createQuery("""
            SELECT COUNT(r)
            FROM Registration r
            WHERE r.event = :event AND r.attendee = :attendee
        """, Long.class)
                .setParameter("event", event)
                .setParameter("attendee", attendee)
                .getSingleResult() > 0;

        if (alreadyRegistered) throw new UserAlreadyRegisteredException("User is already registered for event");

        if (event.getQuestions() != null) {
            List<Integer> requiredQuestionIds =
                    event.getQuestions().stream()
                            .filter(Question::isRequired)
                            .map(Question::getId)
                            .toList();
            Set<Integer> answeredQuestionIds = answers == null ? Set.of() :
                    answers.stream()
                            .map(AnswerRequest::getQuestionId)
                            .collect(Collectors.toSet());
            if (!answeredQuestionIds.containsAll(requiredQuestionIds)) {
                throw new MissingRequiredAnswersException("All required questions must be answered");
            }
        }

        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setAttendee(attendee);
        registration.setDisplayName(displayName != null ? displayName : attendee.getFirstName() + " " + attendee.getLastName());
        registration.setTickets(tickets);
        registration.setStatus(status);

        registrationRepo.save(registration);

        if (answers != null) {
            for (AnswerRequest ar : answers) {
                Question question = questionRepo.findById(ar.getQuestionId())
                        .orElseThrow(() ->
                                new QuestionNotFoundException("Invalid question")
                        );

                if (!question.getEvent().getId().equals(eventId)) {
                    throw new IllegalArgumentException("Question does not belong to this event");
                }

                if ((question.getType() == QuestionType.MULTISELECT && ar.getMultiAnswer() == null)
                        || (
                                (question.getType() == QuestionType.CHOICE || question.getType() == QuestionType.TYPED) && ar.getSingleAnswer() == null)
                            ) {
                    throw new InvalidAnswerException("Your answers are invalid, please check it again");
                }

                Answer answer = new Answer();
                answer.setRegistration(registration);
                answer.setQuestion(question);
                answer.setSingleAnswer(ar.getSingleAnswer());
                answer.setMultiAnswer(
                        ar.getMultiAnswer() != null
                                ? ar.getMultiAnswer().toArray(new String[0])
                                : null
                );

                answerRepo.save(answer);
            }
        }

        if (status == RegistrationStatus.APPROVED) {
            em.detach(event);
            em.createNativeQuery("""
                   UPDATE events.event
                   SET num_attendees = num_attendees + :tickets
                   WHERE id = :eventId
            """)
                    .setParameter("tickets", tickets)
                    .setParameter("eventId", eventId)
                    .executeUpdate();
            event.setNumAttendees(event.getNumAttendees() + tickets);
        }

        EmailDTO email = new EmailDTO(userEmail, "You have been registered for "+event.getName()+"! Check your registration status in your profile to see if it got approved.", "Registration Confirmation");
        emailService.sendSimpleEmailAsync(email);
    }

    @Transactional
    public void unrsvpEvent(Integer eventId, String userEmail) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));
        AppUser attendee = appUserRepo.findByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Registration registration = registrationRepo
                .findByEventAndAttendee(event, attendee)
                .orElseThrow(() -> new UserNotRegisteredException("User is not registered"));

        if (registration.getStatus() == RegistrationStatus.APPROVED) {
            em.detach(event);
            em.createNativeQuery("""
                   UPDATE events.event
                   SET num_attendees = num_attendees - :tickets
                   WHERE id = :eventId
            """)
                    .setParameter("tickets", registration.getTickets())
                    .setParameter("eventId", eventId)
                    .executeUpdate();
            event.setNumAttendees(event.getNumAttendees() - registration.getTickets());
        }

        registrationRepo.delete(registration);

//        em.refresh(event);

//        event.getAttendees().remove(registration);
//        attendee.getEventsAttended().remove(registration);
    }

    public List<EventDTO> getRecommendedEvents(Integer eventId) {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new EventNotFoundException("Event not found"));
        float[] embedding = event.getEmbedding();
        Float[] embeddingObj = new Float[embedding.length];

        float similarityThreshold = 0.8f;
        float distanceThreshold = 1 - similarityThreshold;

        StringBuilder sql = new StringBuilder();

        for (int i = 0; i < embedding.length; i++) {
            embeddingObj[i] = embedding[i];
        }

        String embeddingLiteral = "[" + Arrays.stream(embeddingObj)
                .map(f -> Float.toString(f))
                .collect(Collectors.joining(",")) + "]";

        sql.append("SELECT *, ");
        sql.append("(e.embedding <=> '").append(embeddingLiteral).append("'::vector) AS distance ");
        sql.append("FROM events.event e WHERE 1=1 ");
        sql.append("AND e.id != :eventId ");
        sql.append("AND (e.embedding <=> '").append(embeddingLiteral).append("'::vector <= ")
                .append(distanceThreshold)
                .append(") ");
        sql.append("ORDER BY ");
        sql.append("(e.embedding <=> '").append(embeddingLiteral).append("'::vector) ASC ");
        sql.append("LIMIT :limit");

        Query query = em.createNativeQuery(sql.toString(), Event.class);
        query.setParameter("limit", 20);
        query.setParameter("eventId", eventId);

        List<Event> events = query.getResultList();

        List<EventDTO> eventDTOs = new ArrayList<EventDTO>();

        for (Event candidateEvent : events) {
            eventDTOs.add(dtoMapper.toEventDTO(candidateEvent));
        }

        return eventDTOs;
    }
}
