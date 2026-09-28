import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LoginPayload } from '../model/login-model';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ErrorResponse } from '../model/error-model';

const MOCK_FILLED_PAYLOAD: LoginPayload = {
  username: 'user',
  password: 'password'
};

const MOCK_EMPTY_PAYLOAD: LoginPayload = {
  username: '',
  password: ''
};

describe.only('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let debugElement: DebugElement;
  let httpMock: HttpTestingController;

  const formButtons = () => debugElement.queryAll(By.css('button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    httpMock = TestBed.inject(HttpTestingController);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable login and register button if form is not filled', () => {
    fixture.componentInstance.loginModel.set(MOCK_FILLED_PAYLOAD);
    fixture.detectChanges();
    formButtons().forEach((button) => {
      expect(button.nativeElement.disabled).toBe(false);
    });
    fixture.componentInstance.loginModel.set(MOCK_EMPTY_PAYLOAD);
    fixture.detectChanges();
    formButtons().forEach((button) => {
      expect(button.nativeElement.disabled).toBe(true);
    });
  });

  it('should call register request once', () => {
    fixture.componentInstance.loginModel.set(MOCK_FILLED_PAYLOAD);
    fixture.detectChanges();
    const register = vi.spyOn(component, 'register');
    formButtons()[1].nativeElement.click();
    const req = httpMock.expectOne('/api/user/register');
    req.flush(null, { status: 201, statusText: 'CREATED' });
    expect(register).toHaveBeenCalledOnce();
  });

  it('should show error message',() => {

    fixture.componentInstance.loginModel.set(MOCK_FILLED_PAYLOAD);
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBeFalsy();
    const register = vi.spyOn(component,'register');
    formButtons()[1].nativeElement.click();
    const req = httpMock.expectOne('/api/user/register');
    req.flush({code: 'ERR_500_GENERIC', requestId: '123', message: 'error', timestamp: '122'} as ErrorResponse, { status: 500, statusText: 'ERROR' });
    expect(register).toHaveBeenCalledOnce();
    fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBeTruthy();

  })

});
