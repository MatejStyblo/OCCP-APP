import {
  FETCH_DATA_START,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  TOGGLE_CHARGING,
  SET_CHARGING_RESULT,
  SET_ELECTRIC_DATA,
  SET_INPUT_VALUE,
  SET_PRICE_I_WANT,
} from "./actions";

const initialState = {
  chargingData: null,
  isLoading: false,
  error: null,
  isCharging: false,
  priceIwant: null,
  inputValue: null,
  totalCost: "N/A",
  startTime: null,
  endTime: null,
  chargingResult: null,
  electricData: [],
};

const chargingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        chargingData: action.payload,
      };
    case TOGGLE_CHARGING:
      return {
        ...state,
        isCharging: action.payload,
      };
    case SET_ELECTRIC_DATA:
      return {
        ...state,
        electricData: action.payload,
      };
    case SET_CHARGING_RESULT:
      return {
        ...state,
        chargingResult: action.payload,
      };
    case SET_INPUT_VALUE:
      return {
        ...state,
        inputValue: action.payload,
      };
    case SET_PRICE_I_WANT:
      return {
        ...state,
        priceIwant: action.payload,
      };
    default:
      return state;
  }
};

export default chargingReducer;
