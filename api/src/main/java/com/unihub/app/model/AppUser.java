package com.unihub.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.List;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity

@Table(name = "app_user", schema = "events")
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String firstName;

    private String middleName;

    @Column(nullable = false)
    private String lastName;

    private String about;

    private String profilePicture;

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL)
    @ToString.Exclude
    List<Event> eventsCreated;

    @ManyToMany(mappedBy = "attendees")
    @ToString.Exclude
    List<Event> eventsAttended;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        AppUser appUser = (AppUser) o;
        return getId() != null && Objects.equals(getId(), appUser.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
