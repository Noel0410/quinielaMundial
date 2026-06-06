package com.quiniela.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Optional;
import java.util.List;
import com.quiniela.backend.dto.UserLeaderboardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import com.quiniela.backend.services.UserService;
import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@AllArgsConstructor(onConstructor = @__({ @Autowired }))
public class UserController {
    private final UserService userService;

    @GetMapping("/leaderboard")
    public List<UserLeaderboardResponse> getLeaderboard(@RequestParam Optional<String> roomCode) {
        return userService.getLeaderboard(roomCode);
    }

}
