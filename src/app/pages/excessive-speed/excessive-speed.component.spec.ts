import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcessiveSpeedComponent } from './excessive-speed.component';

describe('ExcessiveSpeedComponent', () => {
  let component: ExcessiveSpeedComponent;
  let fixture: ComponentFixture<ExcessiveSpeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcessiveSpeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcessiveSpeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
