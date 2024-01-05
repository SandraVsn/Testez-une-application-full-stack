package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserServiceTest {
	
	// Creates the Mock of the UserRepository
    @Mock
    private UserRepository userRepository;

    // Injects the UserRepository Mock into the UserService
    @InjectMocks
    private UserService userService;
	
	@Test
	void deleteTest() {
		
		// GIVEN
		// "L" is needed after the number to not transform it into an integer which is made by default
        Long userId = 1L; 

        // WHEN
        // We call the delete method from the userService with the given userId
        userService.delete(userId);

        // THEN
        // verify that the method deleteById from the userRepository was called once with the given userId
        verify(userRepository, times(1)).deleteById(userId);
		
	}
	
	@Test
	void findOneByExistingIdTest() {
		
		// GIVEN
        Long userId = 1L; 
        User mockUser = new User(userId, "test@mail.com", "lastName", "firstName", "password", false, LocalDateTime.now(), LocalDateTime.now());
        // Mockito configuration for the userRepository to return the mocked user if findById method is called with the given userId
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));


        // WHEN
        User result = userService.findById(userId);

        // THEN
        assertThat(result).isEqualTo(mockUser);
        verify(userRepository, times(1)).findById(userId);

	}
	
	@Test
	void findOneByNonExistingIdTest() {
		
		 // GIVEN
        Long userId = 1L;
        // Mockito configuration for the userRepository to return an empty User if findById method is called with the given userId
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // WHEN
        User result = userService.findById(userId);

        // THEN
        assertThat(result).isNull();
        verify(userRepository, times(1)).findById(userId);
	}

}
