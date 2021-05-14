import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NglIndexComponent } from './ngl-index.component';

describe('NglIndexComponent', () => {
  let component: NglIndexComponent;
  let fixture: ComponentFixture<NglIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NglIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NglIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
