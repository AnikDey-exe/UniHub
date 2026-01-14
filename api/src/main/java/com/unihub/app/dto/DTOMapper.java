package com.unihub.app.dto;

import com.unihub.app.dto.request.UpdateUserRequest;
import com.unihub.app.model.*;

import org.hibernate.sql.Update;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring") // lets Spring inject it
public interface DTOMapper {

    // Event -> EventDTO
    @Mapping(target = "creator", source = "creator")
    @Mapping(target = "attendees", source = "attendees")
    @Mapping(target = "questions", source = "questions")
    EventDTO toEventDTO(Event event);

    // AppUser -> AppUserDTO
    @Mapping(target = "eventsCreated", source = "eventsCreated")
    @Mapping(target = "eventsAttended", source = "eventsAttended")
    @Mapping(target = "college", source = "college")
    AppUserDTO toAppUserDTO(AppUser appUser);

    @Mapping(target = "students", source = "students")
    CollegeDTO toCollegeDTO(College college);

    @Mapping(target = "attendee", source = "attendee")
    @Mapping(target = "event", source = "event")
    @Mapping(target = "answers", source = "answers")
    RegistrationDTO toRegistrationDTO(Registration registration);

    QuestionDTO toQuestionDTO(Question question);

    @Mapping(target = "question", source = "question")
    @Mapping(target = "registration", source = "registration")
    AnswerDTO toAnswerDTO(Answer answer);

    // Smaller objects
    AppUserSummaryDTO toAppUserSummaryDTO(AppUser appUser);

    List<AppUserSummaryDTO> toAppSummaryDTO(List<AppUser> appUsers);

    EventSummaryDTO toEventSummaryDTO(Event event);

    List<EventSummaryDTO> toEventSummaryDTO(List<Event> events);

    CollegeSummaryDTO toCollegeSummaryDTO(College college);
}