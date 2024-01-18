import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { of } from 'rxjs';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let snackBar: MatSnackBar;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let router: Router;

  const sessionInformation = {
    admin: true,
    token: 'token',
    id: 1,
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    type: 'type',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'update', component: FormComponent },
        ]),
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: SessionService,
          useValue: { sessionInformation },
        },
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    // GIVEN
    // Component is created in beforeEach

    // WHEN
    component.ngOnInit();

    // THEN
    expect(component).toBeTruthy();
  });

  it('should redirect to the sessions page when user is not an admin', () => {
    // GIVEN
    const spy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(async () => true);
    const modifiedSessionInformation = {
      ...sessionInformation,
      admin: false,
    };
    sessionService.sessionInformation = modifiedSessionInformation;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(spy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should show an error message when the form is empty', () => {
    // GIVEN
    const formElement: HTMLElement = fixture.nativeElement;
    const submitButton = formElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );
    if (!submitButton) {
      throw new Error('Submit button not found');
    }

    // WHEN
    submitButton.click();
    fixture.detectChanges();

    // THEN
    expect(
      formElement.querySelectorAll('mat-form-field.ng-invalid')
    ).toHaveLength(4);
  });

  it('should get the values of the sessions when updating', async () => {
    // GIVEN
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
    jest.spyOn(router, 'url', 'get').mockReturnValue('/update');
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(session));

    // WHEN
    component.ngOnInit();

    // THEN
    expect(router.url).toBe('/update');
    expect(component.sessionForm?.value.name).toEqual(session.name);
    expect(component.onUpdate).toBe(true);
  });

  it('should submit an update form', () => {
    // GIVEN
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
    component.onUpdate = true;
    const sessionApiUpdateSpy = jest
      .spyOn(sessionApiService, 'update')
      .mockReturnValue(of(session));
    const snackBarSpy = jest.spyOn(snackBar, 'open');
    const routerSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(async () => true);

    // WHEN
    component.submit();

    // THEN
    expect(sessionApiUpdateSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should submit a create form', () => {
    // GIVEN
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
    component.onUpdate = false;
    const sessionApiCreateSpy = jest
      .spyOn(sessionApiService, 'create')
      .mockReturnValue(of(session));
    const snackBarSpy = jest.spyOn(snackBar, 'open');
    const routerSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(async () => true);

    // WHEN
    component.submit();

    // THEN
    expect(sessionApiCreateSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });
});
