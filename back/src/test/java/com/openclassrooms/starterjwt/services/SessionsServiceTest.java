package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class SessionsServiceTest {
	@Mock
	private SessionRepository sessionRepository;
	
	@Mock
	private UserRepository userRepository;
	
	@InjectMocks
	private SessionService sessionService;
	
    private List<Session> mockSessions;
	
    @BeforeEach
    public void setup() {
    	
    	// N'est pas mutable ! Donc ajout ou suppression impossible
    	/* List<User> mockUsers = List.of(
    			new User(1L, "user1@mail.com", "User", "USER", "password", false, LocalDateTime.now(), LocalDateTime.now()),
    			new User(2L, "user2@mail.com", "Test", "TEST", "password", true, LocalDateTime.now(), LocalDateTime.now())

			);
    	
        List<Teacher> mockTeachers = List.of(
                new Teacher(1L, "Toto", "TOTO", LocalDateTime.now(), LocalDateTime.now()),
                new Teacher(2L, "Tata", "TATA", LocalDateTime.now(), LocalDateTime.now())
        );
        
    	this.mockSessions = List.of(
				new Session(1L, "Session 1", new Date(), "description 1", mockTeachers.get(0), mockUsers, LocalDateTime.now(), LocalDateTime.now()),
				new Session(2L, "Session 2", new Date(), "description 2", mockTeachers.get(1), mockUsers, LocalDateTime.now(), LocalDateTime.now())
        ); */

        List<User> mockUsers = new ArrayList<>();
        mockUsers.add(new User(1L, "user1@mail.com", "User", "USER", "password", false, LocalDateTime.now(), LocalDateTime.now()));
        mockUsers.add(new User(2L, "user2@mail.com", "Test", "TEST", "password", true, LocalDateTime.now(), LocalDateTime.now()));
    	
        List<Teacher> mockTeachers = new ArrayList<>();
        mockTeachers.add(new Teacher(1L, "Toto", "TOTO", LocalDateTime.now(), LocalDateTime.now()));
        mockTeachers.add(new Teacher(2L, "Tata", "TATA", LocalDateTime.now(), LocalDateTime.now()));
        
    	this.mockSessions = new ArrayList<>();
		this.mockSessions.add(new Session(1L, "Session 1", new Date(), "description 1", mockTeachers.get(0), mockUsers, LocalDateTime.now(), LocalDateTime.now()));
		this.mockSessions.add(new Session(2L, "Session 2", new Date(), "description 2", mockTeachers.get(1), mockUsers, LocalDateTime.now(), LocalDateTime.now()));
    }
	
	@Test
	void createTest() {
		
		// GIVEN
		Session session = this.mockSessions.get(0);
		
		// WHEN
		when(sessionRepository.save(session)).thenReturn(session);
		Session result = sessionService.create(session);
		
		// THEN
		assertThat(result).isEqualTo(session);
		verify(sessionRepository, times(1)).save(session);
	
	}
	
	@Test
	void deleteTest() {
		
		// GIVEN
		Long sessionId = 1L;
		
		// WHEN
		sessionService.delete(sessionId);
		
		// THEN
		verify(sessionRepository, times(1)).deleteById(sessionId);
	
	}
	
	@Test
	void findAllTest() {
		
		// GIVEN
		when(sessionRepository.findAll()).thenReturn(this.mockSessions);
		
		// WHEN
		List<Session> result = sessionService.findAll();
		
		// THEN
		assertThat(result).isEqualTo(this.mockSessions);
		verify(sessionRepository, times(1)).findAll();
	
	}
	
	@Test
	void getByIdExistingSessionTest() {
		
		// GIVEN
		Long sessionId = 1L;
		Session mockSession = this.mockSessions.get(0);
		when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));
		
		// WHEN
		Session result = sessionService.getById(sessionId);
		
		// THEN
		assertThat(result).isEqualTo(mockSession);
		verify(sessionRepository, times(1)).findById(sessionId);
		
	}
	
	@Test
	void getByIdNonExistingSessionTest() {
		
		// GIVEN
		Long sessionId = 1L;
		when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());
	
		// WHEN
        Session result = sessionService.getById(sessionId);

        // THEN
        assertThat(result).isNull();
        verify(sessionRepository, times(1)).findById(sessionId);
		
	}
	
	@Test
	void updateTest() {
		
		// GIVEN
		Long sessionId = 1L;
		String newDescription = "New description";
		Session mockedSession = this.mockSessions.get(0);
		Session mockedUpdatedSession = mockedSession.setDescription(newDescription);
	    when(sessionRepository.save(mockedUpdatedSession)).thenReturn(mockedUpdatedSession);
		
		// WHEN 
		Session result = sessionService.update(sessionId, mockedUpdatedSession);
		
		// THEN 
		assertThat(result).isEqualTo(mockedUpdatedSession);
		assertThat(result.getId()).isEqualTo(sessionId);
		assertThat(result.getDescription()).isEqualTo(newDescription);
	    verify(sessionRepository, times(1)).save(mockedUpdatedSession);

	}
	
	@Test
    void participateSuccessTest() {
		
        // GIVEN
        Long sessionId = 1L;
        Long userId = 3L;
        Session mockSession = this.mockSessions.get(0);
        User mockUser = new User(userId, "test@mail.com", "firstName", "LastName", "password", false, LocalDateTime.now(), LocalDateTime.now());
        //mockSession.getUsers().add(mockUser);
        
        when(sessionRepository.findById(any(Long.class))).thenReturn(Optional.of(mockSession));
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(mockUser));
	    when(sessionRepository.save(mockSession)).thenReturn(mockSession);
        
        // WHEN
        sessionService.participate(sessionId, userId);

        // THEN
        assertThat(mockSession.getUsers()).contains(mockUser);
        verify(sessionRepository, times(1)).save(mockSession);
    }
	
	@Test
    void participateSessionNotFoundTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // WHEN / THEN
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository, times(0)).save(any());
    }
	
	@Test
    void participateUserNotFoundTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // WHEN / THEN
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository, times(0)).save(any());
    }
	
	@Test
    void participateAlreadyParticipatingTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        Session mockSession = this.mockSessions.get(0);
        User mockUser = this.mockSessions.get(0).getUsers().get(1);
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        // WHEN / THEN
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
        verify(sessionRepository, times(0)).save(any());
    }
	
	@Test
    void noLongerParticipateSuccessTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        Session mockSession = this.mockSessions.get(0);
        User mockUser = this.mockSessions.get(0).getUsers().get(1);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        // WHEN
        sessionService.noLongerParticipate(sessionId, userId);

        // THEN
        assertThat(mockSession.getUsers()).doesNotContain(mockUser);
        verify(sessionRepository, times(1)).save(mockSession);
    }
	
	@Test
    void noLongerParticipateSessionNotFoundTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 2L;
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // WHEN / THEN
        assertThatThrownBy(() -> sessionService.noLongerParticipate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository, times(0)).save(any());
    }
	
	@Test
    void noLongerParticipateNotParticipatingTest() {
        // GIVEN
        Long sessionId = 1L;
        Long userId = 3L;
        Session mockSession = this.mockSessions.get(0);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        // WHEN / THEN
        assertThatThrownBy(() -> sessionService.noLongerParticipate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
        verify(sessionRepository, times(0)).save(any());
    }

}
