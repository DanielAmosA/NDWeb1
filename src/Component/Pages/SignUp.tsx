import React, { ReactElement, useState } from 'react'
import CountrySelect from '../PageSections/SignInPage/CountrySelect';
import LeagueSelect from '../PageSections/SignInPage/LeagueSelect'
import SeasonSelect from '../PageSections/SignInPage/SeasonSelect';
import TeamSelect from '../PageSections/SignInPage/TeamSelect';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { kindsSignInPage } from '../Helper/HelperFun';
import UserDetails from '../PageSections/SignInPage/UserDetails';
import { IOption } from '../Interfaces/Basic/IOption';
import { ILeaguesWithSeasonsCheckBoxData } from '../Interfaces/Sections/ILeaguesWithSeasonsCheckBoxData';
import { ILeaguesWithSeasonsValue } from '../Interfaces/Sections/ILeaguesWithSeasonsValue';
import { ILeaguesWithSeasonsWithTeamValue } from '../Interfaces/Sections/ILeaguesWithSeasonsWithTeamValue';
import '../../Styles/Main/SignUp.css';

const SignUp = () : ReactElement => {


  //#region Hook and Members

    const [kindSignInPage, setKindSignInPage] = useState<kindsSignInPage>("Main");
    const [showToggleSignInPage, setShowToggleSignInPage] = useState<boolean>(false);
    
    // const [userDetails, setUserDetails] = useState({userName:"", email: "", password: ""});
    
    const [selectedCountries, setSelectedCountries] = useState<boolean>(false);
    const [countriesValues, setCountriesValues] = useState<IOption[]>([]);

    const [selectedLeagues, setSelectedLeagues] = useState<boolean>(false);
    const [leaguesValues, setLeaguesValues] = useState<IOption[]>([]);
    const [leaguesValuesDataPrev, setLeaguesValuesDataPrev] = useState<IOption[]>([]);

    const [selectedSeasons, setSelectedSeasons] = useState<boolean>(false);
    const [leaguesWithSeasonsValues, setLeaguesWithSeasonsValues] = useState<ILeaguesWithSeasonsValue[]>([]);
    const [leaguesWithSeasonsCheckBoxData, setLeaguesWithSeasonsCheckBoxData] = useState<ILeaguesWithSeasonsCheckBoxData[]>([]);


    //#endregion

    //#region Methods

    //#region  Select Action

  // Updating the selected countries 
    // And checking if at least one country has been selected.

    const UpdateSelectedCountries = (newCountriesValues : IOption[]) : void => {
        if (newCountriesValues.length === 0 && selectedCountries) {
            setSelectedCountries(false);
        }
        setCountriesValues(newCountriesValues);
    }


    // Updating that countries have been selected in order to 
    // Begin searching for leagues within them.

    const FindLeaguesByCountriesIDs = ()  : void => {
        setSelectedCountries(true);
    }

    // Updating the selected Leagues 
    // And checking if at least one League has been selected.

    const UpdateSelectedLeagues = (newLeaguesValues : IOption[]) : void => {
        if (newLeaguesValues.length === 0 && selectedLeagues) {
            setSelectedLeagues(false);
            setShowToggleSignInPage(false);
        }
        setLeaguesValues(newLeaguesValues);
    }

    // Updating that leagues have been selected, 
    // Displaying a button for the next step, 
    // And saving their IDs to retrieve them when navigating back.

    const FindSeasonsByLeaguesIDs = () : void => {
        setSelectedLeagues(true);
        if(!showToggleSignInPage)
        {
            setShowToggleSignInPage(true);
        }
        setLeaguesValuesDataPrev(leaguesValues);
        setKindSignInPage("SeasonWithTeam");
    }

    // Creating and updating the list of seasons 
    // Based on the selected league IDs.

    const GetGroupSeasonsByLeague = (leaguesWithSeasonsValues : ILeaguesWithSeasonsCheckBoxData[]) : ILeaguesWithSeasonsValue[] => {
      
        var resGroup : ILeaguesWithSeasonsValue[] = [];
        leaguesWithSeasonsValues.forEach(item => {

          const existingLeagueFromGroup = resGroup.find(league => league.leagueID === item.leagueID);
      
          if (existingLeagueFromGroup) {
            existingLeagueFromGroup.seasonsDetails.push({seasonID : item.seasonID, seasonName : item.seasonName});
          } else {
            resGroup.push({
              leagueID: item.leagueID,
              leagueName : item.leagueName,
              seasonsDetails: [{seasonID : item.seasonID,seasonName : item.seasonName}]
            });
          }
        });
        return resGroup;
      };

    // Updating the league IDs and their seasons in order 
    // To begin the team search.
    
      const FindTeamsByLeaguesAndSeasonsIDs = (newLeaguesWithSeasonsValues : ILeaguesWithSeasonsCheckBoxData[]) : void => {
        setLeaguesWithSeasonsValues(GetGroupSeasonsByLeague(newLeaguesWithSeasonsValues));
        setLeaguesWithSeasonsCheckBoxData(newLeaguesWithSeasonsValues)
        console.log(newLeaguesWithSeasonsValues); 
        setSelectedSeasons(true);
    }


    //#endregion

    //#region Sign In Action

     // Get the new user details 
    // And continue to display the selection of countries

    const SaveUserDetails = (userName : string, email : string , password : string) : void => {
        setKindSignInPage("CountryWithLeague");
    }

     // After completing the user details registration and their selections
    // We will proceed to save the user to the website.

    const FinishSignIn = (teams : ILeaguesWithSeasonsWithTeamValue[]) : void=>
    {
        console.log(teams);
        console.log(leaguesValues);
        
    }

    //#endregion

    //#region  Main Action

     // Displaying the current sign in step, 
    // such as main details or selecting a country and league.
    // According to kindSignInPage 
    const renderSignInPage = ()  : ReactElement | null =>  {
        switch (kindSignInPage) {

            case "Main" : 
            return (
                <> <UserDetails OnValidDetails={SaveUserDetails}/>
                    <br/>
                </>
               
            )

            case "CountryWithLeague":
                return (
                        <Container className='countryAndLeagueSelect'>
                         <Row className="justify-content-md-center"> 
                         <Col xs={7} md={7}>
                            <CountrySelect countriesSelectedPrev = {countriesValues} OnFindLeaguesButtonClick={FindLeaguesByCountriesIDs} HandleUpdateSelectedCountries={UpdateSelectedCountries} />
                        </Col>
                        </Row>
                        {
                            selectedCountries 
                                ? ( <Row className="justify-content-md-center"> 
                                     <Col xs={7} md={7}>
                                     <LeagueSelect leaguesSelectedPrev = {leaguesValuesDataPrev} countriesValues={countriesValues} OnFindSeasonsButtonClick={FindSeasonsByLeaguesIDs} HandleUpdateSelectedLeagues={UpdateSelectedLeagues}/>
                                     {/* <LeagueSelect/> */}
                                     </Col>
                                     </Row>
                                )
                                : null
                        }
                       </Container>
                );

            case "SeasonWithTeam":
                return (
                        <Container fluid className='seasonAndTeamSelect'>
                        <Row> 
                        <Col>
                        <SeasonSelect  leaguesWithSeasonsValuesPrev = {leaguesWithSeasonsCheckBoxData}  leaguesValues={leaguesValues} OnSeasonSelectButtonClick = {FindTeamsByLeaguesAndSeasonsIDs} />
                        </Col>
                       

                        {

                            selectedSeasons 
                            ? (
                                    <Col>
                                    <TeamSelect leaguesWithSeasons = {leaguesWithSeasonsValues} OnFinishSignIn = {FinishSignIn}  />
                                    </Col>
                                    
                            )
                            : null
                        }
                         
                        </Row>
                        </Container>
                )

            default:
                return null;
                
        }
    }

    // Switching between selection elements 
    // And updating the necessary variables in order 
    // To retain information between transitions.
    const toggleSignInPage = () : void => {
        setKindSignInPage((prevKindSignInPage : kindsSignInPage) => prevKindSignInPage === "CountryWithLeague" ? "SeasonWithTeam" : "CountryWithLeague");

        if(kindSignInPage === "SeasonWithTeam")
            {
                if(leaguesWithSeasonsValues.length > 0)
                    {
                        setSelectedSeasons(false);
                    }             
            }

        else if(kindSignInPage === "CountryWithLeague")
        {
            setLeaguesValuesDataPrev(leaguesValues);
        }
        
    }

    //#endregion

   

    //#endregion



    return (
        <div>
            <br />
            {renderSignInPage()}
            
            {
                showToggleSignInPage
                    ? (
                    <Container className='controlPanel'>
                         <Row className="justify-content-md-center"> 
                        <Col xs={7} md={7}>
                        <Button className="w-100 mt-3" onClick={toggleSignInPage} style={{marginBottom:'0.5vh'}}>{kindSignInPage === "CountryWithLeague" ? "Next" : "Back"}</Button>
                        </Col>
                        </Row>
                    </Container>
                        )
                    
                    : null
            }

        </div>
    )
}

export default SignUp
