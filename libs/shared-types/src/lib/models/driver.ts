export interface Driver {
  driverId: string;
  givenName: string;
  familyName: string;
  permanentNumber?: string;
  dateOfBirth: string;
  nationality: string;
  wikipediaUrl?: string;
  races?: DriverRace[];
}

export interface DriverRace {
  raceName: string;
  raceUrl: string;
  raceDate: string;
  grandPrix: string;
  teamName: string;
  teamUrl?: string;
  driverName: string;
  driverUrl?: string;
  laps?: string;
  time?: string;
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    permanentNumber?: string;
    code?: string;
    url?: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  Constructors: Array<{
    constructorId: string;
    url?: string;
    name: string;
    nationality: string;
  }>;
}