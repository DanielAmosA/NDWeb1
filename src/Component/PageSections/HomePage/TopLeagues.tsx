import React, { useEffect, useState } from 'react'
import { CallFootballFreeApiGetAction, CallFootballLiveApiGetAction, GetLeaguesLogo, kindsLoadData, ShowKindLoadData } from '../../Helper/HelperFun';
import { IGetTopLeagues } from '../../Interfaces/ApiRes/Top/IGetTopLeagues';
import { IGetLeagues } from '../../Interfaces/ApiRes/Select/IGetLeagues';

const TopLeagues = () => {
  
   //#region Hook & Members

   const [kindLoadData, setKindLoadData] = useState<kindsLoadData>("Wait");
   const [topLeagues, setTopLeagues] = useState<IGetTopLeagues[]>([]);

  //#endregion

  //#region Method

  //#endregion

   // Calling for initialization.
  useEffect(() => {

    // Get top leagues details using an Football API service.
    const GetTopLeagues = async () : Promise<void> => {

      try {

        const jsonData = await CallFootballFreeApiGetAction('football-top-unique-tournaments');
        const topLeaguesData : IGetTopLeagues[] = jsonData.response.uniqueTournaments;
        if(topLeaguesData)
            {
              const leaguesWithLogo = GetLeaguesLogo(topLeaguesData);    
              setTopLeagues(await leaguesWithLogo);      
            }
      } catch (err) {
        console.log(err, "error");
        setKindLoadData("Error");
      }
    };
  
      GetTopLeagues();
    }, []);

  return (
    <div>
        {
        topLeagues.length > 0 ? 
        (
          <ul className="sectionList">
            {
            topLeagues.map((league: IGetTopLeagues) => 
              (
              <li key={league.id} className="sectionItemList">
                <div>
                  <p className="topLeagueDesc">
                    {league.name} - {league.category.name}
                  </p>
                  {league.logo && (
                    <img
                      src={league.logo}
                      alt={`${league.name} logo`}
                      className="leagueLogo"
                      style={{ width: '50px', height: '50px' }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No leagues available</p>
        )}
      </div>
      )
    }

export default TopLeagues
