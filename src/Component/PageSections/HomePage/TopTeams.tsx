import React, { useEffect, useState } from 'react'
import { CallFootballLiveApiGetAction, GetTeamsLogo, kindsLoadData, ShowKindLoadData } from '../../Helper/HelperFun';
import { ITeamDetails } from '../../Interfaces/Basic/ITeamDetails';

const TopTeams = () => {
   //#region Hook & Members

   const [kindLoadData, setKindLoadData] = useState<kindsLoadData>("Wait");
   const [topTeams, setTopTeams] = useState<ITeamDetails[]>([]);

  //#endregion

  //#region Method

  //#endregion

   // Calling for initialization.
  useEffect(() => {

    // Get top teams details using an Football API service.
    const GetTopTeams = async () : Promise<void> => {

      try {

        const jsonData = await CallFootballLiveApiGetAction('football-top-trending-teams');
        const topTeamsData : ITeamDetails[] = jsonData.response.top_trending_teams;
        if(topTeamsData)
            {
              const teamsWithLogo = GetTeamsLogo(topTeamsData); 
              setTopTeams(await teamsWithLogo);       
            }
      } catch (err) {
        console.log(err, "error");
        setKindLoadData("Error");
      }
    };

    GetTopTeams();
  }, []);

  return (
    <div>
    {
    topTeams.length > 0 ? 
    (
      <ul className="sectionList">
        {
        topTeams.map((team : ITeamDetails) => 
          (
          <li key={team.id} className="sectionItemList">
            <div>
              <p className="topLeagueDesc">
                {team.name}  - {team.shortName} - {team.nameCode}
              </p>
              <p className="topLeagueDesc">
              {team.rating}
              </p>
                <img
                  src={team.logo}
                  alt={`${team.name} logo`}
                  className="leagueLogo"
                  style={{ width: '50px', height: '50px' }}
                />
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No teams available</p>
    )}
  </div>

  )
}

export default TopTeams
