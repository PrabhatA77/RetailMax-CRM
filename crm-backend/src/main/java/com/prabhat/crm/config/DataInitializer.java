package com.prabhat.crm.config;

import com.prabhat.crm.model.AppUser;
import com.prabhat.crm.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Runs once at startup: creates the default login if it doesn't exist yet
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${crm.auth.default-username:admin}")
    private String defaultUsername;

    @Value("${crm.auth.default-password:admin123}")
    private String defaultPassword;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername(defaultUsername).isEmpty()) {
            AppUser user = new AppUser();
            user.setUsername(defaultUsername);
            user.setPasswordHash(passwordEncoder.encode(defaultPassword));
            userRepository.save(user);
        }
    }
}