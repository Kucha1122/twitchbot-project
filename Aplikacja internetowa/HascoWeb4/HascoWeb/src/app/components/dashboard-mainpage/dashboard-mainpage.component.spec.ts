import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMainpageComponent } from './dashboard-mainpage.component';

describe('DashboardMainpageComponent', () => {
  let component: DashboardMainpageComponent;
  let fixture: ComponentFixture<DashboardMainpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMainpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
