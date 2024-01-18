import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { TeacherService } from '../../../../services/teacher.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SessionApiService } from '../../services/session-api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;
  let snackbar: MatSnackBar;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  const session = {
    id: 1,
    name: 'Test',
    description: 'Test',
    date: new Date(Date.now()),
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
    teacher_id: 1,
    users: [1, 2, 3],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
      ],
      declarations: [DetailComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    snackbar = TestBed.inject(MatSnackBar);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    component.session = session;
    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    // WHEN
    component.ngOnInit();

    // THEN
    expect(component).toBeTruthy();
  });

  it('should not display delete button when user is not an admin', () => {
    // GIVEN
    component.isAdmin = false;

    // WHEN
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const deleteButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Delete')
    );

    // THEN
    expect(deleteButton).toBeFalsy();
  });

  it('should display delete button when user is an admin', () => {
    // GIVEN
    component.isAdmin = true;

    // WHEN
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const deleteButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Delete')
    );

    // THEN
    expect(deleteButton).toBeTruthy();
  });

  it('should call participate function when participate button is clicked', () => {
    // GIVEN
    component.isAdmin = false;
    component.isParticipate = false;
    fixture.detectChanges();

    // WHEN
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const participateButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Participate')
    );

    const componentSpy = jest
      .spyOn(component, 'participate')
      .mockImplementation(() => {});
    participateButton!.nativeElement.click();

    // THEN
    expect(componentSpy).toHaveBeenCalled();
  });

  it('should call unParticipate function when do not participate button is clicked', () => {
    // GIVEN
    component.isAdmin = false;
    component.isParticipate = true;
    fixture.detectChanges();

    // WHEN
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const participateButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Do not participate')
    );

    const componentSpy = jest
      .spyOn(component, 'unParticipate')
      .mockImplementation(() => {});
    participateButton!.nativeElement.click();

    // THEN
    expect(componentSpy).toHaveBeenCalled();
  });

  it('should recover the session on participate', () => {
    // GIVEN
    component.session = undefined;
    jest
      .spyOn(sessionApiService, 'participate')
      .mockImplementation(() => of(undefined));
    const detailSpy = jest
      .spyOn(sessionApiService, 'detail')
      .mockImplementation(() => of(session));

    // WHEN
    component.participate();

    // THEN
    expect(detailSpy).toHaveBeenCalled();
    expect(component.session).toEqual(session);
  });

  it('should recover the session on unParticipate', () => {
    // GIVEN
    component.session = undefined;

    jest
      .spyOn(sessionApiService, 'unParticipate')
      .mockImplementation(() => of(undefined));
    const detailSpy = jest
      .spyOn(sessionApiService, 'detail')
      .mockImplementation(() => of(session));

    // WHEN
    component.unParticipate();

    // THEN
    expect(detailSpy).toHaveBeenCalled();
    expect(component.session).toEqual(session);
  });

  it('should get the teacher when the session is recovered', () => {
    // GIVEN
    const teacher = {
      id: 1,
      firstName: 'Test',
      lastName: 'TEST',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };
    jest
      .spyOn(sessionApiService, 'detail')
      .mockImplementation(() => of(session));
    jest.spyOn(teacherService, 'detail').mockImplementation(() => of(teacher));

    // WHEN
    component.ngOnInit();

    // THEN
    expect(component.teacher).toEqual(teacher);
  });

  it('should open a snackbar and redirect to the sessions page on delete', () => {
    // GIVEN
    component.isAdmin = true;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const deleteButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Delete')
    );

    const componentSpy = jest.spyOn(component, 'delete');
    const sessionApiSpy = jest
      .spyOn(sessionApiService, 'delete')
      .mockImplementation(() => of(true));
    const matSnackBarSpy = jest.spyOn(snackbar, 'open');
    const routerSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(async () => true);

    // WHEN
    deleteButton!.nativeElement.click();

    // THEN
    expect(componentSpy).toHaveBeenCalled();
    expect(sessionApiSpy).toHaveBeenCalled();
    expect(matSnackBarSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should navigate back when back function is called', () => {
    // GIVEN
    const spy = jest.spyOn(window.history, 'back').mockImplementation(() => {});

    // WHEN
    component.back();

    // THEN
    expect(spy).toHaveBeenCalled();
  });
});
