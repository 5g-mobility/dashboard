import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadInfoComponent } from './road-info.component';

describe('RoadInfoComponent', () => {
  let component: RoadInfoComponent;
  let fixture: ComponentFixture<RoadInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
