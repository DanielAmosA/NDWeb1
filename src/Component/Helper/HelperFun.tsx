import { Col, Container, Image, OverlayTrigger, Popover, Row } from "react-bootstrap"
import waitImg from '../../Assets/Pic/Gif/Web/Wait2.gif';
import errorImg from '../../Assets/Pic/Gif/Web/Error.gif';
import errorLoadImg from '../../Assets/Pic/Gif/Web/Error2.gif';
import React from "react";
import { IGetTopLeagues } from "../Interfaces/ApiRes/Top/IGetTopLeagues";
import { IGetLiveMatch } from "../Interfaces/ApiRes/Top/IGetLiveMatch";
import { IGetTopPlayers } from "../Interfaces/ApiRes/Top/IGetTopPlayers";
import { ITeamDetails } from "../Interfaces/Basic/ITeamDetails";


// #region members

export type kindButtons = 'YesNo' | 'Ok';

type dialogActions = (choice?: string) => void;

export type kindsSignInPage = 'Main' | 'CountryWithLeague' | 'SeasonWithTeam';

export type kindsLoadData = 'Wait' | 'Error';

export type kindsLiveMatchesStatus = 'finished' | 'inprogress' | 'upcoming' | 'notstarted';

// # endregion

// #region methods 

// Call by ' get method '  to ' free-api-live-football '  API service 
// based on the apiMethod. 
export const CallFootballLiveApiGetAction = async (apiAction: string, params?: URLSearchParams): Promise<any> => {
  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "eb7bc93132mshf6a6378e2d5b924p1985dcjsn570c111ee2c9");
  myHeaders.append("x-rapidapi-host", "free-api-live-football-data.p.rapidapi.com");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow' as RequestRedirect,
  };

  var apiUrl = `https://free-api-live-football-data.p.rapidapi.com/${apiAction}`;
  if (params) {
    apiUrl += `?${params}`;
  }

  const response = await fetch(apiUrl, requestOptions);

  return await response.json();

}

// Call by ' get method '  to ' free-football-api-data '  API service 
// based on the apiMethod. 
export const CallFootballFreeApiGetAction = async (apiAction: string, params?: URLSearchParams): Promise<any> => {
  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "eb7bc93132mshf6a6378e2d5b924p1985dcjsn570c111ee2c9");
  myHeaders.append("x-rapidapi-host", "free-football-api-data.p.rapidapi.com");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow' as RequestRedirect,
  };

  var apiUrl = `https://free-football-api-data.p.rapidapi.com/${apiAction}`;
  if (params) {
    apiUrl += `?${params}`;
  }

  const response = await fetch(apiUrl, requestOptions);

  return await response.json();

}

// Call by ' get method '  to ' live score '  API service 
// based on the apiMethod. 
export const CallLiveScoreGetAction = async (apiAction: string, params?: URLSearchParams): Promise<any> => {
  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "eb7bc93132mshf6a6378e2d5b924p1985dcjsn570c111ee2c9");
  myHeaders.append("x-rapidapi-host", "livescore6.p.rapidapi.com");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow' as RequestRedirect,
  };

  var apiUrl = `https://livescore6.p.rapidapi.com/news/v2/${apiAction}`;
  if (params) {
    apiUrl += `?${params}`;
  }

  const response = await fetch(apiUrl, requestOptions);

  return await response.json();

}

// Call by ' get method '  to ' football-live-stream '  API service 
// based on the apiMethod. 

export const CallFootballLiveStreamGetAction = async (apiAction: string, params?: URLSearchParams): Promise<any> => {
  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "eb7bc93132mshf6a6378e2d5b924p1985dcjsn570c111ee2c9");
  myHeaders.append("x-rapidapi-host", "football-live-stream-api.p.rapidapi.com");

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow' as RequestRedirect,
  };

  var apiUrl = `https://football-live-stream-api.p.rapidapi.com/${apiAction}`;
  if (params) {
    apiUrl += `?${params}`;
  }

  const response = await fetch(apiUrl, requestOptions);

  return await response.json();

}

 // Receiving the logos of the teams playing will be done separately
export const GetTeamsLiveMatchesLogo = async (liveMatchesData: IGetLiveMatch[]): Promise<IGetLiveMatch[]> => {

  const liveMatchesDataWithLogo = await Promise.all(
    liveMatchesData.map(async (liveMatch: IGetLiveMatch) => {
      const queryParamsHomeTeam = new URLSearchParams({
        teamid: liveMatch.homeTeam.id.toString()
      });
      const jsonDataHomeTeam = await CallFootballLiveApiGetAction('football-team-logo', queryParamsHomeTeam);
      const homeTeamLogo: string = jsonDataHomeTeam.response.url;

      const queryParamsAwayTeam = new URLSearchParams({
        teamid: liveMatch.awayTeam.id.toString()

      });
      const jsonDataAwayTeam = await CallFootballLiveApiGetAction('football-team-logo', queryParamsAwayTeam);
      const awayTeamLogo: string = jsonDataAwayTeam.response.url;

      liveMatch.homeTeam.logo = homeTeamLogo;
      liveMatch.awayTeam.logo = awayTeamLogo;
      return liveMatch;
    }
    ));

    return liveMatchesDataWithLogo;

}

 // Receiving the logos of the teams playing will be done separately
 export const GetLeaguesLogo = async (leagues: IGetTopLeagues[]): Promise<IGetTopLeagues[]> => {

  const leaguesWithLogo = await Promise.all(
    leagues.map(async (league: IGetTopLeagues) => {
      const queryParamsHomeTeam = new URLSearchParams({
        leagueid: league.id.toString()
      });
      const jsonDataLeague = await CallFootballFreeApiGetAction('football-league-logo', queryParamsHomeTeam);
      const leagueLogo: string = jsonDataLeague.response.url;

      league.logo = leagueLogo;
      return league;
    }
    ));
    return leaguesWithLogo;

}


 // Receiving the logos of the teams playing will be done separately
 export const GetTeamsLogo = async (teams: ITeamDetails[]): Promise<ITeamDetails[]> => {

  const teamsWithLogo = await Promise.all(
    teams.map(async (team: ITeamDetails) => {
      const queryParamsHomeTeam = new URLSearchParams({
        teamid: team.id.toString()
      });
      const jsonDataTeam = await CallFootballFreeApiGetAction('football-team-logo', queryParamsHomeTeam);
      const TeamLogo: string = jsonDataTeam.response.url;

      team.logo = TeamLogo;
      return team;
    }
    ));
    return teamsWithLogo;

}

 // Receiving the logos of the teams playing will be done separately
 export const GetPlayersLogo = async (players: IGetTopPlayers[]): Promise<IGetTopPlayers[]> => {

  const playersWithLogo = await Promise.all(
    players.map(async (player: IGetTopPlayers) => {
      const queryParamsHomeTeam = new URLSearchParams({
        playerid: player.player.id.toString()
      });
      const jsonDataPlayer = await CallFootballFreeApiGetAction('football-player-image', queryParamsHomeTeam);
      const playerLogo: string = jsonDataPlayer.response.url;

      player.logo = playerLogo;
      return player;
    }
    ));
    return playersWithLogo;

}



// Displaying an details about the data being loaded / received / failed

export const ShowKindLoadData = (kind: kindsLoadData): JSX.Element => {
  if (kind === "Wait") {
    return (
      <Container className="text-center mainKindLoadData">
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <p className='mainKindLoadDataTitle'>A few more moments and a goal is scored ⌛️ </p>
            <Image className='mainKindLoadDataImg' src={waitImg} alt="waitImg" rounded />
          </Col>
        </Row>
      </Container>
    )
  }
  else if (kind === "Error") {
    return (
      <Container className="text-center mainKindLoadData">
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <p className='mainKindLoadDataTitle'>Error, what a miss in the 90th minute... 🙈</p>
            <Image className='mainKindLoadDataImg' src={errorLoadImg} alt="errorLoadImg" rounded />
          </Col>
        </Row>
      </Container>
    )
  }

  else {
    return (
      <Container className="text-center mainKindLoadData">
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <p className='mainKindLoadDataTitle'>Wow, Barcelona is the coolest and most exciting team there is ! 🥁</p>
            <Image className='mainKindLoadDataImg' src={waitImg} alt="waitImg" rounded />
          </Col>
        </Row>
      </Container>
    )
  }

}

// Displaying an pop informational message for the user

export const ShowPop = (popHeader: string, popBody: JSX.Element, title: string): JSX.Element => {

  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement='bottom-start'
      overlay={
        <Popover id="popover-countries">
          <Popover.Header as="h3">{popHeader}</Popover.Header>
          <Popover.Body>
            {popBody}
          </Popover.Body>
        </Popover>
      }
    >
      <h2 className='selectTitle'>{title}</h2>
    </OverlayTrigger>
  )
}

// Displaying an dialog window for the user

export const ShowWarningDialog = (title: string, desc: JSX.Element, dialogAction: dialogActions, dialogButtons: kindButtons): JSX.Element => {

  return (
    <div className="dialogCustom">
      <div className="warningDialog">
        <h3 className="titleDialog">{title}</h3>
        <p className="descDialog">{desc} </p>
        {
          dialogButtons === "YesNo" && (
            <>
              <button className="btnDialog" onClick={() => dialogAction("yes")}>Yes</button>
              <button className="btnDialog" onClick={() => dialogAction("no")}>No</button>
            </>
          )
        }
        {
          dialogButtons === "Ok" && (
            <>
              <button className="btnDialog" onClick={() => dialogAction()}>Ok</button>
            </>
          )
        }

        <Container className="text-center">
          <Image src={errorImg} alt="errorImg" style={{ width: '8vw', height: '12vh' }} rounded />
        </Container>
      </div>
    </div>
  )
}

// #endregion


const HelperFun = () => {
  // eslint-disable-next-line no-unused-vars

}

export default HelperFun
