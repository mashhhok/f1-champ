import {Schema, model} from "mongoose";

interface IRace {
    raceName: string;
    raceUrl: string;
    raceDate: string;
}

export interface IDriver {
    driverId: string,
    race: IRace[],
    season: string,
    givenName: string,
    familyName: string,
    dateOfBirth: string,
    nationality: string,
    permanentNumber?: string,
    driverUrl: string,
    teamName: string,
    teamUrl: string,
    laps: string,
    time: string,
}

const driverSchema = new Schema({
    driverId: { type: String, required: true },
    race: {type: [{
        raceName: {type: String, required: true},
        raceUrl: {type: String, required: true},
        raceDate: {type: String, required: true}
    }], required: true},
    season: {type: String, required: true},
    givenName: {type: String, required: true},
    familyName: {type: String, required: true},
    dateOfBirth: {type: String, required: true},
    nationality: {type: String, required: true},
    permanentNumber: {type: String, required: false},
    driverUrl: {type: String, required: true},
    teamName: {type: String, required: true},
    teamUrl: {type: String, required: true},
    laps: {type: String, required: true},
    time: {type: String, required: true},
}, {timestamps: true, versionKey: false})

// Add indexes for optimized queries
driverSchema.index({ season: 1, driverId: 1 }, { unique: true });
driverSchema.index({ season: 1 });
driverSchema.index({ driverId: 1 });
driverSchema.index({ 'race.raceDate': 1 });
driverSchema.index({ teamName: 1 });

const Driver = model<IDriver>("Driver", driverSchema);

export default Driver;
