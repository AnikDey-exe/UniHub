package com.unihub.app.repository;

import com.unihub.app.dto.EventDTO;
import com.unihub.app.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface EventRepo extends JpaRepository<Event, Integer> {
//    List<Event> findByName(String name);
//    @Query(value = """
//            WITH filtered AS (
//                SELECT *
//                FROM events.event e
//                WHERE 1=1
//                  AND (:types IS NULL OR e.type = ANY(:types))
//                  AND (:startDate IS NULL OR e.event_start_date_utc >= :startDate)
//                  AND (:endDate IS NULL OR e.event_end_date_utc <= :endDate)
//                  AND (:minAttendees IS NULL OR e.num_attendees >= :minAttendees)
//                  AND (
//                    :embedding IS NULL
//                    OR (:similarityThreshold IS NULL)
//                    OR (e.embedding <-> CAST(:embedding AS vector)) <= :similarityThreshold
//                  )
//            )
//            SELECT *,
//                   CASE WHEN :embedding IS NOT NULL THEN e.embedding <-> CAST(:embedding AS vector) ELSE NULL END AS similarity
//            FROM filtered e
//            ORDER BY
//                CASE WHEN :sortBy = 'popularity' THEN e.num_attendees END DESC,
//                CASE WHEN :sortBy = 'recency' THEN e.event_start_date_utc END DESC,
//                CASE WHEN :embedding IS NOT NULL THEN e.embedding <-> CAST(:embedding AS vector) END ASC,
//                e.id ASC
//            LIMIT :limit
//            """, nativeQuery = true)
//    List<Event> searchEvents(
//            @Param("types") String[] types,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate,
//            @Param("minAttendees") Integer minAttendees,
//            @Param("embedding") String embedding,
//            @Param("similarityThreshold") Float similarityThreshold,
//            @Param("sortBy") String sortBy,
//            @Param("limit") int limit
////            @Param("cursorValue") Object cursorValue
//    );
}
