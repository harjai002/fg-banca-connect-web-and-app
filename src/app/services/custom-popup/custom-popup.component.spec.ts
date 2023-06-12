import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPopupComponent } from './custom-popup.component';

describe('CustomPopupComponent', () => {
  let component: CustomPopupComponent;
  let fixture: ComponentFixture<CustomPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
