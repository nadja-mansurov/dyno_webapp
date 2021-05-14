import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPanelIndexComponent } from './control-panel-index.component';

describe('ControlPanelIndexComponent', () => {
  let component: ControlPanelIndexComponent;
  let fixture: ComponentFixture<ControlPanelIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlPanelIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPanelIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
