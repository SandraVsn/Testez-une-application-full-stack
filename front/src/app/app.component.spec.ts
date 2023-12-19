import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';


describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AuthService, 
        SessionService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should call $isLogged() and return true', () => {
    // Arrange
    const isLoggedSpy = jest.spyOn(sessionService, '$isLogged').mockReturnValue(of(true));

    // Act
    const result: Observable<boolean> = app.$isLogged();

    // Assert
    result.subscribe((value) => {
      expect(value).toBe(true);
      expect(isLoggedSpy).toHaveBeenCalled();
    });
  });

  it('should call $isLogged() and return false', () => {
    // Arrange
    const isLoggedSpy = jest.spyOn(sessionService, '$isLogged').mockReturnValue(of(false));

    // Act
    const result: Observable<boolean> = app.$isLogged();

    // Assert
    result.subscribe((value) => {
      expect(value).toBe(false);
      expect(isLoggedSpy).toHaveBeenCalled();
    });
  });

  it('should call logout() and navigate to home', () => {
    // Arrange
    const logOutSpy = jest.spyOn(sessionService, 'logOut');
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Act
    app.logout();

    // Assert
    expect(logOutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });  it('should call logout() and navigate to home', () => {
    // Arrange
    const logOutSpy = jest.spyOn(sessionService, 'logOut');
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Act
    app.logout();

    // Assert
    expect(logOutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});