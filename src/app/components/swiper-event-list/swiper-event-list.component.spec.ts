import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperEventListComponent } from './swiper-event-list.component';

describe('SwiperEventListComponent', () => {
  let component: SwiperEventListComponent;
  let fixture: ComponentFixture<SwiperEventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwiperEventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
