import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsyncDistanceComponent } from './async-distance.component';

describe('AsyncDistanceComponent', () => {
  let component: AsyncDistanceComponent;
  let fixture: ComponentFixture<AsyncDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsyncDistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
