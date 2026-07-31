package com.eticaret.backend.modules.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        if (user.getId() == null) {
            user.setId("user-" + UUID.randomUUID().toString().substring(0, 8));
        }
        return userRepository.save(user);
    }
}
