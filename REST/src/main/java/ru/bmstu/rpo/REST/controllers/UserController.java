package ru.bmstu.rpo.REST.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.bmstu.rpo.REST.models.Country;
import ru.bmstu.rpo.REST.models.User;
import ru.bmstu.rpo.REST.repositories.UserRepository;
import ru.bmstu.rpo.REST.repositories.CountryRepository;
import ru.bmstu.rpo.REST.models.Museum;
import ru.bmstu.rpo.REST.repositories.MuseumRepository;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    MuseumRepository museumRepository;

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable(value = "id") Long userId,
                                           @RequestBody User userDetails) {

        User user = null;
        Optional <User>
                uu = userRepository.findById(userId);
        if (uu.isPresent()) {
            user = uu.get();
            user.login = userDetails.login;
            user.email = userDetails.email;
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
    }

    @PostMapping("/users")
    public ResponseEntity<Object> createUser(@RequestBody User user)
            throws Exception {
        try {
            User nc = userRepository.save(user);
            return new ResponseEntity<Object>(nc, HttpStatus.OK);
        }
        catch(Exception ex) {
            System.out.print(ex.getMessage());
            String error;
            if (ex.getMessage().contains("users.name_UNIQUE"))
                error = "useralreadyexists";
            else
                error = "undefinederror";
            Map<String, String>
                    map =  new HashMap<>();
            map.put("error", error);
            return new ResponseEntity<Object> (map, HttpStatus.OK);
        }
    }

    @GetMapping("/users")
    public List
    getAllCountries() {
        return userRepository.findAll();
    }



    @PostMapping("/users/{id}/addmuseums")
    public ResponseEntity<Object> addMuseums(@PathVariable(value = "id") Long userId,
                                             @RequestBody Set<Museum> museums) {
        Optional<User> uu = userRepository.findById(userId);
        int cnt = 0;
        if (uu.isPresent()) {
            User u = uu.get();
            for (Museum m : museums) {
                Optional<Museum>
                        mm = museumRepository.findById(m.id);

                if (mm.isPresent()) {
                    u.addMuseum(mm.get());
                    cnt++;
                }
            }
            userRepository.save(u);
        }
        Map<String, String> response = new HashMap<>();
        response.put("count", String.valueOf(cnt));
        return ResponseEntity.ok(response);
    }



    @PostMapping("/users/{id}/removemuseums")
    public ResponseEntity<Object> removeMuseums(
            @PathVariable(value = "id") Long userId,
            @RequestBody Set<Museum> museumsToRemove) {  // музеи, которые нужно удалить
        Optional<User> uu = userRepository.findById(userId);
        int cnt = 0;

        if (uu.isPresent()) {
            User user = uu.get();

            Set<Long> museumIdsToRemove = museumsToRemove.stream()
                    .map(m -> m.id)
                    .collect(Collectors.toSet());

            // Итерируем безопасно через Iterator
            Iterator<Museum> iterator = user.museums.iterator();
            while (iterator.hasNext()) {
                Museum museum = iterator.next();
                if (museumIdsToRemove.contains(museum.id)) {
                    iterator.remove();  // Удаляем только нужные музеи
                    cnt++;
                }
            }

            userRepository.save(user);
        }

        Map<String, String> response = new HashMap<>();
        response.put("count", String.valueOf(cnt));
        return ResponseEntity.ok(response);
    }

}
