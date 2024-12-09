import { IOption } from './../Basic/IOption';
export interface ITeamModel {
    leagueID: number;
    seasonID: number;
    teamsSelectedPrev : IOption[];
  }