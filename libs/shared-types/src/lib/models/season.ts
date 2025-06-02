export interface SeasonChampion {
  year: number;
  champion: string;
  isSeasonEnded: boolean;
}

export interface SeasonWinner {
  year: number;
  driverId: string;
  driverName: string;
  driverNationality: string;
  points: number;
  wins: number;
  teamName: string;
  isSeasonEnded: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}