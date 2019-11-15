import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTaskbarComponent } from './home-taskbar.component';

describe('HomeTaskbarComponent', () => {
  let component: HomeTaskbarComponent;
  let fixture: ComponentFixture<HomeTaskbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTaskbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTaskbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
