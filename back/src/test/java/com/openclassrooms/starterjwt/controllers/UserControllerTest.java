package com.openclassrooms.starterjwt.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;


import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserControllerTest {
	
	@Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;
    
    @Mock
    private SecurityContext securityContext;
    
    @InjectMocks
    private UserController userController;
    
    private User mockUser;
    
    @BeforeEach
    public void setup() {
    	
        SecurityContextHolder.setContext(securityContext);
    	
    	this.mockUser = new User(1L, "user1@mail.com", "User", "USER", "password", false, LocalDateTime.now(), LocalDateTime.now());
    	
    }

    @Test
    void findByIdSuccessTest() {
    	
        // GIVEN
        String userId = "1";
        User user = this.mockUser;
        UserDto userDto = new UserDto();
        when(userService.findById(anyLong())).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        
        // WHEN
        ResponseEntity<?> response = userController.findById(userId);

        
        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.userMapper.toDto(user));
    }
    
    @Test
    void findByIdNotFoundTest() {
       
    	// GIVEN
        String userId = "1";
        when(userService.findById(anyLong())).thenReturn(null);

        
        // WHEN
        ResponseEntity<?> response = userController.findById(userId);

        
        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
    
    @Test
    void findByIdBadRequestTest() {
        
    	// GIVEN
        String invalidUserId = "invalidId";

        
        // WHEN
        ResponseEntity<?> response = userController.findById(invalidUserId);

        
        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
    
    @Test
    void deleteSuccessTest() {

    	// GIVEN
        String userId = "1";
        User mockUser = this.mockUser;

        when(userService.findById(mockUser.getId())).thenReturn(mockUser);
        UserDetails mockUserDetails = mock(UserDetails.class);
        when(securityContext.getAuthentication()).thenReturn(new UsernamePasswordAuthenticationToken(mockUserDetails, null));
        when(mockUserDetails.getUsername()).thenReturn(mockUser.getEmail());

        // WHEN
        ResponseEntity<?> response = userController.save(userId.toString());

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(userService, times(1)).delete(Long.parseLong(userId));
    }
    
    @Test
    void deleteNotFoundTest() {
        // GIVEN
        String userId = "1";
        when(userService.findById(anyLong())).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = userController.save(userId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
    
    @Test
    void deleteUnauthorizedTest() {

    	// GIVEN
        String userId = "1";
        User mockUser = this.mockUser;

        when(userService.findById(mockUser.getId())).thenReturn(mockUser);
        UserDetails mockUserDetails = mock(UserDetails.class);
        when(securityContext.getAuthentication()).thenReturn(new UsernamePasswordAuthenticationToken(mockUserDetails, null));
        when(mockUserDetails.getUsername()).thenReturn("differentMail@test.com");

        // WHEN
        ResponseEntity<?> response = userController.save(userId.toString());

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
    
    @Test
    void deleteBadRequestTest() {
        // GIVEN
        String invalidUserId = "invalidId";

        // WHEN
        ResponseEntity<?> response = userController.save(invalidUserId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

}
