import { useAuth } from "../../AuthContext";
import React, { useEffect, useState } from "react";
import PriceDisplay from "../priceDisplay/priceDisplay";
import ChargingStatus from "../chargingStatus/chargingStatus";
import { IoLogoGoogle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataSuccess,
  setEletricData,
  toggleCharging,
  setInputValue,
  setPriceIwant,
} from "../../redux/actions";
const MainPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [actualPrice, setActualPrice] = useState("");
  const [nextHourPrice, setNextHourPrice] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalCost, setTotalCost] = useState("N/A");
  const [fetchError, setFetchError] = useState(null);
  const [chargingError, setChargingError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { chargingData, electricData, isCharging, inputValue, priceIwant } =
    useSelector((state) => state.charging);
  console.log(priceIwant);

  useEffect(() => {
    const fetchChargingData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${process.env.REACT_APP_URL_TO_SERVER}/charging/data`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        dispatch(fetchDataSuccess(result)); // Ulož data do Reduxu
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchChargingData();
  }, [dispatch]);

  const calculateTotalCost = () => {
    if (startTime && endTime) {
      const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
      const totalCost = durationInHours * pricePerKWh;
      return totalCost.toFixed(2) * 25;
    }
    return "N/A";
  };
  const calculateCurrentCycleCost = () => {
    console.log(chargingData.data.session?.energy_consumed);

    if (startTime && endTime) {
      const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
      const currentCycleCost =
        durationInHours *
        pricePerKWh *
        100 *
        parseFloat(chargingData.data.session?.energy_consumed);

      return currentCycleCost.toFixed(2);
    }
    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_TO_SERVER}/api/scrape`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        dispatch(setEletricData(result));
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours() + 1;
    const filterByHour = electricData?.filter(
      (entry) => Number(entry.hour) === currentHour
    );
    const filterByNextHour = electricData?.filter(
      (entry) => Number(entry.hour) === currentHour + 1
    );

    if (filterByHour.length > 0) {
      setActualPrice(filterByHour[0].price);
    }
    if (filterByNextHour.length > 0) {
      setNextHourPrice(filterByNextHour[0].price);
    }
  }, [electricData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (startTime) {
        setTotalCost(calculateTotalCost());
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isCharging, startTime, endTime]);

  const toggleChargingApi = async () => {
    const newStatus =
      chargingData?.data.status === "Charging" ? "notCharging" : "Charging";
    const cost = calculateCurrentCycleCost();

    const response = await fetch(
      `${process.env.REACT_APP_URL_TO_SERVER}/charging/data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ status: newStatus, cost }),
      }
    );
    console.log(response);

    if (response.ok) {
      const result = await response.json();
      fetchDataSuccess((prevState) => ({
        ...prevState,
        data: { ...prevState.data, ...result.data },
      }));
    }
  };

  const buyOnClick = () => {
    dispatch(toggleCharging(true));
    dispatch(setPriceIwant(inputValue));
    dispatch(setInputValue(inputValue));
    setStartTime(new Date());
    toggleChargingApi();
  };

  const dontBuyOnClick = () => {
    dispatch(toggleCharging(false));
    dispatch(setInputValue(0));
    dispatch(setPriceIwant(""));
    toggleChargingApi();
    setEndTime(new Date());
  };
  const handleInputChange = (value) => {
    dispatch(setInputValue(value));
  };

  const actualPriceString = String(actualPrice).replace(",", ".");
  const pricePerKWh = (actualPriceString / 1000) * 25;
  const nextPriceString = String(nextHourPrice).replace(",", ".");
  const nextPricePerKWh = (nextPriceString / 1000) * 25;
  const isPlugged = chargingData?.data?.connector_status === "Occupied";

  return (
    <div className="all-content">
      <PriceDisplay
        loading={electricData.length === 0}
        pricePerKWh={pricePerKWh}
        actualPrice={actualPrice}
        inputValue={inputValue}
        onInputChange={(value) => handleInputChange(value)}
        onBuyClick={buyOnClick}
        buying={isCharging}
        onStopClick={dontBuyOnClick}
        priceIwant={priceIwant}
        chargingData={chargingData}
        isPlugged={isPlugged}
      />
      <ChargingStatus
        totalCost={totalCost}
        pricePerKWh={pricePerKWh}
        startTime={startTime}
        endTime={endTime}
        buying={isCharging}
        priceIwant={priceIwant}
        nextHourPrice={nextPricePerKWh.toFixed(2)}
        chargingData={chargingData}
        isPlugged={isPlugged}
      />
    </div>
  );
};

export default MainPage;
