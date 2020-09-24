import { GET_PROFILE, PROFILE_ERROR } from "./types";
import axios from "axios";
import { setAlert } from "../actions/alert";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/farmer/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { message: e.response.statusText, status: e.response.status },
    });
  }
};
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/api/farmer", formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert(edit ? "Profile Edited" : "Profile Created", "success"));
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (e) {
    const errors = e.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { message: e.response.statusText, status: e.response.status },
    });
  }
};
