# useStyles Hook

A custom hook that combines `useTheme` and `getStyles` functionality to reduce boilerplate code across components.

## Usage

### Before (Old Pattern)
```tsx
import { useTheme } from "@mui/material";
import { getStyles } from './styles';

const MyComponent = () => {
  useTheme(); // Often unused
  const styles = getStyles();
  
  return <div sx={styles.container}>Content</div>;
};
```

### After (New Pattern)
```tsx
import { getStyles } from './styles';
import { useStyles } from '../../hooks/useStyles';

const MyComponent = () => {
  const styles = useStyles(getStyles);
  
  return <div sx={styles.container}>Content</div>;
};
```

## Migration Steps

1. Remove `useTheme` import from `@mui/material`
2. Add `import { useStyles } from '../../hooks/useStyles'` (adjust path as needed)
3. Replace:
   ```tsx
   useTheme();
   const styles = getStyles();
   ```
   with:
   ```tsx
   const styles = useStyles(getStyles);
   ```

## Benefits

- **Reduced boilerplate**: No need to call `useTheme()` and `getStyles()` separately
- **Consistent pattern**: Same approach across all components
- **Future-proof**: Easy to extend if you need theme-aware styles later
- **Type-safe**: Full TypeScript support with proper type inference

## Advanced Usage

If your `getStyles` function needs the theme object:

```tsx
// styles.ts
export const getStyles = (theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  }
});

// Component.tsx
const styles = useStyles(getStyles); // theme is automatically passed
```

## Files to Migrate

The following components currently use the old pattern and can be migrated:

- `src/components/races/RacesTable.tsx`
- `src/components/races/raceTable/RaceTableHeader.tsx`
- `src/components/races/raceTable/DriverModal.tsx`
- `src/components/season/SeasonDetails.tsx`
- `src/components/season/SeasonTable.tsx`
- And others (see grep results for complete list) 