import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSocialComponent } from './contact-social.component';

describe('ContactSocialComponent', () => {
  let component: ContactSocialComponent;
  let fixture: ComponentFixture<ContactSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSocialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
