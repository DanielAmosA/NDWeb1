import React from 'react'
import { ITournament } from '../Interfaces/Basic/ITournament';
import { ITeamDetails } from '../Interfaces/Basic/ITeamDetails';
import { ITeamScore } from '../Interfaces/Basic/ITeamScore';
import { kindsLiveMatchesStatus } from '../Helper/HelperFun';
import { format } from 'date-fns';
import '../../Styles/PagesSections/LiveMatches.css';

const LiveMatch = (
    
    {
        tournament ,
        status,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        startTimestamp,
        index
      }:
        {
        tournament : ITournament,
            status : {
                type : kindsLiveMatchesStatus;
            },
            homeTeam : ITeamDetails,
            awayTeam : ITeamDetails,
            homeScore : ITeamScore ,
            awayScore : ITeamScore,
            startTimestamp : number,
            index : number
        }
    ) => {
    
    // Checking game status and setting styling accordingly
    const GetMatchStatusClass = (status : kindsLiveMatchesStatus) => {
      if (status === 'finished') return 'matchFinished';
      if (status === 'inprogress') return 'matchLive';
      if (status === 'upcoming' || status === 'notstarted') return 'matchUpcoming';
      return '';
    };
  
    // Checking if there are any goals and, if so, in which half
    const GetGoalsText = (period1 : number, period2 : number) => {
      const period1Text = period1 ? `Half-time: ${period1} goals` : '';
      const period2Text = period2 ? `Full-time: ${period2} goals` : '';
      return (
        <>
          {period1Text && <p>{period1Text}</p>}
          {period2Text && <p>{period2Text}</p>}
        </>
      );
    };
  
    return (
      <div className={`matchResult ${GetMatchStatusClass(status.type)}`} key={index}>
        <div className="team teamHome">
          <img src={homeTeam.logo} alt={homeTeam.name} className="teamLogo" />
          <span className="teamName">{homeTeam.name} {homeTeam.nameCode}</span>
          <div className="teamHalfTime">
            {GetGoalsText(homeScore.period1, homeScore.period2)}
          </div>
        </div>
        
        <div className="matchInfo">
        <div className="centeredMatchInfo">
          <span className="leagueName">{tournament.name} {tournament.uniqueTournament.name} {tournament.category.name}</span>
          {status.type === 'upcoming' ? (
            <span className="matchTime">Soon ... 🥏</span>
          ) : (
            <span className="mathScore">
              {homeScore.current} - {awayScore.current}
              <span className="matchTime">{format(new Date(startTimestamp), "dd/MM/yyyy HH:mm")}</span>
            </span>
          )}
        </div>
        </div>
        
        <div className="team teamAway">
          <img src={awayTeam.logo} alt={awayTeam.name} className="teamLogo" />
          <span className="teamName">{awayTeam.name}{homeTeam.nameCode}</span>
          <div className="teamHalfTime">
            {GetGoalsText(awayScore.period1, awayScore.period2)}
          </div>
        </div>
      </div>
    );
  };

export default LiveMatch
