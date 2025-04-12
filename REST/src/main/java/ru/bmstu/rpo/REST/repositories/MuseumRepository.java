package ru.bmstu.rpo.REST.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.bmstu.rpo.REST.models.Museum;

@Repository
public interface MuseumRepository  extends JpaRepository<Museum, Long>
{

}