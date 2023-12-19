import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MeComponent } from './me.component';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockRouter: Partial<Router>;
  let mockSnackBar: MatSnackBar;
  let mockUserService: Partial<UserService>;
  let mockSessionService: Partial<SessionService>;

  const mockUser: User = {
    id: 1,
    email: 'yoga@example.com',
    lastName: 'YOGA', 
    firstName: 'Yoga',
    admin: true,
    password: 'MockedPassword',
    createdAt: new Date(), 
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    };

    mockSnackBar = {
      open: jest.fn(),
    } as unknown as MatSnackBar;

    mockUserService = {
      getById: jest.fn().mockReturnValue(of(mockUser)),
      delete: jest.fn().mockReturnValue(of({})),
    };

    mockSessionService = {
      sessionInformation: {
        token: 'thisIsAMockedToken',
        type: 'session',
        id: 1,
        username: 'yoga@example.com',
        lastName: 'YOGA', 
        firstName: 'Yoga',
        admin: true,
      },
      logOut: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: UserService, useValue: mockUserService },
        { provide: SessionService, useValue: mockSessionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and set user', () => {
    // Arrange
    const userServiceSpy = jest.spyOn(mockUserService, 'getById');

    // Act
    component.ngOnInit();

    // Assert
    expect(userServiceSpy).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('should call back and navigate back in history', () => {
    // Arrange
    const historyBackSpy = jest.spyOn(window.history, 'back');

    // Act
    component.back();

    // Assert
    expect(historyBackSpy).toHaveBeenCalled();
  });

  it('should call delete and perform necessary actions', () => {
    // Arrange
    const userServiceDeleteSpy = jest.spyOn(mockUserService, 'delete');
    const logOutSpy = jest.spyOn(mockSessionService, 'logOut');
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');
    const snackBarOpenSpy = jest.spyOn(mockSnackBar, 'open');

    // Act
    component.delete();

    // Assert
    expect(userServiceDeleteSpy).toHaveBeenCalledWith('1');
    expect(logOutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
    expect(snackBarOpenSpy).toHaveBeenCalledWith('Your account has been deleted !', 'Close', {
      duration: 3000,
    });
  });
});