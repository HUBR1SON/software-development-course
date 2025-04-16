package ru.bmstu.rpo.REST.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.bmstu.rpo.REST.models.User;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User, Long>
{
    Optional<User> findByToken(String token);
    Optional<User> findByLogin(String login);
}
