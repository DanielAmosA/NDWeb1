import { IGetBasicRes } from '../IGetBasicRes';

export interface ILeaguesWithSeasonsValueRes {
  leagueID : number ;
  leagueName : string ;
  seasonsDetails : IGetBasicRes[];
  }