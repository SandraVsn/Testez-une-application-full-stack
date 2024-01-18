import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    // THEN
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    // GIVEN
    const form = {
      email: 'mail@test.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'TEST',
    };

    // WHEN
    service.register(form).subscribe((response) => {
      // THEN
      expect(response).toBeFalsy();
    });

    const request = controller.expectOne('api/auth/register');
    expect(request.request.body).toEqual(form);
    expect(request.request.method).toEqual('POST');
    request.flush({});
  });

  it('should log in a user', () => {
    // GIVEN
    const form = {
      email: 'mail@test.com',
      password: 'password',
    };

    // WHEN
    service.login(form).subscribe((response) => {
    // THEN
    expect(response).toBeTruthy();
    expect(response).toHaveProperty('token');
  });

    const request = controller.expectOne('api/auth/login');
    expect(request.request.body).toEqual(form);
    expect(request.request.method).toEqual('POST');
    request.flush({ token: 'token' });
  });
});
