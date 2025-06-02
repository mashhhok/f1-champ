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

// Add indexes for optimized queries
seasonWinnerSchema.index({ season: 1 }, { unique: true });
seasonWinnerSchema.index({ isSeasonEnded: 1 });
seasonWinnerSchema.index({ season: 1, isSeasonEnded: 1 });

const SeasonWinner = model<ISeasonWinner>("SeasonWinner", seasonWinnerSchema);

export default SeasonWinner;