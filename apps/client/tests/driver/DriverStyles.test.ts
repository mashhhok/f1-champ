import { formatDate } from '../../src/components/driver/styles';

describe('Driver Styles Utilities', () => {
  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const dateString = '1997-09-30';
      const expected = new Date(dateString).toLocaleDateString();
      
      expect(formatDate(dateString)).toBe(expected);
    });
    
    it('handles different date formats', () => {
      const dateString = '1985-01-07';
      const expected = new Date(dateString).toLocaleDateString();
      
      expect(formatDate(dateString)).toBe(expected);
    });
  });
}); 