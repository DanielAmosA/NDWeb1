import React, { useEffect, useState } from 'react'
import { CallFootballLiveApiGetAction, GetLeaguesLogo, GetPlayersLogo, kindsLoadData, ShowKindLoadData } from '../../Helper/HelperFun';
import { IGetTopPlayers } from '../../Interfaces/ApiRes/Top/IGetTopPlayers';

const TopPlayers = () => {
  
   //#region Hook & Members

   const [kindLoadData, setKindLoadData] = useState<kindsLoadData>("Wait");
   const [topPlayers, setTopPlayers] = useState<IGetTopPlayers[]>([]);

  //#endregion

  //#region Method

  //#endregion

   // Calling for initialization.
  useEffect(() => {

    // Get top players details using an Football API service.
    const GetTopPlayers = async () : Promise<void> => {

      try {

        const jsonData = await CallFootballLiveApiGetAction('football-player-trending-top-players');
        const topPlayersData : IGetTopPlayers[] = jsonData.response.topPlayers;
        console.log(topPlayersData);
        
        if(topPlayersData)
            {
              const playersWithLogo = GetPlayersLogo(topPlayersData); 
              setTopPlayers(await playersWithLogo); 
            }
      } catch (err) {
        console.log(err, "error");
        setKindLoadData("Error");
      }
    };

    GetTopPlayers();
  }, []);

  return (
    <div>
        {
        topPlayers.length > 0 ? 
        (
          <ul className="sectionList">
            {
            topPlayers.map((player : IGetTopPlayers) => 
              (
              <li key={player.player.id} className="sectionItemList">
                <div>
                  <p className="topLeagueDesc">
                    {player.event.tournament.name} -  {player.event.tournament.category.name}
                  </p>
                  <p className="topLeagueDesc">
                    {player.team.name}
                  </p>
                  <p className="topLeagueDesc">
                    {player.player.name}
                    {player.player.jerseyNumber}
                    {player.player.position}
                    {player.player.height}
                    <hr/>
                    {new Date(player.player.dateOfBirthTimestamp).toLocaleDateString()}
                    {}
                  </p>
                    <img
                      src={player.logo}
                      alt={`${player.player.name} logo`}
                      className="leagueLogo"
                      style={{ width: '50px', height: '50px' }}
                    />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No players available</p>
        )}
      </div>


  )
}

export default TopPlayers
