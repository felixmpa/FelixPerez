import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { By } from '@angular/platform-browser';
import {RouterLink} from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NavbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo with the correct text', () => {
    const logoElement = fixture.debugElement.query(By.css('.logo')).nativeElement;
    expect(logoElement.textContent).toBe('BANCO');
  });

  it('should have routerLink set to "/" on the logo', () => {
    const logoElement = fixture.debugElement.query(By.directive(RouterLink));
    expect(logoElement.attributes['ng-reflect-router-link']).toBe('/');
  });
});
