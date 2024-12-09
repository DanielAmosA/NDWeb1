import React, { useEffect, useState } from 'react'
import { IGetLiveMatch } from '../../Interfaces/ApiRes/Top/IGetLiveMatch';
import { CallFootballLiveApiGetAction, GetTeamsLiveMatchesLogo, kindsLoadData, ShowKindLoadData } from '../../Helper/HelperFun';
import LiveMatch from '../../Structure/LiveMatch';

const LiveMatches = () => {

  //#region Hook & Members

  const [kindLoadData, setKindLoadData] = useState<kindsLoadData>("Wait");
  const [liveMatches, setLiveMatches] = useState<IGetLiveMatch[]>([]);

  //#endregion

  //#region Method

  //#endregion

  // Calling for initialization.
  useEffect(() => {

    // Get some live match details using an Football API service.
    const GetLiveMatches = async (): Promise<void> => {

      try {

        const jsonData = await CallFootballLiveApiGetAction('football-top-trending-events');
        const liveMatchesData: IGetLiveMatch[] = jsonData.response.top_trending_events;

        if (liveMatchesData) {
          const teamsLiveMatchesWithLogo = GetTeamsLiveMatchesLogo(liveMatchesData);
       setLiveMatches(await teamsLiveMatchesWithLogo);
        }
      } catch (err) {
        console.log(err, "error");
        setKindLoadData("Error");
      }
    };

    GetLiveMatches();
  }, []);

  return (
    <div>
      {
        liveMatches.length > 0 ?
          liveMatches.map((liveMatch: IGetLiveMatch, index:number) => {
            return (
             <LiveMatch 
             tournament = {liveMatch.tournament} 
             status = {liveMatch.status} 
             homeTeam = {liveMatch.homeTeam} 
             awayTeam = {liveMatch.awayTeam} 
             homeScore = {liveMatch.homeScore} 
             awayScore = {liveMatch.awayScore} 
             startTimestamp = {liveMatch.startTimestamp} 
             index = {index}
             />
            
            )
          }
          )

          :
          ShowKindLoadData(kindLoadData)
      }

    </div>
  )
}

export default LiveMatches
