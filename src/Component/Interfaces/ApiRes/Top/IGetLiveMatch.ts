// export interface IGetLiveMatch2 {
//     league : string;
//     home_flag : string;
//     home_name : string;
//     away_flag : string;
//     away_name : string;
//     date : string;
//     time : string;
//     status : string; // Uncoming | 
//    }

import { kindsLiveMatchesStatus } from "../../../Helper/HelperFun";
import { ITeamDetails } from "../../Basic/ITeamDetails";
import { ITeamScore } from "../../Basic/ITeamScore";
import { ITournament } from "../../Basic/ITournament";

   export interface IGetLiveMatch {
    tournament : ITournament;

    status : {
        type : kindsLiveMatchesStatus;
    }

    homeTeam : ITeamDetails;
    awayTeam : ITeamDetails;
    homeScore : ITeamScore;
    awayScore : ITeamScore;
    startTimestamp : number;

   }

