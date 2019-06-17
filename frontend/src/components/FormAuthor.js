import React, { Component } from "react";
import PropTypes from "prop-types";
import Yup from "yup"
import { withFormik } from "formik";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField"; 
import { styles } from "./auth/customStylesMui";
//import {connect} from "react-redux";
//import {withRouter} from 'react-router-dom'

import { backendUrl } from "../actions/backendUrl";

let url = process.env.REACT_APP_DEV_URL || backendUrl;

class InnerFormAuthor extends Component{
	render(){
		const {
			values,
			touched,
			errors,
			dirty,
			isSubmitting,
			handleChange,
			handleBlur,
			handleSubmit,
			handleReset,
			classes
		} = this.props;
		return (
		<div className={classes.container}>
			<form onSubmit={handleSubmit}>
			<TextField
				name = "first_name"
				placeholder = "First Name"
				type = "text"
				value = {values.first_name}
				onChange={handleChange}
				onBlur= {handleBlur}
				error = {errors.first_name && touched.first_name}
				helperText = {errors.first_name && touched.first_name && errors.first_name}
				label = "First Name"
				className = {classes.textField}
			/>
			<TextField
				name = "last_name"
				placeholder = "Last Name"
				type = "text"
				value = {values.last_name}
				onChange={handleChange}
				onBlur= {handleBlur}
				error = {errors.last_name && touched.last_name}
				helperText = {errors.last_name && touched.last_name && errors.last_name}
				label = "Last Name"
				className = {classes.textField}
			/>
			<TextField
				name = "email"
				placeholder = "Email"
				type = "text"
				value = {values.email}
				onChange={handleChange}
				onBlur= {handleBlur}
				error = {errors.email && touched.email}
				helperText = {errors.email && touched.email && errors.email}
				label = "Email"
				className = {classes.textField}
			/>
			<br />
			<Button
				variant = "raised"
				className = {classes.button}
				type = "submit"
				disable = {isSubmitting}
			>
			Submit
			</Button>
			</form>
		</div>
		);
	}
}

const EnhancedForm = withFormik({
	mapPropsToValues: () => ({
		first_name : "",
		last_name : "",
		email : ""
	}),
	validationSchema: Yup.object().shape({
		first_name: Yup.string().required("This field is required"),
		last_name: Yup.string().required("This field is required"),
		email: Yup.string().email()
	}),
	handleSubmit: (
		{first_name, last_name},
		{props, setSubmitting, setErrors}
	) => {
		props.updatePage(
			props.dispatch,
			"/author",
			props.history.push
		);
	},
	displayName: "AuthorForm"
})(InnerFormAuthor);

export const AuthorForm = withStyles(styles)(EnhancedForm);
