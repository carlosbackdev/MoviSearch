import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendedBannerComponent } from './recomended-banner.component';

describe('RecomendedBannerComponent', () => {
  let component: RecomendedBannerComponent;
  let fixture: ComponentFixture<RecomendedBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendedBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomendedBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
