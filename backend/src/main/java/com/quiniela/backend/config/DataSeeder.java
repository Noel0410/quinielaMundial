package com.quiniela.backend.config;

import com.quiniela.backend.model.Role;
import com.quiniela.backend.model.User;
import com.quiniela.backend.repository.TeamRepository;
import com.quiniela.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DataSource dataSource;

    @Override
    public void run(String... args) throws Exception {
        // Seed default admin user
        Optional<User> adminUserOpt = userRepository.findByUsernameIgnoreCase("admin");
        if (adminUserOpt.isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin"));
            adminUser.setRole(Role.ADMIN);
            userRepository.save(adminUser);
            System.out.println("Default admin user created: admin / admin");
        }

        // Seed teams and matches if database is empty of teams
        if (teamRepository.count() == 0) {
            System.out.println("Seeding database with teams and matches...");
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource("scripts/teams.sql"));
            populator.addScript(new ClassPathResource("scripts/group-stage-matches.sql"));
            populator.addScript(new ClassPathResource("scripts/knockout-full.sql"));
            populator.execute(dataSource);
            System.out.println("Database successfully seeded with teams and matches!");
        }
    }
}
