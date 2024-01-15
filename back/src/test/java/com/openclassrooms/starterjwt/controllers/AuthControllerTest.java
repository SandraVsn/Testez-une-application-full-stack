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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthControllerTest {
	
    @Mock
    private SecurityContext securityContext;
    
    @Mock
    private Authentication authentication;
	
	@Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthController authController;
    
    @BeforeEach
    public void setup() {
    	
        SecurityContextHolder.setContext(securityContext);
    	    	
    }
    
    @Test
    void authenticateUserTest() {
        
    	// GIVEN
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("email@test.com");
        loginRequest.setPassword("password");

        UserDetailsImpl userDetails = mock(UserDetailsImpl.class);
        when(userDetails.getUsername()).thenReturn("user@example.com");

        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("mockJwtToken");

        User mockUser = new User(1L, "user1@mail.com", "User", "USER", "password", false, LocalDateTime.now(), LocalDateTime.now());
        when(userRepository.findByEmail(any())).thenReturn(java.util.Optional.of(mockUser));

        // WHEN
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(JwtResponse.class);
        JwtResponse jwtResponse = (JwtResponse) response.getBody();
        assertThat(jwtResponse.getToken()).isEqualTo("mockJwtToken");
        assertThat(jwtResponse.getUsername()).isEqualTo("user@example.com");
        // Add more assertions as needed
    }
    
    @Test
    void registerUserSuccessTest() {
        // GIVEN
        SignupRequest signUpRequest = new SignupRequest();
        signUpRequest.setEmail("user@example.com");
        signUpRequest.setFirstName("User");
        signUpRequest.setLastName("USER");
        signUpRequest.setPassword("password");
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");

        // WHEN
        ResponseEntity<?> response = authController.registerUser(signUpRequest);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(MessageResponse.class);
        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertThat(messageResponse.getMessage()).isEqualTo("User registered successfully!");
    }
    
    @Test
    void registerUserBadRequestTest() {
        // GIVEN
        SignupRequest invalidSignUpRequest = new SignupRequest();
        invalidSignUpRequest.setEmail("user@example.com");
        invalidSignUpRequest.setFirstName("User");
        invalidSignUpRequest.setLastName("USER");
        invalidSignUpRequest.setPassword("password");

        when(userRepository.existsByEmail(any())).thenReturn(true);

        // WHEN
        ResponseEntity<?> response = authController.registerUser(invalidSignUpRequest);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }


}
