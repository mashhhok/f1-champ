// Define interfaces for API response types
export interface RaceResult {
    raceName: string;
    url: string;
    date: string;
    season: string;
    Results: Array<{
      position: string;
      Driver: {
        driverId: string;
        givenName: string;
        familyName: string;
        url: string;
        dateOfBirth: string;
        nationality: string;
        permanentNumber: string;
      };
      Constructor: {
        name: string;
        url: string;
      };
      laps: string;
      Time: {
        time: string;
      };
    }>;
  }
  
  export interface ApiResponse {
    MRData: {
      RaceTable: {
        Races: RaceResult[];
      };
    };
  }

  export interface DriverStanding {
    position: string;
    Driver: {
      givenName: string;
      familyName: string;
    };
  }
  
  export interface F1ApiResponse {
    MRData: {
      StandingsTable: {
        StandingsLists: Array<{
          DriverStandings: DriverStanding[];
        }>;
      };
    };
  }