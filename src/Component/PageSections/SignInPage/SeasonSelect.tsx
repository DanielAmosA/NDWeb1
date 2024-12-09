import React, { useEffect, useState } from "react";
import { CallFootballLiveApiGetAction, kindsLoadData, ShowKindLoadData, ShowPop, ShowWarningDialog } from "../../Helper/HelperFun";
import { Button } from "react-bootstrap";
import { IOption } from "../../Interfaces/Basic/IOption";
import { ILeaguesWithSeasonsCheckBoxData } from "../../Interfaces/Sections/ILeaguesWithSeasonsCheckBoxData";
import { IGetBasicRes } from "../../Interfaces/ApiRes/IGetBasicRes";
import { ILeaguesWithSeasonsValueRes } from "../../Interfaces/ApiRes/Select/ILeaguesWithSeasonsValueRes";
import { ISeasonLeague } from "../../Interfaces/Sections/ISeasonLeague";

const SeasonSelect = (
  {
    leaguesWithSeasonsValuesPrev,
    leaguesValues,
    OnSeasonSelectButtonClick

  }:
    {
      leaguesWithSeasonsValuesPrev: ILeaguesWithSeasonsCheckBoxData[],
      leaguesValues: IOption[],
      OnSeasonSelectButtonClick: (newLeaguesWithSeasonsValues: ILeaguesWithSeasonsCheckBoxData[]) => void

    }
) => {


  //#region Hook & Members

  const [kindLoadData, setKindLoadData] = useState<kindsLoadData>("Wait");

  const [showWarning, setShowWarning] = useState<boolean>(false);

  const [seasons, setSeasons] = useState<ILeaguesWithSeasonsValueRes[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<ILeaguesWithSeasonsCheckBoxData[]>([]);
  const [finishLoadSeasons, setFinishLoadSeasons] = useState<boolean>(false);

  const maxSelection = 10;

  //#endregion

  //#region Method

  //#endregion

  // Get information about the season selection, 
  // Since it's a checkbox, it will either be checked or not
  // And also verify if we have reached the maximum selection limit, 
  // Then act accordingly.

  const HandleCheckboxChange = (seasonsSelectLeagueID: number, seasonsSelectLeagueName: string, seasonsSelectID: number, seasonsSelectName: string): void => {
    const seasonsSelect: ISeasonLeague = { leagueID: seasonsSelectLeagueID, leagueName: seasonsSelectLeagueName, seasonID: seasonsSelectID, seasonName: seasonsSelectName };
    setSelectedSeasons((prevSeasonsSelected) => {

      const alreadySelected = prevSeasonsSelected.some(
        seasonsSelected =>
          seasonsSelected.leagueID === seasonsSelect.leagueID &&
          seasonsSelected.seasonID === seasonsSelect.seasonID
      );

      if (alreadySelected) {
        return prevSeasonsSelected.filter(
          season =>
            season.leagueID !== seasonsSelect.leagueID ||
            season.seasonID !== seasonsSelect.seasonID
        );
      }
      else {
        if (selectedSeasons.length < maxSelection) {
          return [...prevSeasonsSelected, seasonsSelect];
        }
        else {
          setShowWarning(true);
          return prevSeasonsSelected;
        }
      }
    })

  }

  // Receiving data about the button the user clicked 
  // In a dialog and handling accordingly.

  const GetUserChoice = (): void => {
    setShowWarning(false);
  }

  // Calling for initialization.
  useEffect(() => {

    var seasonsFound: ILeaguesWithSeasonsValueRes[] = [];

    // Get seasons details by League using an Football API service.
    const GetSeasonsByLeague = async (league: IOption): Promise<ILeaguesWithSeasonsValueRes[] | null> => {

      try {

        const queryParams = new URLSearchParams({
          leagueid: league.value.toString(),
        });

        const jsonData = await CallFootballLiveApiGetAction('football-league-all-seasons', queryParams);
        const seasonsData: IGetBasicRes[] = jsonData.response.seasons;
        
        if(seasonsData && seasonsData.length === 0)
        {
          return null;
        }
        else
        {
          var newSeasonsArr: IGetBasicRes[] = [];
          seasonsData.map((season: IGetBasicRes) => {
            const seasonName = season.name;
            const seasonId = season.id;
            const newSeasonDetails = { name: seasonName, id: seasonId };
            newSeasonsArr.push(newSeasonDetails);
            return <></>;
          });
  
          const objNewSeason: ILeaguesWithSeasonsValueRes = {
            leagueName: league.label,
            leagueID: league.value,
            seasonsDetails: newSeasonsArr,
          };
  
          seasonsFound = [...seasonsFound, objNewSeason];
          return seasonsFound;
        }
       
      } catch (err) {
        console.log(err, "error");
        setKindLoadData("Error");
        return null;
      }
    };

    // Get seasons for all the selected leagues
    // Each time a single API Action will be call to the service for the next selected league."

    const GetAllSeasonsByLeague = async (): Promise<void> => {  
      for (var league of leaguesValues) {
        const seasonsFound = await GetSeasonsByLeague(league);
        if (seasonsFound) {
          await setSeasons(seasonsFound);
        }
        else {
          setKindLoadData("Error");
          return;
        }

      }
      await setFinishLoadSeasons(true);
      if (leaguesWithSeasonsValuesPrev.length > 0) {
        await setSelectedSeasons(leaguesWithSeasonsValuesPrev);
        await OnSeasonSelectButtonClick(leaguesWithSeasonsValuesPrev);
      }
    };

    GetAllSeasonsByLeague();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="selectElem">
      {
        finishLoadSeasons && seasons.length > 0 ?
          (
          <div>
            {ShowPop("League seasons", <>
              Here you need to choose <strong>which seasons</strong> you want to display for the <strong>selected league 🗓</strong>
            </>, "Select Season")}

            <div className="leaguesSeasonsWithButton">
              <div className="leaguesSeasonsContainer">
                {seasons.map((seasonObj) => {
                  return (
                    <div className="mainLeagueSeasons" key={seasonObj.leagueName}>
                      <h2 className="leagueName">{seasonObj.leagueName}</h2>
                      {seasonObj.seasonsDetails.map((season) => {
                        return (
                          <div className="mainSeason" key={season.id}>
                            <label className="seasonDetails">
                              <input
                                type="checkbox"
                                value={season.id}
                                checked={selectedSeasons.some(seasonsSelected => seasonsSelected.leagueID === seasonObj.leagueID && seasonsSelected.seasonID === season.id)}
                                onChange={() => HandleCheckboxChange(seasonObj.leagueID, seasonObj.leagueName, season.id, season.name)}
                              />
                              &nbsp;
                              {season.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {
                selectedSeasons.length > 0
                  ? <Button variant='info' className="selectBtn" onClick={() => OnSeasonSelectButtonClick(selectedSeasons)}>Select Team</Button>
                  : null
              }
            </div>
          </div>
          )

          :
          ShowKindLoadData(kindLoadData)
      }

      {
        showWarning &&
        (
          ShowWarningDialog("Sign In Warning 📛",
            <>You can only select up to ${maxSelection} seasons..</>,
            GetUserChoice,
            "Ok"
          )
        )
      }
    </div>
  );
};

export default SeasonSelect;
