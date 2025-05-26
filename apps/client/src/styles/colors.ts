// F1 Brand Colors
export const F1_RED = '#E10600';
export const F1_BLACK = '#1E1E1E';
export const F1_WHITE = '#FFFFFF';

// Team Colors
export const MERCEDES = '#00D2BE';
export const RED_BULL = '#0600EF';
export const FERRARI = '#DC0000';
export const MCLAREN = '#FF8700';
export const ASTON_MARTIN = '#006F62';
export const ALPINE = '#0090FF';
export const WILLIAMS = '#005AFF';
export const ALPHA_TAURI = '#2B4562';
export const ALFA_ROMEO = '#900000';
export const HAAS = '#FFFFFF';

// UI Colors
export const BACKGROUND_LIGHT = '#F6F4EF';
export const BACKGROUND_DARK = '#121212';
export const PAPER_LIGHT = '#F5F5F5';
export const PAPER_DARK = '#1E1E1E';
export const TEXT_PRIMARY_LIGHT = '#1E1E1E';
export const TEXT_PRIMARY_DARK = '#FFFFFF';
export const TEXT_SECONDARY_LIGHT = '#666666';
export const TEXT_SECONDARY_DARK = '#B0B0B0';

// Function to get team color by name
export const getTeamColor = (teamName: string): string => {
  const teamNameLower = teamName.toLowerCase();
  
  if (teamNameLower.includes('mercedes')) return MERCEDES;
  if (teamNameLower.includes('red bull')) return RED_BULL;
  if (teamNameLower.includes('ferrari')) return FERRARI;
  if (teamNameLower.includes('mclaren')) return MCLAREN;
  if (teamNameLower.includes('aston martin')) return ASTON_MARTIN;
  if (teamNameLower.includes('alpine')) return ALPINE;
  if (teamNameLower.includes('williams')) return WILLIAMS;
  if (teamNameLower.includes('alphatauri') || teamNameLower.includes('alpha tauri') || teamNameLower.includes('rb')) return ALPHA_TAURI;
  if (teamNameLower.includes('alfa romeo')) return ALFA_ROMEO;
  if (teamNameLower.includes('haas')) return HAAS;
  
  return F1_RED; // Default to F1 red if team not found
}; 