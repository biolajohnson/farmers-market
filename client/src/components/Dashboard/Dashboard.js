import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profile";
import { connect } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { Link } from "react-router-dom";
import { DashboardActions } from "./DashboardActions";
const Dashbaord = ({
  getCurrentProfile,
  auth: { user },
  profile: { loading, profile },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <h1 className="lead text-dark">Welcome {user && user.name}</h1>
      {profile !== null ? (
        <DashboardActions />
      ) : (
        <Fragment>
          <p>You dont have a profile yet. Click this button to create one</p>
          <Link to="/create-profile" className="btn btn-primary m-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};
Dashbaord.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, { getCurrentProfile })(Dashbaord);
