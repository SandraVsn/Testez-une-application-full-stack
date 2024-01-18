import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import {SessionApiService} from "../../services/session-api.service";
import {RouterTestingModule} from "@angular/router/testing";
import {Session} from "../../interfaces/session.interface";
import {of} from "rxjs";

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: SessionService,
          useValue: {
            sessionInformation: {
              admin: true,
            },
          },
        },
        {
          provide: SessionApiService,
          useValue: {
            all: () => of(sessions),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created successfully', () => {

    // THEN
    expect(component).toBeTruthy();
  });

  it('should have a list of sessions', () => {

    // THEN
    expect(component.sessions$).toBeTruthy();
    component.sessions$.subscribe((sessions) => {
      expect(sessions).toHaveLength(3);
    });

    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('mat-card.item');
    expect(cards).toHaveLength(3);

    const card = cards[0];
    expect(card.querySelector('mat-card-title').textContent).toContain(
        sessions[0].name
    );
  });

  it('should have a create button when user is an admin', () => {

    // THEN
    expect(component.user?.admin).toBeTruthy();

    const compiled = fixture.nativeElement;

    const createButton = compiled.querySelector('mat-card-header button');
    expect(createButton).toBeTruthy();
    expect(createButton.textContent).toContain('Create');
  });

  it('should not have a create button when user is not an admin', () => {
    // GIVEN
    component.user!.admin = false;
    fixture.detectChanges();

    // THEN
    expect(component.user?.admin).toBeFalsy();

    const compiled = fixture.nativeElement;

    const createButton = compiled.querySelector('mat-card-header button');
    expect(createButton).toBeFalsy();
  });

  it('should have an edit and detail button for each session', () => {

    // THEN
    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('mat-card.item');

    cards.forEach((card:any) => {
      const cardButtons = card.querySelectorAll('mat-card-actions button');
      expect(cardButtons).toBeTruthy();
      expect(cardButtons).toHaveLength(2);
      expect(cardButtons[0].textContent).toContain('Detail');
      expect(cardButtons[1].textContent).toContain('Edit');
    });
  });

  it('should have a detail button for each session when user is not an admin', () => {
    // GIVEN
    component.user!.admin = false;
    fixture.detectChanges();

    // THEN
    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('mat-card.item');

    cards.forEach((card:any) => {
      const cardButtons = card.querySelectorAll('mat-card-actions button');
      expect(cardButtons).toBeTruthy();
      expect(cardButtons).toHaveLength(1);
      expect(cardButtons[0].textContent).toContain('Detail');
    });
  });
});