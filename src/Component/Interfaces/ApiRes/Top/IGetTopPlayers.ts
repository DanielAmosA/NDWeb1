import { ITournament } from "../../Basic/ITournament";

export interface IGetTopPlayers {
   
    event : {
        tournament : ITournament
    }

    team : {
        name : string;
    }

    player : {
        name : string;
        position:string;
        jerseyNumber : string;
        height : number;
        dateOfBirthTimestamp : number;
        proposedMarketValueRaw : {
            value : number;
            currency : string;
        }
        id:number;
    }

    ratingVersions : {
        original : number;
    }

    logo : string;

   }