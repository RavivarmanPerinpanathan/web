import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingCoachingComponent } from './rating-coaching.component';

describe('RatingCoachingComponent', () => {
  let component: RatingCoachingComponent;
  let fixture: ComponentFixture<RatingCoachingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingCoachingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingCoachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
