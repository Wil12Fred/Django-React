import React, { Component } from "react";
import PropTypes from "prop-types";

import {backendUrl} from "../actions/backendUrl"

let url = process.env.REACT_APP_DEV_URL || backendUrl;

class DataProvider extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired
  };
  state = {
      data: [],
      loaded: false,
      placeholder: "Loading...",
    };
  componentDidMount() {
          const newUrl = url+this.props.endpoint
	  fetch(`${newUrl}`)
	  .then(response => {
		  if (response.status !== 200) {
			  return this.setState({ placeholder: "Something went wrong" });
		  }
		  return response.json();
	  })
	  .then(data => this.setState( {data: data, loaded: true}));
  }
  render() {
    const { data, loaded, placeholder } = this.state;
    return loaded ? this.props.render(data) : <p>{placeholder}</p>;
  }
}
export default DataProvider;
