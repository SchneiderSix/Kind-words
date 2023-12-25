import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterComponent } from './letter.component';

describe('LetterComponent', () => {
  let component: LetterComponent;
  let fixture: ComponentFixture<LetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
