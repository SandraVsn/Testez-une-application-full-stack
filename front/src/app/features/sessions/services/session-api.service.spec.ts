import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const sessions: Session[] = [
    {
      id: 1,
      name: 'Test',
      description: 'Test',
      date: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      teacher_id: 1,
      users: [1, 2, 3],
    },
    {
      id: 2,
      name: 'Test2',
      description: 'Test2',
      date: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      teacher_id: 1,
      users: [1, 2, 3],
    },
    {
      id: 3,
      name: 'Test3',
      description: 'Test3',
      date: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      teacher_id: 1,
      users: [1, 2, 3],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    // THEN
    expect(service).toBeTruthy();
  });

  it('should get all sessions', () => {
    // WHEN
    service.all().subscribe((response) => {
      // THEN
      expect(response).toBeTruthy();
      expect(response.length).toEqual(3);
      expect(response[0].name).toEqual('Test');
    });

    const request = httpMock.expectOne('api/session');
    expect(request.request.method).toEqual('GET');

    request.flush(sessions);
  });

  it('should get session', () => {
    // WHEN
    service.detail('1').subscribe((response) => {
      // THEN
      expect(response).toBeTruthy();
      expect(response.id).toBe(1);
      expect(response.name).toBe('Test');
    });

    const request = httpMock.expectOne('api/session/1');
    expect(request.request.method).toEqual('GET');

    request.flush(sessions[0]);
  });

  it('should delete session', () => {
    // WHEN
    service.delete('1').subscribe((response) => {
      // THEN
      expect(response).toBeUndefined();
    });

    const request = httpMock.expectOne('api/session/1');
    expect(request.request.method).toEqual('DELETE');

    request.flush({});
  });

  it('should create session', () => {
    // GIVEN
    const newSession: Session = {
      name: 'Test4',
      description: 'description',
      date: new Date(Date.now()),
      teacher_id: 1,
      users: [1, 2, 3],
    };

    // WHEN
    service.create(newSession).subscribe((response) => {
      // THEN
      expect(response).toBeTruthy();
      expect(response.name).toBe('Test4');
      expect(response.description).toBe('description');
    });

    const request = httpMock.expectOne('api/session');
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual(newSession);

    request.flush(newSession);
  });

  it('should update a session', () => {
    // GIVEN
    const updatedSession: Session = {
      id: 1,
      name: 'UPDATED Test',
      description: 'Test',
      date: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      teacher_id: 1,
      users: [1, 2, 3],
    };

    // WHEN
    service.update('1', updatedSession).subscribe((response) => {
      // THEN
      expect(response).toBeTruthy();
      expect(response.name).toBe('UPDATED Test');
    });

    const request = httpMock.expectOne('api/session/1');
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toEqual(updatedSession);

    request.flush(updatedSession);
  });

  it('should allow a user to participate', () => {
    // WHEN
    service.participate('1', '1').subscribe((response) => {
      // THEN
      expect(response).toBeUndefined();
    });

    const request = httpMock.expectOne('api/session/1/participate/1');
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toBeNull();
    request.flush({});
  });

  it('should allow a user to stop participating', () => {
    // WHEN
    service.unParticipate('1', '1').subscribe((response) => {
      // THEN
      expect(response).toBeUndefined();
    });

    const request = httpMock.expectOne('api/session/1/participate/1');
    expect(request.request.method).toEqual('DELETE');
    request.flush({});
  });
});
