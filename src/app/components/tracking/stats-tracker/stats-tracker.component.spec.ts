import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsTrackerComponent } from './stats-tracker.component';

describe('StatsTrackerComponent', () => {
  let component: StatsTrackerComponent;
  let fixture: ComponentFixture<StatsTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
