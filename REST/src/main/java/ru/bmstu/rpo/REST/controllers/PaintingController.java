package ru.bmstu.rpo.REST.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ru.bmstu.rpo.REST.models.Artist;
import ru.bmstu.rpo.REST.models.Museum;
import ru.bmstu.rpo.REST.models.Painting;
import ru.bmstu.rpo.REST.models.Painting;
import ru.bmstu.rpo.REST.repositories.ArtistRepository;
import ru.bmstu.rpo.REST.repositories.MuseumRepository;
import ru.bmstu.rpo.REST.repositories.PaintingRepository;
import ru.bmstu.rpo.REST.tools.DataValidationException;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class PaintingController {

    @Autowired
    PaintingRepository paintingRepository;
    @Autowired
    ArtistRepository artistRepository;
    @Autowired
    MuseumRepository museumRepository;

    @GetMapping("/paintings")
    public Page getAllPaintings(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        return paintingRepository.findAll(PageRequest.of(page, limit, Sort.by(Sort.Direction.ASC, "id")));
    }

    @GetMapping("/paintings/{id}")
    public ResponseEntity getPainting(@PathVariable(value = "id") Long paintingId)
            throws DataValidationException
    {
        Painting painting = paintingRepository.findById(paintingId)
                .orElseThrow(()-> new DataValidationException("Картина с таким индексом не найдена"));
        return ResponseEntity.ok(painting);
    }

    @PostMapping("/deletepaintings")
    public ResponseEntity<Object> deletePaintings(@Valid @RequestBody List<Painting> paintings) {
        paintingRepository.deleteAll(paintings);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/paintings")
    public ResponseEntity<Object> createPainting(@Valid @RequestBody Painting painting) throws Exception {
        try {
            if (!Objects.isNull(painting.artist)) {
                Optional<Artist> aa = artistRepository.findById(painting.artist.id);
                if (aa.isPresent()) {
                    painting.artist = aa.get();
                }
            }
            if (!Objects.isNull(painting.museum)) {
                Optional<Museum> mm = museumRepository.findById(painting.museum.id);
                if (mm.isPresent()) {
                    painting.museum = mm.get();
                }
            }
            Painting nc = paintingRepository.save(painting);
            return new ResponseEntity<Object>(nc, HttpStatus.OK);
        }
        catch(Exception ex) {
            String error;
            if (ex.getMessage().contains("paintings.name_UNIQUE"))
                error = "paintingalreadyexists";
            else
                error = "undefinederror";
            Map<String, String> map =  new HashMap<>();
            map.put("error", error);
            return ResponseEntity.ok(map);
        }
    }

    @PutMapping("/paintings/{id}")
    public ResponseEntity<Painting> updatePainting(@PathVariable(value = "id") Long PaintingId,
                                                   @RequestBody Painting PaintingDetails) {
        Painting Painting = null;
        Optional<Painting> cc = paintingRepository.findById(PaintingId);
        if (cc.isPresent()) {
            Painting = cc.get();
            Painting.name = PaintingDetails.name;
            paintingRepository.save(Painting);
            return ResponseEntity.ok(Painting);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Painting not found");
        }
    }


}