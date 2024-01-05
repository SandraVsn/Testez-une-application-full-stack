import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [AuthService, SessionService],
      imports: [
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error message on login failure', () => {
    // Arrange
    const loginSpy = jest.spyOn(authService, 'login').mockReturnValue(throwError(() => 'Invalid login credentials'));

    // Act
    component.submit();
    fixture.detectChanges();

    // Assert
    expect(loginSpy).toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  });

  it('should log in and navigate to sessions on successful login', () => {
    // Arrange
    const loginResponse: SessionInformation = { 
      token: 'thisIsAMockedToken',
      type: 'session',
      id: 1,
      username: 'yoga@example.com',
      lastName: 'YOGA', 
      firstName: 'Yoga',
      admin: true,
     };
    const loginSpy = jest.spyOn(authService, 'login').mockReturnValue(of(loginResponse));
    const logInSpy = jest.spyOn(sessionService, 'logIn');
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Act
    component.form.setValue({ email: 'test@example.com', password: 'password123' });
    component.submit();
    fixture.detectChanges();

    // Assert
    expect(loginSpy).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(logInSpy).toHaveBeenCalledWith(loginResponse);
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should display an error when email is not provided', () => {
    // Act
    component.form.setValue({ email: '', password: 'password123' });
    component.submit();
    fixture.detectChanges();

    // Assert
    console.log('onError:', component.onError);  // DEBUG !!!!!!!!!!!!!
    expect(component.onError).toBeTruthy();
  });

  it('should display an error when password is too short', () => {
    // Act
    component.form.setValue({ email: 'test@example.com', password: 'pw' });
    component.submit();
    fixture.detectChanges();

    // Assert
    console.log('onError:', component.onError);  // Ajoutez cette ligne pour déboguer
    expect(component.onError).toBeTruthy();
  });
});