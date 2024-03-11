import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsSellerComponent } from './order-details-seller.component';

describe('OrderDetailsSellerComponent', () => {
  let component: OrderDetailsSellerComponent;
  let fixture: ComponentFixture<OrderDetailsSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsSellerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderDetailsSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
