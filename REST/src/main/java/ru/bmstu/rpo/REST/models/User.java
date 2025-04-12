package ru.bmstu.rpo.REST.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Access(AccessType.FIELD)
public class User {


    public User() {
    }

    public User(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "login", nullable = false, unique = true, length = 45)
    public String login;

    @JsonIgnore
    @Column(name = "password", length = 64)
    public String password;

    @Column(name = "email", nullable = false, unique = true, length = 45)
    public String email;

    @JsonIgnore
    @Column(name = "salt", length = 64)
    public String salt;

    @Column(name = "token", length = 256)
    public String token;

    @Column(name = "activity")
    public LocalDateTime activity;

    @ManyToMany
    @JoinTable(name = "usersmuseums", joinColumns = @JoinColumn(name = "userid"),
            inverseJoinColumns = @JoinColumn(name = "museumid"))
    public Set<Museum>
            museums = new HashSet<>();

    public void addMuseum(Museum m) {
        this.museums.add(m);
        //m.users.add(this);
    }

    public void removeMuseum(Museum m) {
        this.museums.remove(m);
        //m.users.remove(this);
    }

}
