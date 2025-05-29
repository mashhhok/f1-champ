import {Schema, model} from "mongoose";


export interface ISeasonWinner {
    season: string,
    givenName: string,
    familyName: string,
    isSeasonEnded: boolean,
}

const seasonWinnerSchema = new Schema({
    season: {type: String, required: true},
    givenName: {type: String, required: true},
    familyName: {type: String, required: true},
    isSeasonEnded: {type: Boolean, required: true}
}, {timestamps: true, versionKey: false})

const SeasonWinner = model<ISeasonWinner>("SeasonWinner", seasonWinnerSchema);

export default SeasonWinner;