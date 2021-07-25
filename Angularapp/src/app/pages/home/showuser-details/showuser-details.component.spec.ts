import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowuserDetailsComponent } from './showuser-details.component';

describe('ShowuserDetailsComponent', () => {
  let component: ShowuserDetailsComponent;
  let fixture: ComponentFixture<ShowuserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowuserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowuserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
