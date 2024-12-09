import React, { useEffect, useState } from 'react'
import Select, { MultiValue } from 'react-select';
import { Button } from 'react-bootstrap';
import { CallFootballLiveApiGetAction, kindsLoadData, ShowKindLoadData, ShowPop, ShowWarningDialog } from '../../Helper/HelperFun';
import { IOption } from '../../Interfaces/Basic/IOption';
import { IGetBasicRes } from '../../Interfaces/ApiRes/IGetBasicRes';


const LeagueSelect = (
    {
        leaguesSelectedPrev,
        countriesValues,
        OnFindSeasonsButtonClick,
        HandleUpdateSelectedLeagues
    }
        : {
            leaguesSelectedPrev: IOption[],
            countriesValues: IOption[],
            OnFindSeasonsButtonClick: () => void,
            HandleUpdateSelectedLeagues: (newLeaguesValues: IOption[]) => void
        }) => {


    //#region Hook & Members

    const [kindLoadData, setKindLoadData] = useState<kindsLoadData>("Wait");

    const [showWarning, setShowWarning] = useState<boolean>(false);

    const [leaguesNames, setLeaguesNames] = useState<IOption[]>([]);
    const [leaguesSelected, setLeaguesSelected] = useState<IOption[]>([]);
    const [leaguesValuesSelect, setLeaguesValuesSelect] = useState<IOption[]>([]);
    const maxSelection = 30;

    //#endregion

    //#region Methods

    //#endregion

    // In the case where we update the list of selected leagues, 
    // We will check if any were added or removed, 
    // And also verify if we have reached the maximum selection limit, 
    // Then act accordingly.

    const HandleChangeLeaguesSelect = (leaguesSelects: MultiValue<IOption>) => {
        // Check If the change was remove

        var newLeaguesValuesSelect: IOption[];
        if (leaguesValuesSelect.length > leaguesSelects.length) {
            newLeaguesValuesSelect = leaguesValuesSelect.filter(leaguesValue => leaguesSelects.some(leagueSelect => leagueSelect.value === leaguesValue.value));
            setLeaguesValuesSelect(newLeaguesValuesSelect);
            setLeaguesSelected(Array.from(leaguesSelects));
            HandleUpdateSelectedLeagues(newLeaguesValuesSelect);
        }
        else {
            if (!leaguesSelects || leaguesSelects.length <= maxSelection) {
                const newLeagueSelect = leaguesSelects.at(-1);

                // Ensure that newLeagueSelect exists before adding it to the array.
                if (newLeagueSelect) {
                    newLeaguesValuesSelect = [...leaguesValuesSelect, newLeagueSelect];
                    setLeaguesValuesSelect(newLeaguesValuesSelect)
                    setLeaguesSelected(Array.from(leaguesSelects));
                    HandleUpdateSelectedLeagues(newLeaguesValuesSelect)
                }

            } else {
                setShowWarning(true);
            }

        }
    }

    // Receiving data about the button the user clicked 
    // In a dialog and handling accordingly.

    const GetUserChoice = (): void => {
        setShowWarning(false);
    }

    // Calling for initialization.
    useEffect(() => {

        // Get all leagues details by countryID using an Football API service.
        const GetLeaguesByCountryID = async (countryID: number): Promise<IGetBasicRes[] | null> => {
            try {

                const queryParams = new URLSearchParams({
                    countryid: countryID.toString(),
                });

                const jsonData = await CallFootballLiveApiGetAction('football-categories-unique-tournaments', queryParams);
                const groupsData = jsonData.response.groups[0];
                const leaguesData = groupsData.uniqueTournaments;
                return leaguesData;

            }

            catch (err) {
                console.log(err, "error");
                setKindLoadData("Error");
                return null;
            }
        }

        // Creating an array of leagues names with IDs 
        // Sorted alphabetically.

        // In the case where the user has previously selected countries, 
        // We will update the country selection list.

        const CreateLeaguesNames = async (): Promise<void> => {
            try {

                // Waiting for all async operations to finish
                const leaguesOptionsAll = await Promise.all(
                    countriesValues.map(async (country: IOption) => {
                        const leagues = await GetLeaguesByCountryID(country.value);

                        if (leagues) {
                            let newLeagueOptions: IGetBasicRes[] = leagues.map(League => ({
                                name: League.name,
                                id: League.id,
                            }))
                            return newLeagueOptions;
                        }

                    })
                );

                if (leaguesOptionsAll.length === 0) {
                    setKindLoadData("Error");
                }

                else {
                    // leaguesOptionsAll is array of arrays and we want to one array
                    const options = leaguesOptionsAll.flat();
                    var newLeaguesNames: IOption[] = [];
                    options
                        .filter((league): league is IGetBasicRes => league !== undefined)
                        .sort((a: IGetBasicRes, b: IGetBasicRes) => a.name.localeCompare(b.name));


                    options.forEach((league: IGetBasicRes | undefined) => {
                        if (league) {
                            const newLeague = { value: league.id, label: league.name };
                            newLeaguesNames.push(newLeague);
                        }
                    });
                    setLeaguesNames(newLeaguesNames);
                    if (leaguesSelectedPrev.length > 0) {
                        setLeaguesSelected(leaguesSelectedPrev)
                        setLeaguesValuesSelect(leaguesSelectedPrev);

                    }

                }


            }
            catch (err) {
                console.log(err, "error");
                setKindLoadData("Error");
            }
        };


        CreateLeaguesNames()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countriesValues]);

    return (
        <div className='selectElem'>

            {
                leaguesNames.length > 0 ?
                    <div>
                        {ShowPop("Leagues", <>
                            Here you need to choose <strong>which leagues</strong> you want to display 🎖
                        </>, "Select League")}

                        <Select
                            isMulti
                            name="leagues"
                            options={leaguesNames}
                            className="basic-multi-select selectCustom"
                            classNamePrefix="select"
                            value={leaguesSelected}
                            onChange={(leaguesSelects) => HandleChangeLeaguesSelect(leaguesSelects)}
                        />

                        {

                            // We will check if we have selected leagues
                            // And if there are any new leagues that have been selected 
                            // Or if everything is from the previous time we selected

                            leaguesValuesSelect.length > 0
                                ? leaguesSelectedPrev.length > 0
                                    ? !leaguesValuesSelect.every((value, index) => value === leaguesSelectedPrev[index])
                                        ? <Button variant='info' className="w-50 mt-4 selectBtn" onClick={() => OnFindSeasonsButtonClick()}>Select seasons</Button>
                                        : null
                                    : <Button variant='info' className="w-50 mt-4 selectBtn" onClick={() => OnFindSeasonsButtonClick()}>Select seasons</Button>
                                : null
                        }
                    </div>
                    :
                    ShowKindLoadData(kindLoadData)
            }

            {
                showWarning &&
                (
                    ShowWarningDialog("Sign In Warning 📛",
                        <>You can only select up to {maxSelection} leagues.</>,
                        GetUserChoice,
                        "Ok"
                    )
                )
            }

        </div>
    )
}

export default LeagueSelect
