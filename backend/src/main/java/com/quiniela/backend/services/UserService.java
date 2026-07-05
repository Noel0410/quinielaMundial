package com.quiniela.backend.services;

import org.springframework.stereotype.Service;

import lombok.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.Collection;
import com.quiniela.backend.model.User;
import com.quiniela.backend.model.Room;
import com.quiniela.backend.repository.RoomRepository;
import com.quiniela.backend.dto.UserLeaderboardResponse;
import com.quiniela.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class UserService {
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public List<UserLeaderboardResponse> getLeaderboard(Optional<String> roomCode) {
        Collection<User> users;

        if (roomCode.isPresent()) {
            Room room = roomRepository.findByCode(roomCode.get())
                    .orElseThrow(() -> new RuntimeException("Room not found"));
            users = room.getUsers();
        } else {
            users = userRepository.findAll();
        }

        return users.stream().map(user -> new UserLeaderboardResponse(
                user.getUsername(),
                user.getTotalPoints(),
                user.getGroupStagePoints(),
                user.getTotalPoints() - user.getGroupStagePoints()
        )).collect(Collectors.toList());
    }
}
