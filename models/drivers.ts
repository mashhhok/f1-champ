import {Schema, model} from "mongoose";

export interface IDriver {
    raceName: string[],
    season: string,
    givenName: string,
    familyName: string,
    dateOfBirth: string,
    nationality: string
}

const driverSchema = new Schema({
    raceName: {type: [String], required: true},
    season: {type: String, required: true},
    givenName: {type: String, required: true},
    familyName: {type: String, required: true},
    dateOfBirth: {type: String, required: true},
    nationality: {type: String, required: true}
}, {timestamps: true, versionKey: false})

const Driver = model<IDriver>("Driver", driverSchema);

export default Driver;
