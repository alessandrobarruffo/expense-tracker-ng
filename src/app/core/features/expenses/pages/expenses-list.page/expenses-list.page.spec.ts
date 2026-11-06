import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesListPage } from './expenses-list.page';

describe('ExpensesListPage', () => {
  let component: ExpensesListPage;
  let fixture: ComponentFixture<ExpensesListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
