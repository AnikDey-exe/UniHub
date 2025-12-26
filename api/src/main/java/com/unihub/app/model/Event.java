package com.unihub.app.model;

import com.unihub.app.util.FloatArrayConverter;
import com.unihub.app.util.VectorConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import org.hibernate.proxy.HibernateProxy;
import io.hypersistence.utils.hibernate.type.array.FloatArrayType;


import java.time.Instant;
import java.util.Objects;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity

@Table(name = "event", schema = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private int capacity;

    private String image;

    @Column(name = "num_attendees", columnDefinition = "integer default 0")
    private int numAttendees;

    @Column(name = "event_start_date_utc", nullable = false)
    private Instant eventStartDateUtc;

    @Column(name = "event_end_date_utc", nullable = false)
    private Instant eventEndDateUtc;

    @Column(name = "event_timezone", nullable = false)
    private String eventTimezone;

    @Column(columnDefinition = "vector(1536)")
    @Convert(converter = VectorConverter.class)
    private float[] embedding;

    @ManyToOne
    @JoinColumn(name = "creator_user_id")
    private AppUser creator;

    @ManyToMany
    @JoinTable(
            name = "attendee",
            schema = "events",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "attendee_user_id")
    )
    @ToString.Exclude
    private Set<AppUser> attendees;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Event event = (Event) o;
        return getId() != null && Objects.equals(getId(), event.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
