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
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // GIVEN: Le composant est créé
    expect(component).toBeTruthy();
  });

  it('should have a login form with email, password, and a disabled submit button', () => {
    // WHEN
    const form = fixture.nativeElement;
    const email = form.querySelector('input[formControlName="email"]');
    const password = form.querySelector('input[formControlName="password"]');
    const submitButton = form.querySelector('button[type="submit"]');

    // THEN
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(submitButton.disabled).toBe(true);
  });

  it('should be invalid if empty after focus and blur', () => {
    // WHEN
    const form = fixture.nativeElement;
    const email = form.querySelector('input[formControlName="email"]');
    const password = form.querySelector('input[formControlName="password"]');
    
    email.focus();
    email.blur();

    password.focus();
    password.blur();

    // THEN
    expect(email.classList).toContain('ng-invalid');
    expect(password.classList).toContain('ng-invalid');
  });

  it('should contain valid class with valid email and password', () => {
    // WHEN
    const form = fixture.nativeElement;
    const email = form.querySelector('input[formControlName="email"]');
    const password = form.querySelector('input[formControlName="password"]');

    email.focus();
    email.blur();
    password.focus();
    password.blur();

    email.value = 'mail@test.com';
    email.dispatchEvent(new Event('input'));
    password.value = 'password';
    password.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // THEN
    expect(email.value).toBe('mail@test.com');
    expect(email.classList).toContain('ng-valid');
    expect(password.value).toBe('password');
    expect(password.classList).toContain('ng-valid');
  });

  it('should enable the submit button with valid email and password', () => {
    // WHEN
    const form = fixture.nativeElement;
    const submitButton = form.querySelector('button[type="submit"]');
    const email = form.querySelector('input[formControlName="email"]');

    email.value = 'mail@test.com';
    email.dispatchEvent(new Event('input'));

    const password = form.querySelector('input[formControlName="password"]');
    password.value = 'password';
    password.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // THEN
    expect(submitButton.disabled).toBe(false);
  });

  it('should show an error message', () => {
    // WHEN
    component.onError = true;
    fixture.detectChanges();

    // THEN
    const form = fixture.nativeElement;
    const errorMessage = form.querySelector('p.error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage!.textContent).toContain('An error occurred');
  });

  it('should indicate error', () => {
    // GIVEN : auth service with login error
    const authService = TestBed.inject(AuthService);
    const loginSpy = jest.spyOn(authService, 'login').mockImplementation(() => throwError(() => new Error('err')));

    // WHEN
    component.submit();

    // THEN
    expect(loginSpy).toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  it('should navigate to the sessions page', () => {
    // GIVEN : auth service with valid login
    const authService = TestBed.inject(AuthService);
    const authSpy = jest.spyOn(authService, 'login').mockImplementation(() => of({} as SessionInformation));

    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(async () => true);

    // WHEN
    component.submit();

    // THEN
    expect(authSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });
});