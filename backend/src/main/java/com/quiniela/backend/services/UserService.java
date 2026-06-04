package com.quiniela.backend.services;

import org.springframework.stereotype.Service;

import lombok.*;
import java.util.List;
import java.util.stream.Collectors;
import com.quiniela.backend.model.User;
import com.quiniela.backend.dto.UserLeaderboardResponse;
import com.quiniela.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class UserService {
    private final UserRepository userRepository;

    public List<UserLeaderboardResponse> getLeaderboard() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> new UserLeaderboardResponse(user.getUsername(), user.getTotalPoints()))
                .sorted((u1, u2) -> u2.points() - u1.points())
                .collect(Collectors.toList());
    }

}
