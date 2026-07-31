package com.eticaret.backend.modules.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMe() {
        User user = userService.findByEmail("ahmet@example.com")
                .orElseGet(() -> User.builder()
                        .id("user-101")
                        .email("ahmet@example.com")
                        .firstName("Ahmet")
                        .lastName("Yılmaz")
                        .phone("+90 555 123 45 67")
                        .address(Address.builder()
                                .street("Atatürk Cad. No: 42")
                                .city("İstanbul")
                                .state("Kadıköy")
                                .zipCode("34710")
                                .country("Türkiye")
                                .build())
                        .build());
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/me")
    public ResponseEntity<User> updateMe(@RequestBody User updateData) {
        User current = getMe().getBody();
        if (current != null) {
            if (updateData.getFirstName() != null) current.setFirstName(updateData.getFirstName());
            if (updateData.getLastName() != null) current.setLastName(updateData.getLastName());
            if (updateData.getPhone() != null) current.setPhone(updateData.getPhone());
            if (updateData.getAddress() != null) current.setAddress(updateData.getAddress());
            return ResponseEntity.ok(userService.saveUser(current));
        }
        return ResponseEntity.notFound().build();
    }
}
