import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewStatComponent } from './create-new-stat.component';

describe('CreateNewStatComponent', () => {
  let component: CreateNewStatComponent;
  let fixture: ComponentFixture<CreateNewStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewStatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
