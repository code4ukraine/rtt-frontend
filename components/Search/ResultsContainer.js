import { React } from "react";
import Result from "./Result";
import { resultsContainer } from "./styles";

const MAX_RESULTS = 5;

const ResultsContainer = ({
  results,
  setCurrentCityObj,
  setMapCenter,
  setIsOpen,
  setSearchText
}) => {
  const cities = results.slice(0, MAX_RESULTS);

  return (
    <ul style={resultsContainer}>
      {cities &&
        cities.map((cityObj, index) => (
          <Result
            key={index}
            cityObj={cityObj}
            setCurrentCityObj={setCurrentCityObj}
            setMapCenter={setMapCenter}
            setIsOpen={setIsOpen}
            setSearchText={setSearchText}
          />
        ))}
    </ul>
  );
};

ResultsContainer.defaultProps = {
  results: [],
  setCurrentCityObj: () => { },
  setMapCenter: () => { },
  setSearchText: () => { },
  setIsOpen: () => { },
  trackSearchSelect: () => { }
};

export default ResultsContainer;
