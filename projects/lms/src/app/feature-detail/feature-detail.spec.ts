import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureDetail } from './feature-detail';

describe('FeatureDetail', () => {
  let component: FeatureDetail;
  let fixture: ComponentFixture<FeatureDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
