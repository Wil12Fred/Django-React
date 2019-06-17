import React, { Component } from "react";
import PropTypes from "prop-types";
import Yup from "yup"
import { withFormik } from "formik";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { styles } from "./auth/customStylesMui";
//import {connect} from "react-redux";
//import {withRouter} from 'react-router-dom'

import { backendUrl } from "../actions/backendUrl";

let url = process.env.REACT_APP_DEV_URL || backendUrl;

class FormPublisher extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired
  };
  state = {
    name: "",
    address: "",
    website: ""
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { name, address, website } = this.state;
    const publisher = { name, address, website };
    const conf = {
      method: "POST",
      body: JSON.stringify(publisher),
      headers: { "Content-Type": "application/json"
			      , Authorization: `JWT ${localStorage.getItem("ecom_token")}`
      }
    };
    const newUrl = url + this.props.endpoint;
    fetch(`${newUrl}`, conf).then(response => console.log(response));
  };
  render() {
    const { name, address, website } = this.state;
    return (
      <div className="column">
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="name"
                onChange={this.handleChange}
                value={name}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Address</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="address"
                onChange={this.handleChange}
                value={address}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Website</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="website"
                onChange={this.handleChange}
                value={website}
                required
              />
            </div>
          </div>
          <div className="control">
            <button type="submit" className="button is-info">
	       Add Publisher
            </button>
          </div>
        </form>
      </div>
    );
  }
}

class FormAuthor extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired
  };
  state = {
    first_name: "",
    last_name: "",
    email: "",
    valid: false
  };
  handleChange = e => {
    console.log(e.target);
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { first_name, last_name, email, valid } = this.state;
    const author = { first_name, last_name, email };
    const conf = {
      method: "POST",
      body: JSON.stringify(author),
      headers: { "Content-Type": "application/json"
			      , Authorization: `JWT ${localStorage.getItem("ecom_token")}`
      }
    };
    const newUrl = url + this.props.endpoint;
    fetch(`${newUrl}`, conf).then(
	    response => console.log(response)
    );
  };
  render() {
    const { first_name, last_name, email } = this.state;
    return (
      <div className="column">
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label className="label">First Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="first_name"
                onChange={this.handleChange}
                value={first_name}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Last Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="last_name"
                onChange={this.handleChange}
                value={last_name}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="email"
                onChange={this.handleChange}
                value={email}
                required
              />
            </div>
          </div>
          <div className="control">
            <button type="submit" className="button is-info">
	       Add Author
            </button>
          </div>
        </form>
      </div>
    );
  }
}

class FormBook extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired
  };
  state = {
    title: "",
    author: "",
    publication_date: "",
    edition: "",
    image: "",
    copies: ""
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { title, author, publication_date, edition, image, copies } = this.state;
    const book = { title, author, publication_date, edition, image, copies };
    const conf = {
      method: "POST",
      body: JSON.stringify(book),
      headers: { "Content-Type": "application/json"
			      , Authorization: `JWT ${localStorage.getItem("ecom_token")}`
      }
    };
    const newUrl = url + this.props.endpoint;
    fetch(`${newUrl}`, conf).then(response => console.log(response));
  };
  render() {
    const { title, author, publication_date, edition, image, copies } = this.state;
    return (
      <div className="column">
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="title"
                onChange={this.handleChange}
                value={title}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Publication date</label>
            <div className="control">
              <input
                className="input"
                type="date"
                name="publication_date"
                onChange={this.handleChange}
                value={publication_date}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Edition</label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="edition"
                onChange={this.handleChange}
                value={edition}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Image</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="image"
                onChange={this.handleChange}
                value={image}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Copies</label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="copies"
                onChange={this.handleChange}
                value={copies}
                required
              />
            </div>
          </div>
          <div className="control">
            <button type="submit" className="button is-info">
	       Add Author
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export {FormPublisher, FormAuthor, FormBook};
