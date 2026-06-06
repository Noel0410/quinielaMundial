package com.quiniela.backend.controller;

import com.quiniela.backend.dto.RoomDTO;
import com.quiniela.backend.services.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomDTO> createRoom(@RequestBody Map<String, String> payload, Authentication authentication) {
        String name = payload.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(roomService.createRoom(name, authentication.getName()));
    }

    @PostMapping("/join/{code}")
    public ResponseEntity<RoomDTO> joinRoom(@PathVariable String code, Authentication authentication) {
        try {
            return ResponseEntity.ok(roomService.joinRoom(code.toUpperCase(), authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/leave/{code}")
    public ResponseEntity<Void> leaveRoom(@PathVariable String code, Authentication authentication) {
        try {
            roomService.leaveRoom(code.toUpperCase(), authentication.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my-rooms")
    public ResponseEntity<List<RoomDTO>> getMyRooms(Authentication authentication) {
        return ResponseEntity.ok(roomService.getUserRooms(authentication.getName()));
    }
}
