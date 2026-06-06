package com.quiniela.backend.services;

import com.quiniela.backend.dto.RoomDTO;
import com.quiniela.backend.model.Room;
import com.quiniela.backend.model.User;
import com.quiniela.backend.repository.RoomRepository;
import com.quiniela.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public RoomDTO createRoom(String roomName, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String code;
        do {
            code = generateCode();
        } while (roomRepository.existsByCode(code));

        Room room = Room.builder()
                .name(roomName)
                .code(code)
                .owner(user)
                .build();
                
        room.getUsers().add(user);
        user.getRooms().add(room);
        
        room = roomRepository.save(room);
        userRepository.save(user);

        return mapToDTO(room);
    }

    @Transactional
    public RoomDTO joinRoom(String code, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Room room = roomRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Room not found"));
                
        if (room.getUsers().contains(user)) {
            throw new RuntimeException("User already in room");
        }

        room.getUsers().add(user);
        user.getRooms().add(room);
        
        roomRepository.save(room);
        userRepository.save(user);

        return mapToDTO(room);
    }

    @Transactional
    public void leaveRoom(String code, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Room room = roomRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Room not found"));
                
        if (!room.getUsers().contains(user)) {
            throw new RuntimeException("User not in room");
        }

        if (room.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Owner cannot leave the room");
        }

        room.getUsers().remove(user);
        user.getRooms().remove(room);
        
        roomRepository.save(room);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<RoomDTO> getUserRooms(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return user.getRooms().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }

    private RoomDTO mapToDTO(Room room) {
        return RoomDTO.builder()
                .id(room.getId().toString())
                .code(room.getCode())
                .name(room.getName())
                .ownerUsername(room.getOwner().getUsername())
                .memberCount(room.getUsers().size())
                .build();
    }
}
