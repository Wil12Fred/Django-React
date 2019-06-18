import React, { Component } from "react";
import PropTypes from "prop-types";
import Yup from "yup"
import { withFormik } from "formik";
import { withStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField"; 
import { styles } from "./auth/customStylesMui";
import ReactDataList from "react-datalist";
//import {connect} from "react-redux";
//import {withRouter} from 'react-router-dom'

import { backendUrl } from "../actions/backendUrl";

let url = process.env.REACT_APP_DEV_URL || backendUrl;

var ReactDataListController ;

class InnerFormBook extends Component{
	getAuthorValue(value){
		return value["first_name"] +
			" " +
			value ["last_name"] +
			": " +
			value["id"];
	};
	onOptionSelected(option){
		var res = option.split(" ");
		this.props.values.author = parseInt(res[res.length-1]);
	};
	isNormalInteger(str) {
		    var n = Math.floor(Number(str));
		    return n !== Infinity && String(n) === str && n >= 0;
	}
	constructor(props){
		super(props);
		var newUrl = url + "/api/author/";
		fetch(`${newUrl}`)
		.then(response => {
			if (response.status !== 200) {
				return this.setState({ placeholder: "Something went wrong"});
			}
			var result = response.json();
			return result;
		}).then( value => {
			value.map(el => {
				this.options.push(this.getAuthorValue(el));
			});
		});
	}
	options = [];
	onChange (evt){
		console.log(evt.target);
		var res = [];
		res = evt.target.value.split(" ");
		if( res.length !== 0){
			if(this.isNormalInteger(res[res.length-1])) {
				this.props.values.author = parseInt(res[res.length-1]);
			}
		}
	};
	render(){
		var getController = function(controller) {
			ReactDataListController=controller;
		};
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
			AUTHOR
			<ReactDataList
				list = "authors"
				options = {this.options}
				onOptionSelected = {this.onOptionSelected.bind(this)}
				label = "Author"
				getController = {getController}
				autoPosition = {false}
				forcePoly = {true}
				onInputChange = {this.onChange.bind(this)}
			/>
			<TextField
				name = "title"
				placeholder = "Title"
				type = "text"
				value = {values.title}
				onChange={handleChange}
				onBlur= {handleBlur}
				error = {errors.first_name && touched.first_name}
				helperText = {errors.first_name && touched.first_name && errors.first_name}
				label = "Title"
				className = {classes.textField}
			/>
			<TextField
				name = "imagen"
				placeholder = "Imagen"
				type = "text"
				value = {values.imagen}
				onChange={handleChange}
				onBlur= {handleBlur}
				error = {errors.imagen && touched.imagen}
				helperText = {errors.imagen && touched.imagen && errors.imagen}
				label = "Imagen"
				className = {classes.textField}
			/>
			<TextField
				name = "edition"
				placeholder = "Edition"
				type = "number"
				value = {values.edition}
				onChange={handleChange}
				onBlur= {handleBlur}
				error = {errors.edition && touched.edition}
				helperText = {errors.edition && touched.edition && errors.edition}
				label = "Edition"
				className = {classes.textField}
			/>
			<TextField
				name = "copies"
				placeholder = "Copies"
				type = "number"
				value = {values.copies}
				onChange={handleChange}
				onBlur= {handleBlur}
				error = {errors.copies && touched.copies}
				helperText = {errors.copies && touched.copies && errors.copies}
				label = "Copies"
				className = {classes.textField}
			/>
			<TextField
				name = "publication_date"
				placeholder = "Publication Date"
				type = "date"
				value = {values.publication_date}
				onChange={handleChange}
				onBlur= {handleBlur}
				error = {errors.publication_date && touched.publication_date}
				helperText = {errors.publication_date && touched.publication_date && errors.publication_date}
				label = "Publication Date"
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
		title : "",
		imagen : "",
		author: 0,
		publication_date: "0-0-0",
		edition: 0,
		copies: 0
	}),
	validationSchema: Yup.object().shape({
		title: Yup.string().required("This field is required"),
		author: Yup.number().positive().integer(),
		imagen: Yup.string(),
		publication_date: Yup.date().default(() => (new Date())),
		edition: Yup.number().integer(),
		copies: Yup.number().integer()
	}),
	handleSubmit: (
		{title, author, imagen, publication_date, edition, copies},
		{props, setSubmitting, setErrors}
	) => {
		var newData = {title, author, imagen, publication_date, edition, copies};
		console.log(newData);
		const conf = {
			method: "POST",
			body: JSON.stringify(newData),
			headers: {
				"Content-Type": "application/json"
				, Authorization: `JWT ${localStorage.getItem("ecom_token")}`
			}
		};
		const newUrl = url + "/api/book/";
		fetch(`${newUrl}`, conf).then(response => {
			console.log(response);
			if(response.status=== 201){
				props.updatePage(
					props.dispatch,
					"/book",
					props.history.push
				);
			}
		});
	},
	displayName: "BookForm"
})(InnerFormBook);

export const BookForm = withStyles(styles)(EnhancedForm);
