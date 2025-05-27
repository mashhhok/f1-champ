import { RACE_TABLE_COLUMNS } from '../../../src/components/races/raceTable/tableConfig';
import { TableColumn } from '../../../src/components/races/types';
import '../../jest-globals';

describe('RACE_TABLE_COLUMNS', () => {
  it('contains all expected columns in correct order', () => {
    expect(RACE_TABLE_COLUMNS).toHaveLength(6);
    
    const expectedColumns = [
      { id: 'grandPrix', label: 'Grand Prix' },
      { id: 'winner', label: 'Winner' },
      { id: 'team', label: 'Team' },
      { id: 'date', label: 'Date' },
      { id: 'laps', label: 'Laps' },
      { id: 'time', label: 'Time' }
    ];

    expectedColumns.forEach((expected, index) => {
      expect(RACE_TABLE_COLUMNS[index].id).toBe(expected.id);
      expect(RACE_TABLE_COLUMNS[index].label).toBe(expected.label);
    });
  });

  it('has correct responsive visibility and width settings', () => {
    const expectedConfig = [
      { id: 'grandPrix', minWidth: 'sm', hideOnXs: undefined, hideOnSm: undefined },
      { id: 'winner', minWidth: 'sm', hideOnXs: undefined, hideOnSm: undefined },
      { id: 'team', minWidth: 'sm', hideOnXs: undefined, hideOnSm: undefined },
      { id: 'date', minWidth: 'sm', hideOnXs: true, hideOnSm: undefined },
      { id: 'laps', minWidth: 'md', hideOnXs: true, hideOnSm: true },
      { id: 'time', minWidth: 'md', hideOnXs: true, hideOnSm: true }
    ];

    expectedConfig.forEach((expected, index) => {
      const column = RACE_TABLE_COLUMNS[index];
      expect(column.minWidth).toBe(expected.minWidth);
      expect(column.hideOnXs).toBe(expected.hideOnXs);
      expect(column.hideOnSm).toBe(expected.hideOnSm);
    });
  });

  it('has required properties and correct types', () => {
    RACE_TABLE_COLUMNS.forEach(column => {
      expect(column).toHaveProperty('id');
      expect(column).toHaveProperty('label');
      expect(column).toHaveProperty('minWidth');
      
      expect(typeof column.id).toBe('string');
      expect(typeof column.label).toBe('string');
      expect(typeof column.minWidth).toBe('string');
      
      expect(column.id).toBeTruthy();
      expect(column.label).toBeTruthy();
      expect(column.minWidth).toBeTruthy();
    });
  });

  it('has unique identifiers', () => {
    const columnIds = RACE_TABLE_COLUMNS.map(col => col.id);
    const columnLabels = RACE_TABLE_COLUMNS.map(col => col.label);
    
    expect(new Set(columnIds).size).toBe(columnIds.length);
    expect(new Set(columnLabels).size).toBe(columnLabels.length);
  });

  it('conforms to TableColumn interface', () => {
    RACE_TABLE_COLUMNS.forEach(column => {
      const isValidColumn = (col: any): col is TableColumn => {
        return (
          typeof col.id === 'string' &&
          typeof col.label === 'string' &&
          (col.minWidth === undefined || typeof col.minWidth === 'string') &&
          (col.hideOnXs === undefined || typeof col.hideOnXs === 'boolean') &&
          (col.hideOnSm === undefined || typeof col.hideOnSm === 'boolean')
        );
      };
      
      expect(isValidColumn(column)).toBe(true);
    });
  });
}); 