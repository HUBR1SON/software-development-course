package ru.bmstu.rpo.REST.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.bmstu.rpo.REST.models.Artist;

@Repository
public interface ArtistRepository  extends JpaRepository<Artist, Long>
{

}
