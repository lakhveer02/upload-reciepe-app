import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeShearingComponent } from './recipe-shearing.component';

describe('RecipeShearingComponent', () => {
  let component: RecipeShearingComponent;
  let fixture: ComponentFixture<RecipeShearingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeShearingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeShearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
