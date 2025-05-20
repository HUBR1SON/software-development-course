package ru.bmstu.rpo.REST.models;

import jakarta.persistence.*;


@Entity
@Table(name = "paintings")
public class Painting {

    @Id
    @Column(name = "id", nullable = false)
    public int id;

    @Column(name = "name", nullable = false, length = 45)
    public String name;

    @ManyToOne
    @JoinColumn(name = "artistid")  // Было @Column - это ошибка!
    public Artist artist;

    @ManyToOne
    @JoinColumn(name = "museumid")  // Было @Column - это ошибка!
    public Museum museum;

    @Column(name = "year")
    public Integer year;

    // Конструкторы
    public Painting() {}
    public Painting(int id) {
        this.id = id;
    }
}