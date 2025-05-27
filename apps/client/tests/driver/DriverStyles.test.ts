import { formatDate, getStyles } from '../../src/components/driver/styles';
import { createTheme } from '@mui/material/styles';
import { F1_RED } from '../../src/styles/colors';

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

    it('handles leap year dates', () => {
      const dateString = '2000-02-29';
      const expected = new Date(dateString).toLocaleDateString();
      
      expect(formatDate(dateString)).toBe(expected);
    });

    it('handles end of year dates', () => {
      const dateString = '1999-12-31';
      const expected = new Date(dateString).toLocaleDateString();
      
      expect(formatDate(dateString)).toBe(expected);
    });
  });

  describe('getStyles', () => {
    const mockTheme = createTheme();

    it('returns correct style object structure', () => {
      const styles = getStyles(mockTheme);
      
      expect(styles).toHaveProperty('card');
      expect(styles).toHaveProperty('media');
      expect(styles).toHaveProperty('name');
      expect(styles).toHaveProperty('infoContainer');
      expect(styles).toHaveProperty('infoText');
      expect(styles).toHaveProperty('button');
      expect(styles).toHaveProperty('teamIndicator');
    });

    it('returns correct card styles', () => {
      const styles = getStyles(mockTheme);
      
      expect(styles.card).toEqual({
        maxWidth: 345,
        borderRadius: 2,
        overflow: 'hidden'
      });
    });

    it('returns correct media styles', () => {
      const styles = getStyles(mockTheme);
      
      expect(styles.media).toEqual({
        height: '200px',
        objectFit: 'cover'
      });
    });

    it('returns correct name styles with Formula1 font', () => {
      const styles = getStyles(mockTheme);
      
      expect(styles.name).toEqual({
        fontFamily: '"Formula1", sans-serif',
        fontWeight: 700
      });
    });

    it('returns correct info container styles', () => {
      const styles = getStyles(mockTheme);
      
      expect(styles.infoContainer).toEqual({
        mt: 2
      });
    });

    it('returns correct info text styles', () => {
      const styles = getStyles(mockTheme);
      
      expect(styles.infoText).toEqual({
        mb: 0.5
      });
    });

    it('returns correct button styles with F1 red color', () => {
      const styles = getStyles(mockTheme);
      
      expect(styles.button).toEqual({
        fontSize: '0.6rem',
        color: F1_RED
      });
    });

    it('teamIndicator function returns correct styles for a team', () => {
      const styles = getStyles(mockTheme);
      const teamStyles = styles.teamIndicator('Mercedes');
      
      expect(teamStyles).toHaveProperty('width', '100%');
      expect(teamStyles).toHaveProperty('height', '5px');
      expect(teamStyles).toHaveProperty('backgroundColor');
    });

    it('teamIndicator function works with different team names', () => {
      const styles = getStyles(mockTheme);
      const mercedesStyles = styles.teamIndicator('Mercedes');
      const ferrariStyles = styles.teamIndicator('Ferrari');
      
      expect(mercedesStyles.backgroundColor).toBeDefined();
      expect(ferrariStyles.backgroundColor).toBeDefined();
      expect(mercedesStyles.backgroundColor).not.toBe(ferrariStyles.backgroundColor);
    });
  });
}); 