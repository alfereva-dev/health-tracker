import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewTrackerComponent } from './create-new-tracker.component';

describe('CreateNewStatComponent', () => {
  let component: CreateNewTrackerComponent;
  let fixture: ComponentFixture<CreateNewTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewTrackerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
