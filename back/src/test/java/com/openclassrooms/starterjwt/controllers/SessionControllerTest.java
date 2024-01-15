package com.openclassrooms.starterjwt.controllers;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class SessionControllerTest {
	
	@Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;

    private Session mockSession;

    @BeforeEach
    public void setup() {
    	List<User> mockUsers = new ArrayList<>();
        mockUsers.add(new User(1L, "user1@mail.com", "User", "USER", "password", false, LocalDateTime.now(), LocalDateTime.now()));
        mockUsers.add(new User(2L, "user2@mail.com", "Test", "TEST", "password", true, LocalDateTime.now(), LocalDateTime.now()));
    	
        Teacher mockTeacher = new Teacher(1L, "Toto", "TOTO", LocalDateTime.now(), LocalDateTime.now());
        
    	this.mockSession = new Session(1L, "Session 1", new Date(), "description 1", mockTeacher, mockUsers, LocalDateTime.now(), LocalDateTime.now());
    }
    
    @Test
    void findByIdSuccessTest() {
        
    	// GIVEN
        String sessionId = "1";
        Session session = this.mockSession;
        when(sessionService.getById(anyLong())).thenReturn(session);

        // WHEN
        ResponseEntity<?> response = sessionController.findById(sessionId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.sessionMapper.toDto(session));
    }
    
    @Test
    void findByIdNotFoundTest() {
        // GIVEN
        String sessionId = "1";
        when(sessionService.getById(anyLong())).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = sessionController.findById(sessionId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void findByIdBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";

        // WHEN
        ResponseEntity<?> response = sessionController.findById(invalidSessionId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void findAllSuccessTest() {
        // GIVEN
        List<Session> sessions = List.of(this.mockSession);
        when(sessionService.findAll()).thenReturn(sessions);

        // WHEN
        ResponseEntity<?> response = sessionController.findAll();

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.sessionMapper.toDto(sessions));
    }
    
    @Test
    void createSuccessTest() {
        // GIVEN
        SessionDto sessionDto = new SessionDto();
        Session session = this.mockSession;
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // WHEN
        ResponseEntity<?> response = sessionController.create(sessionDto);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.sessionMapper.toDto(session));
    }

    @Test
    void updateSuccessTest() {
        // GIVEN
        String sessionId = "1";
        SessionDto sessionDto = new SessionDto();
        Session session = this.mockSession;
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(anyLong(), eq(session))).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // WHEN
        ResponseEntity<?> response = sessionController.update(sessionId, sessionDto);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.sessionMapper.toDto(session));
    }
    
    @Test
    void updateBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";
        SessionDto sessionDto = new SessionDto();

        // WHEN
        ResponseEntity<?> response = sessionController.update(invalidSessionId, sessionDto);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void deleteSuccessTest() {
        // GIVEN
        String sessionId = "1";
        Session session = this.mockSession;
        when(sessionService.getById(anyLong())).thenReturn(session);

        // WHEN
        ResponseEntity<?> response = sessionController.save(sessionId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(sessionService, times(1)).delete(Long.parseLong(sessionId));
    }
    
    @Test
    void deleteNotFoundTest() {
        // GIVEN
        String invalidSessionId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.save(invalidSessionId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
    
    @Test
    void deleteBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";

        // WHEN
        ResponseEntity<?> response = sessionController.save(invalidSessionId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void participateSuccessTest() {
        // GIVEN
        String sessionId = "1";
        String userId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.participate(sessionId, userId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(sessionService, times(1)).participate(Long.parseLong(sessionId), Long.parseLong(userId));
    }
    
    @Test
    void participateBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";
        String userId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.participate(invalidSessionId, userId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void noLongerParticipateSuccessTest() {
        // GIVEN
        String sessionId = "1";
        String userId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.noLongerParticipate(sessionId, userId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(sessionService, times(1)).noLongerParticipate(Long.parseLong(sessionId), Long.parseLong(userId));
    }
    
    @Test
    void noLongerParticipateBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";
        String userId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.noLongerParticipate(invalidSessionId, userId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

}
