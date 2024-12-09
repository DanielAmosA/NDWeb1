import React, { useEffect, useState } from 'react'
import TeamModel from './TeamModel';
import { ShowPop, ShowWarningDialog } from '../../Helper/HelperFun';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ITeamModel } from '../../Interfaces/Sections/ITeamModel';
import { ILeaguesWithSeasonsWithTeamValue } from '../../Interfaces/Sections/ILeaguesWithSeasonsWithTeamValue';
import { ILeaguesWithSeasonsValue } from '../../Interfaces/Sections/ILeaguesWithSeasonsValue';
import { IOption } from '../../Interfaces/Basic/IOption';


const TeamSelect = (
    {
        leaguesWithSeasons,
        OnFinishSignIn
    }:
        {
            leaguesWithSeasons: ILeaguesWithSeasonsValue[],
            OnFinishSignIn: (teams: ILeaguesWithSeasonsWithTeamValue[]) => void
        }
) => {

    //#region Hook & Members

    const [totalFromSeasonsNeedChoose, setTotalFromSeasonsNeedChoose] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalData, setModalData] = useState<ITeamModel>({ leagueID: 0, seasonID: 0, teamsSelectedPrev: [] });
    const [canFinishSignIN, setCanFinishSignIN] = useState<boolean>(false);

    const [showWarning, setShowWarning] = useState<boolean>(false);

    const [teams, setTeams] = useState<ILeaguesWithSeasonsWithTeamValue[]>([]);
    const [maxSeasonsDetailsLength, setMaxSeasonsDetailsLength] = useState<number>(0);

    //#endregion

    //#region Method

    //#endregion

    // Open modal with specific data
    const OpenModal = (leagueID: number, seasonID: number): void => {
        const selectPrev = teams.filter((team: ILeaguesWithSeasonsWithTeamValue) => team.leagueID === leagueID && team.seasonID === seasonID)

        // Checking if several teams have already been selected for this league and season, if so, it will display them

        if (selectPrev && selectPrev.length > 0) {
            setModalData({ leagueID, seasonID, teamsSelectedPrev: selectPrev[0].teamsSelected });
        }
        else {
            setModalData({ leagueID, seasonID, teamsSelectedPrev: [] });
        }

        // Show the modal
        setIsModalOpen(true);
    };

    // Upon closing, the selected teams will be saved

    const CloseModal = (selectedTeamsNow: IOption[]): void => {
        // Remove some teams
        if (selectedTeamsNow.length < modalData.teamsSelectedPrev.length) {
            if (selectedTeamsNow.length === 0) {
                const updateTeams = teams.filter(team =>
                    team.leagueID !== modalData.leagueID || team.seasonID !== modalData.seasonID)

                setTeams(updateTeams);
                if (updateTeams.length === 0 && canFinishSignIN) {
                    setCanFinishSignIN(false);
                }
                console.log(updateTeams);
            }
            else {
                setTeams(prevTeams =>
                    prevTeams.map(team =>
                        team.leagueID === modalData.leagueID && team.seasonID === modalData.seasonID
                            ? { ...team, selectedTeams: selectedTeamsNow } : team // Update only the matching
                    ))
            }

        }

        setIsModalOpen(false);
    };

    // Adding new teams or updating the list of selected teams
    const AddNewTeams = (newLeagueID: number, newSeasonID: number, newTeamsSelected: IOption[]): void => {
        setIsModalOpen(false);

        if (teams.some(team => team.leagueID === newLeagueID && team.seasonID === newSeasonID)) {
            setTeams(prevTeams =>
                prevTeams.map(team =>
                    team.leagueID === newLeagueID && team.seasonID === newSeasonID
                        ? { ...team, teamsSelected: newTeamsSelected } : team // Update only the matching
                ))
        }
        else {
            const newTeam = { leagueID: newLeagueID, seasonID: newSeasonID, teamsSelected: newTeamsSelected }
            const updateTeams = [...teams, newTeam];
            setTeams(updateTeams);

            if (updateTeams.length >= 1 && !canFinishSignIN) {
                setCanFinishSignIN(true)
            }

        }


    }

    // Checking if at least one team has been selected for each season and league
    const CheckTotalTeams = (): void => {
        if (teams.length < totalFromSeasonsNeedChoose) {
            OpenWarning();
        }
        else {
            OnFinishSignIn(teams);
        }
    }

    // Displaying a warning window and receiving a choice for action
    const OpenWarning = (): void => {
        setShowWarning(true);
    };

    // Receiving data about the button the user clicked 
    // In a dialog and handling accordingly.

    const GetUserChoice = (choice?: string): void => {
        if (choice === "yes") {
            alert("gjshdfvgjlshdgkjsdz")
            OnFinishSignIn(teams);
        }
        setShowWarning(false);
    };

    // Calling for initialization.
    useEffect(() => {

        // Checking how many teams need to be selected.

        const GetTotalFromSeasonsNeedChoose = (): void => {
            var total = 0;
            console.log(totalFromSeasonsNeedChoose);

            leaguesWithSeasons.forEach(elem => {
                const leaguesSeasonCount = elem.seasonsDetails.length;
                total += leaguesSeasonCount;
            });
            setTotalFromSeasonsNeedChoose(total);
            const maxLength = Math.max(...leaguesWithSeasons.map(league => league.seasonsDetails.length));
            setMaxSeasonsDetailsLength(maxLength);
        }
        GetTotalFromSeasonsNeedChoose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leaguesWithSeasons])



    return (
        <div className='selectElem'>
            {
                ShowPop("League seasons", <>
                    Here you need to  <strong>Click and select</strong> one of the <strong>seasons league </strong>  in the table 🌟
                </>, "Select your season")}
            <table className="leaguesTable">
                <tbody>
                    {leaguesWithSeasons.map((elem, index) => {
                        return (
                            [
                                <tr key={elem.leagueID} className="leagueRow">
                                    <td key={`${elem.leagueID}${index}`} colSpan={maxSeasonsDetailsLength + 1} className="leagueCol">
                                        {elem.leagueName}
                                    </td>
                                </tr>,
                                <tr key={index} className="seasonsRow">
                                    {elem.seasonsDetails.map((seasons) => (
                                        <td key={seasons.seasonID} className="seasonsCol" onClick={() => OpenModal(elem.leagueID, seasons.seasonID)}>
                                            {seasons.seasonName}
                                        </td>
                                    ))}
                                </tr>
                            ]
                        )

                    })}
                </tbody>
            </table>




            {/* Modal Component, passing data as props */}
            <TeamModel
                isOpen={isModalOpen}
                onClose={CloseModal}
                leagueID={modalData.leagueID}
                seasonID={modalData.seasonID}
                teamsSelectedPrev={modalData.teamsSelectedPrev}
                OnAddTeamButtonClick={AddNewTeams}
            />

            {
                canFinishSignIN
                    ? (

                        <Container>
                            <Row className="justify-content-md-center">
                                <Col xs={3} md={3}>
                                    <Button variant='info' className="selectBtn" onClick={() => CheckTotalTeams()}>Add Me</Button>
                                </Col>
                            </Row>
                        </Container>
                    )


                    : null
            }

            {
                showWarning &&
                (
                    ShowWarningDialog("Sign In Warning 📛",
                        <>There are still seasons and leagues from which you haven't selected teams yet.
                            <br />
                            Do you want to continue ?</>,
                        GetUserChoice,
                        "YesNo"
                    )
                )
            }

        </div>
    )

}

export default TeamSelect
