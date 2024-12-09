import React, { useEffect, useState } from 'react'
import Select, { MultiValue } from 'react-select';
import { CallFootballLiveApiGetAction, kindsLoadData, ShowKindLoadData, ShowPop } from '../../Helper/HelperFun';
import { Button } from 'react-bootstrap';
import { IOption } from '../../Interfaces/Basic/IOption';
import { ITeamsValueRes } from '../../Interfaces/ApiRes/Select/ITeamsValueRes';



const TeamModel = (
    {
        leagueID,
        seasonID,
        teamsSelectedPrev,
        isOpen,
        onClose,
        OnAddTeamButtonClick
    }:
        {
            leagueID: number,
            seasonID: number,
            teamsSelectedPrev: IOption[],
            isOpen: boolean,
            onClose: (selectedTeamsNow: IOption[]) => void,
            OnAddTeamButtonClick: (newLeagueID: number, newSeasonID: number, newTeamsSelected: IOption[]) => void
        }

) => {

    //#region  Hook & Members
    const [teamsNames, setTeamsNames] = useState<IOption[]>([]);
    const [kindLoadData, setKindLoadData] = useState<kindsLoadData>("Wait")
    const [selectedTeams, setSelectedTeams] = useState<IOption[]>([]);
    const [teamsValuesSelect, setTeamsValuesSelect] = useState<number[]>([]);
    const maxSelection = 5;

    // In the case where we update the list of selected teams, 
    // We will check if any were added or removed, 

    // And also verify if we have reached the maximum selection limit, 
    // Then act accordingly.

    const HandleChangeTeamsSelect = (teamsSelects: MultiValue<IOption>): void => {
        // Check If the change was remove
        console.log(teamsSelects);
        console.log(teamsValuesSelect);

        if (teamsValuesSelect.length > teamsSelects.length) {
            setTeamsValuesSelect(teamsValuesSelect.filter((teamValue: number) => teamsSelects.some((teamSelect: IOption) => teamSelect.value === teamValue)));
            setSelectedTeams(Array.from(teamsSelects));
        }
        else {
            if (!teamsSelects || teamsSelects.length <= maxSelection) {
                const newTeamSelect: IOption = teamsSelects[teamsSelects.length - 1];
                setTeamsValuesSelect([...teamsValuesSelect, newTeamSelect.value])
                setSelectedTeams(Array.from(teamsSelects)); // Update the state
            } else {
                alert(`You can only select up to ${maxSelection} teams.`);
            }

        }
    }

    // Calling for initialization.

    useEffect(() => {

        // In case we want the modal closed, we will not display anything
        if (!isOpen) { return }

        // Get teams details by League & season IDs using an Football API service.
        const GetTeams = async (): Promise<ITeamsValueRes[] | null> => {

            try {

                setTeamsNames([]);
                setKindLoadData("Wait");

                const queryParams = new URLSearchParams({
                    leagueid: leagueID.toString(),
                    seasonid: seasonID.toString()
                });

                const jsonData = await CallFootballLiveApiGetAction('football-league-all-teams', queryParams);

                return jsonData.response.teams;

            }
            catch (err) {
                console.log(err, "error");
                setKindLoadData("Error");
                return null;
            }
        }

        // Creating an array of teams names with IDs 
        // Sorted alphabetically.

        // In the case where the user has previously selected teams, 
        // We will update the country selection list.

        const CreateTeamsNames = async (): Promise<void> => {
            try {
                // Remove Before Choose 
                setSelectedTeams([]);
                const options = await GetTeams();
                const newTeamsNames: IOption[] = [];
                console.log(options);
                if (options) {
                    options.sort((a: ITeamsValueRes, b: ITeamsValueRes) => a.team.name.localeCompare(b.team.name))
                    options.forEach((teamsValues: ITeamsValueRes) => {
                        const newTeam = { value: teamsValues.team.id, label: teamsValues.team.name };
                        newTeamsNames.push(newTeam);
                    });

                    setTeamsNames(newTeamsNames);

                    if (teamsSelectedPrev && teamsSelectedPrev.length > 0) {
                        setSelectedTeams(teamsSelectedPrev);
                    }

                }
                else {
                    setKindLoadData("Error");
                }


            }
            catch (err) {
                console.log(err, "error");
                setTeamsNames([]);
                setKindLoadData("Error");
            }
        };
        CreateTeamsNames();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Don't render anything if modal is closed
    if (!isOpen) {
        return null;
    }


    return (

        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={() => onClose(selectedTeams)}>
                    &times;
                </span>
                <div className="selectElem">
                    {
                        teamsNames.length > 0 ?
                            <div>
                                {ShowPop("League Teams", <>
                                    Here you need to choose <strong>which team</strong> you want to display for the <strong>selected league & Season 🕺🏼</strong>
                                </>, "Select Teams")}
                                <Select
                                    isMulti
                                    name="countries"
                                    options={teamsNames}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={selectedTeams}
                                    onChange={(teamsSelects) => HandleChangeTeamsSelect(teamsSelects)}
                                />

                                {
                                    teamsValuesSelect.length > 0
                                        ? <Button variant='info' className="w-50 selectBtn" onClick={() => OnAddTeamButtonClick(leagueID, seasonID, selectedTeams)}>Add Teams</Button>
                                        : null
                                }

                            </div>
                            :
                            ShowKindLoadData(kindLoadData)
                    }
                </div>
            </div>
        </div>
    );
};

export default TeamModel;
