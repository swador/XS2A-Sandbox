import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdctPaymentCancellationDeleteComponent } from './rdct-payment-cancellation-delete.component';
import {Component, Input, Pipe, PipeTransform} from '@angular/core';
import {LineCommandComponent} from "../../../../../custom-elements/line-command/line-command.component";

describe('RdctPaymentCancellationDeleteComponent', () => {
  let component: RdctPaymentCancellationDeleteComponent;
  let fixture: ComponentFixture<RdctPaymentCancellationDeleteComponent>;

  @Component({
    selector: 'app-play-wth-data',
    template: ''
  })
  class MockPlayWithDataComponent {
    @Input() headers: object;
    @Input() paymentServiceFlag: boolean;
    @Input() paymentProductFlag: boolean;
    @Input() paymentIdFlag: boolean;
  }

  @Pipe({name: 'translate'})
  class TranslatePipe implements PipeTransform {
    transform(value) {
      const tmp = value.split('.');
      return tmp[1];
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RdctPaymentCancellationDeleteComponent,
        MockPlayWithDataComponent,
        TranslatePipe,
        LineCommandComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdctPaymentCancellationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create (not all)', () => {
    expect(component).toBeTruthy();
  });
});
