package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest()
class UserServiceIntegrationTest {
	
	@Autowired()
    private UserRepository userRepository;

	@Autowired()
    private UserService userService;
	
	@Test
	void deleteTest() {
		
		// GIVEN
        Long userId = 1L; 

        // WHEN
        userService.delete(userId);

        // THEN
        assertThat(userRepository.existsById(userId)).isFalse();
		
	}
	
	@Test
	void findOneByExistingIdTest() {
		
		// GIVEN
        Long userId = 2L; 

        // WHEN
        User result = userService.findById(userId);

        // THEN
        assertThat(result.getFirstName()).isEqualTo("Existing");
        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getEmail()).isEqualTo("existing@mail.com");
        assertThat(result.getLastName()).isEqualTo("Existing");
        assertThat(result.getPassword()).isEqualTo("test");

	}
	
	@Test
	void findOneByNonExistingIdTest() {
		
		 // GIVEN
        Long userId = 0L;

        // WHEN
        User result = userService.findById(userId);

        // THEN
        assertThat(result).isNull();
	}

}
