import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreateFabComponent } from './event-create-fab.component';

describe('EventCreateFabComponent', () => {
  let component: EventCreateFabComponent;
  let fixture: ComponentFixture<EventCreateFabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCreateFabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCreateFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
