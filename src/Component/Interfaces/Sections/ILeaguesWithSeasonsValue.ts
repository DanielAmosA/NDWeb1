import { ISeason } from "./ISeason";

export interface ILeaguesWithSeasonsValue {
  leagueID : number ;
  leagueName : string ;
  seasonsDetails : ISeason[];
  }