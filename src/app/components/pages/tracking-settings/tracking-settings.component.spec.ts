import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingSettingsComponent } from './tracking-settings.component';

describe('TrackingSettingsComponent', () => {
  let component: TrackingSettingsComponent;
  let fixture: ComponentFixture<TrackingSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
