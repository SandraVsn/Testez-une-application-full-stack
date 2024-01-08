package com.openclassrooms.starterjwt.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class TeacherControllerTest {
	
	 @Mock
	 private TeacherService teacherService;

	 @Mock
	 private TeacherMapper teacherMapper;

	 @InjectMocks
	 private TeacherController teacherController;

	 private Teacher mockTeacher;

	 @BeforeEach
	 public void setup() {	     
	     this.mockTeacher = new Teacher(1L, "Toto", "TOTO", LocalDateTime.now(), LocalDateTime.now());
	 }
	 
	 @Test
	 void findByIdSuccessTest() {
		 
		 // GIVEN
		 String teacherId = "1";
		 Teacher teacher = this.mockTeacher;
		 when(teacherService.findById(anyLong())).thenReturn(teacher);
		 
		 // WHEN
		 ResponseEntity<?> response = teacherController.findById(teacherId);
		 
		 // THEN
		 assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
		 assertThat(response.getBody()).isEqualTo(this.teacherMapper.toDto(teacher));
		 
	 }
	 @Test
	 void findByIdNotFoundTest() {
		 
		 // GIVEN
	     String teacherId = "1";
	     when(teacherService.findById(anyLong())).thenReturn(null);

	     // WHEN
	     ResponseEntity<?> response = teacherController.findById(teacherId);

	     // THEN
	     assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
	 
	 }

	 @Test
	 void findByIdBadRequestTest() {
	        
		 // GIVEN
	     String invalidTeacherId = "invalidId";

	     // WHEN
	     ResponseEntity<?> response = teacherController.findById(invalidTeacherId);

	     // THEN
	     assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	    
	 }
	 
	 @Test
	 void findAllSuccessTest() {
	        
		 // GIVEN
	     List<Teacher> teachers = List.of(this.mockTeacher);
	     when(teacherService.findAll()).thenReturn(teachers);

	     // WHEN
	     ResponseEntity<?> response = teacherController.findAll();

	     // THEN
	     assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	     assertThat(response.getBody()).isEqualTo(this.teacherMapper.toDto(teachers));
	    }


}
