import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTaskbarComponent } from './login-taskbar.component';

describe('LoginTaskbarComponent', () => {
  let component: LoginTaskbarComponent;
  let fixture: ComponentFixture<LoginTaskbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginTaskbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginTaskbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
