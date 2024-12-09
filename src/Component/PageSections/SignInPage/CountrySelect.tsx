import React, { useEffect, useState } from 'react'
import Select, { MultiValue } from 'react-select';
import { Button } from 'react-bootstrap';
import { CallFootballLiveApiGetAction, kindsLoadData, ShowKindLoadData, ShowPop, ShowWarningDialog } from '../../Helper/HelperFun';
import { IOption } from '../../Interfaces/Basic/IOption';
import { IGetBasicRes } from '../../Interfaces/ApiRes/IGetBasicRes';


const CountrySelect = (
  {
    countriesSelectedPrev,
    OnFindLeaguesButtonClick,
    HandleUpdateSelectedCountries
  }:
    {
      countriesSelectedPrev: IOption[],
      OnFindLeaguesButtonClick: () => void,
      HandleUpdateSelectedCountries: (newCountriesValues: IOption[]) => void
    }
) => {

  //#region Hook & Members

  const [kindLoadData, setKindLoadData] = useState<kindsLoadData>("Wait");

  const [showWarning, setShowWarning] = useState<boolean>(false);

  const [countriesNames, setCountriesNames] = useState<IOption[]>([]);
  const [countriesSelected, setCountriesSelected] = useState<IOption[]>([]);
  const [countriesValuesSelect, setCountriesValuesSelect] = useState<IOption[]>([]);
  const maxSelection = 3;

  //#endregion

  //#region  Methods

  // In the case where we update the list of selected countries, 
  // We will check if any were added or removed, 
  // And also verify if we have reached the maximum selection limit, 
  // Then act accordingly.

  const HandleChangeCountriesSelect = (countriesSelects: MultiValue<IOption>) => {
    var newCountriesValuesSelect: IOption[];
    // Check If the change was remove
    if (countriesValuesSelect.length > countriesSelects.length) {
      newCountriesValuesSelect = countriesValuesSelect.filter(country => countriesSelects.some(countrySelect => countrySelect.value === country.value))
      setCountriesValuesSelect(newCountriesValuesSelect);
      setCountriesSelected(Array.from(countriesSelects));
      HandleUpdateSelectedCountries(newCountriesValuesSelect);
    }
    else {
      if (!countriesSelects || countriesSelects.length <= maxSelection) {
        const newCountrySelect = countriesSelects.at(-1);

        // Ensure that newCountrySelect exists before adding it to the array.
        if (newCountrySelect) {
          newCountriesValuesSelect = [...countriesValuesSelect, newCountrySelect]
          setCountriesValuesSelect(newCountriesValuesSelect)
          setCountriesSelected(Array.from(countriesSelects));
          HandleUpdateSelectedCountries(newCountriesValuesSelect);
        }

      } else {
        setShowWarning(true);
      }
    }
  }

  // Receiving data about the button the user clicked 
  // In a dialog and handling accordingly.

  const GetUserChoice = () : void=> {
    setShowWarning(false);
  }

  // Calling for initialization.
  useEffect(() => {

    // Get all country details using an Football API service.

    const GetCountries = async (): Promise<IGetBasicRes[] | null> => {
      try {
        const jsonData = await CallFootballLiveApiGetAction('football-all-countries');
        return jsonData.response.countries;
      }
      catch (err) {
        console.log(err, "error");
        setKindLoadData("Error");
        return null;
      }
    }

    // Creating an array of country names with IDs 
    // Sorted alphabetically.

    // In the case where the user has previously selected countries, 
    // We will update the country selection list.

    const CreateCountriesNames = async (): Promise<void> => {
      const options = await GetCountries();

      if (options) {
        const newCountriesNames: IOption[] = [];
        options.sort((a: IGetBasicRes, b: IGetBasicRes) => a.name.localeCompare(b.name))
        options.forEach((country: IGetBasicRes) => {
          const newCountry = { value: country.id, label: country.name };
          newCountriesNames.push(newCountry);
        })
        setCountriesNames(newCountriesNames);

        if (countriesSelectedPrev.length > 0) {
          setCountriesSelected(countriesSelectedPrev);
        }
      }
      else {
        setKindLoadData("Error");
      }
    }
    CreateCountriesNames();
  }, [countriesSelectedPrev]);

  //#endregion

  return (
    <div className='selectElem'>
      {
        countriesNames.length > 0 ?
          <div>
            {ShowPop("League countries", <>
              Here you need to choose from <strong>which countries the leagues</strong> you want to display 🌐
            </>, "Select Country")}
            <Select
              isMulti
              name="countries"
              options={countriesNames}
              className="basic-multi-select selectCustom"
              classNamePrefix="select"
              value={countriesSelected}
              onChange={(countriesSelects) => HandleChangeCountriesSelect(countriesSelects)}
            />

            {
              countriesValuesSelect.length > 0
                ? <Button variant='info' className="w-50 mt-4 selectBtn" onClick={() => OnFindLeaguesButtonClick()}>Find Leagues</Button>
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
            <>You can only select up to {maxSelection} countries.</>,
            GetUserChoice,
            "Ok"
          )
        )
      }

    </div>
  )
}

export default CountrySelect
