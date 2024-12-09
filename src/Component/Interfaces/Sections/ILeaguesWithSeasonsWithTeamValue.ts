import { IOption } from "../Basic/IOption";
export interface ILeaguesWithSeasonsWithTeamValue {
  leagueID: number;
  seasonID: number;
  teamsSelected: IOption[];
}
