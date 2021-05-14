import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedInfoComponent } from './selected-info.component';

describe('SelectedInfoComponent', () => {
  let component: SelectedInfoComponent;
  let fixture: ComponentFixture<SelectedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
