package ru.bmstu.rpo.REST.models;

import jakarta.persistence.*;

@Entity
@Table(name = "paintings")
public class Painting {

    public Painting() { }

    public Painting(int id) {
        this.id = id;
    }

    @Id
    @Column(name = "id", nullable = false)
    public int id;

    @Column(name = "name", nullable = false, length = 45)
    public String name;

    @Column(name = "artistid")
    public Integer artistId;

    @Column(name = "museumid")
    public Integer museumId;

    @Column(name = "year")
    public Integer year;
}
