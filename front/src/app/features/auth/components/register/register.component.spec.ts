import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [AuthService],
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

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a register form with email, first name, last name, password, and a disabled submit button', () => {
    // GIVEN
    const form = fixture.nativeElement;

    // WHEN
    const email = form.querySelector('input[formControlName="email"]');
    const firstName = form.querySelector('input[formControlName="firstName"]');
    const lastName = form.querySelector('input[formControlName="lastName"]');
    const password = form.querySelector('input[formControlName="password"]');
    const submitButton = form.querySelector('button[type="submit"]');

    // THEN
    expect(email).toBeTruthy();
    expect(firstName).toBeTruthy();
    expect(lastName).toBeTruthy();
    expect(password).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(submitButton.disabled).toBe(true);
  });

  it('should mark form controls as invalid if empty after focus and blur', () => {
    // GIVEN
    const form = fixture.nativeElement;

    // WHEN
    const email = form.querySelector('input[formControlName="email"]');
    const firstName = form.querySelector('input[formControlName="firstName"]');
    const lastName = form.querySelector('input[formControlName="lastName"]');
    const password = form.querySelector('input[formControlName="password"]');

    // THEN
    [email, firstName, lastName, password].forEach((control) => {
      control.focus();
      control.blur();
      expect(control.classList).toContain('ng-invalid');
    });
  });

  it('should enable the submit button with valid form', () => {
    // GIVEN
    const form = fixture.nativeElement;
    const submitButton = form.querySelector('button[type="submit"]');
    const email = form.querySelector('input[formControlName="email"]');
    const firstName = form.querySelector('input[formControlName="firstName"]');
    const lastName = form.querySelector('input[formControlName="lastName"]');
    const password = form.querySelector('input[formControlName="password"]');

    // WHEN
    email.value = 'mail@test.com';
    email.dispatchEvent(new Event('input'));
    firstName.value = 'Test';
    firstName.dispatchEvent(new Event('input'));
    lastName.value = 'TEST';
    lastName.dispatchEvent(new Event('input'));
    password.value = 'password';
    password.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // THEN
    expect(email.classList).toContain('ng-valid');
    expect(firstName.classList).toContain('ng-valid');
    expect(lastName.classList).toContain('ng-valid');
    expect(password.classList).toContain('ng-valid');
    expect(submitButton.disabled).toBe(false);
  });

  it('should show an error when there is an error', () => {
    // GIVEN
    component.onError = true;
    fixture.detectChanges();

    // WHEN
    const form = fixture.nativeElement;
    const errorMessage = form.querySelector('span.error');

    // THEN
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('An error occurred');
  });

  it('should show an error when the form is empty', () => {
    // GIVEN
    const form = fixture.nativeElement;
    const submitButton = form.querySelector('button[type="submit"]');

    // WHEN
    submitButton.click();
    fixture.detectChanges();

    // THEN
    expect(form.querySelectorAll('input.ng-invalid')).toHaveLength(4);
  });

  it('should indicate error', () => {
    // GIVEN
    const registerSpy = jest
      .spyOn(authService, 'register')
      .mockImplementation(() => throwError(() => new Error('err')));

    // WHEN
    component.submit();

    // THEN
    expect(registerSpy).toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  it('should navigate to the login page', async () => {
    // GIVEN
    const navigateSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(async () => true);

    const authSpy = jest
      .spyOn(authService, 'register')
      .mockImplementation(() => of(undefined));

    // WHEN
    component.submit();

    // THEN
    expect(authSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
