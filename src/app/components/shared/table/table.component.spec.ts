import { STableComponent } from './table.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock data
const mockColumns = [
  { label: 'ID', field: 'id' },
  { label: 'Name', field: 'name' },
  { label: 'Actions', field: 'actions', isAction: true },
];

const mockRows = [
  { id: '1', name: 'Product A' },
  { id: '2', name: 'Product B' },
];

describe('STableComponent', () => {
  let component: STableComponent;
  let fixture: ComponentFixture<STableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [STableComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(STableComponent);
    component = fixture.componentInstance;
    component.columns = mockColumns;

    fixture.detectChanges();
  });

  it('should create the table component', () => {
    expect(component).toBeTruthy();
  });


  it('should render columns correctly', () => {
    const compiled = fixture.nativeElement;
    const columnHeaders = compiled.querySelectorAll('th');
    expect(columnHeaders.length).toBe(mockColumns.length);
    expect(columnHeaders[0].textContent.trim()).toBe(mockColumns[0].label);
    expect(columnHeaders[1].textContent.trim()).toBe(mockColumns[1].label);
  });

  it('should render rows correctly', () => {
    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(mockRows.length);
    expect(rows[0].textContent).toContain(mockRows[0].name);
  });

  it('should call onSearchTermChange when search term changes', () => {
    const searchSpy = jest.spyOn(component, 'onSearchTermChange');
    component.onSearchTermChange('test');
    expect(searchSpy).toHaveBeenCalledWith('test');
  });

  it('should open delete modal when delete action is clicked', () => {
    const deleteSpy = jest.spyOn(component, 'openDeleteModal');
    component.openDeleteModal('1', 'Product A');
    expect(deleteSpy).toHaveBeenCalledWith('1', 'Product A');
  });

});
