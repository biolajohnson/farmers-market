import React from "react";
import { Link } from "react-router-dom";

export const DashboardActions = () => {
  return (
    <div class="dash-buttons">
      <Link to="/edit-profile" class="btn btn-light">
        Edit Profile
      </Link>
      <Link to="/add-experience" class="btn btn-light">
        Add Experience
      </Link>
      <Link to="/add-education" class="btn btn-light">
        {" "}
        Add Education
      </Link>
    </div>
  );
};
