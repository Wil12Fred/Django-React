import React, {Component} from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { Link } from "react-router-dom";
import ReactDataList from "react-datalist";

import {backendUrl} from "../actions/backendUrl";

let url = process.env.REACT_APP_DEV_URL || backendUrl;

class Table extends Component{
	static propTypes = {
		endpoint: PropTypes.string.isRequired,
		//render: PropTypes.func.isRequired
	};
	state = {
		data: [],
	        loaded: false,
	        placeholder: "Loading...",
		page : 0,
		filterText : "",
		tampage: 5
	};
	constructor(props) {
		super(props);
		this.loadData(this.state.page);
	};
	loadData(page){
		const newUrl = url+this.props.endpoint+"?page="+page;
		console.log(newUrl);
		fetch(`${newUrl}`)
		.then(response => {
			if (response.status !== 200) {
				return this.setState({ placeholder: "Something went wrong" });
			}
			var result = response.json();
			return result;
		})
		.then(data => this.setState( {data: data, loaded: true, page: page})
		);
	};
	handleUserInput(filterText) {
		this.setState({filterText: filterText});
	}
	handleRowDel(el) {
		var index = this.state.data.indexOf(el);
		this.state.data.splice(index, 1);
		this.setState(this.state.data);
	};
	handleRowAdd(evt){
		var newData= {};
		Object.entries(this.state.data[0]).map(
			el => {
				newData[el[0]] = null;
			}
		);
		const conf = {
			method: "POST",
			body: JSON.stringify(newData),
			headers: {
				"Content-Type": "application/json"
				, Authorization: `JWT ${localStorage.getItem("ecom_token")}`
			}
		};
		const newUrl = url + this.props.endpoint + "/";
		fetch(`${newUrl}`, conf).then(response => console.log(response));
		this.loadData();
	};
	handleProductTable = evt =>{
	};
	pageChange(){
		this.loadData(this.refs.PageUpdate.value);
	}
	render() {
		var dir = this.props.endpoint.split("/");
		var nameObject = dir[dir.length-1];
		const {data, loaded, placeholder, filterText, page} = this.state;
		if(!loaded) return (
			<div>
				<SearchBar filterText = {filterText} onUserInput = {this.handleUserInput.bind(this)}/>
				<p>{placeholder}</p>
				<div align = "center">
				Page: <br />
				<input type="number" placeholder = "page" value = {page} ref="PageUpdate" onChange={this.pageChange.bind(this)} />
				</div>
				<Link to = {nameObject+"/register"} className = {classes.links}> Add New Item </Link>
			</div>
		);
		if(data.length ===0 ) return (
			<div>
				<SearchBar filterText = {filterText} onUserInput = {this.handleUserInput.bind(this)}/>
				<p>Empty Table</p>
				<Link to = {nameObject+"/register"} className = {classes.links}> Add New Item </Link>
				<div align = "center">
				Page: <br />
				<input type="number" placeholder = "page" value = {page} ref="PageUpdate" onChange={this.pageChange.bind(this)} />
				</div>
			</div>
		);
		return(
			<div>
				<SearchBar filterText = {filterText} onUserInput = {this.handleUserInput.bind(this)}/>
				<ProductTable
					data={data}
					endpoint={this.props.endpoint}
					onProductTableUpdate={this.handleProductTable.bind(this)}
					onRowDel={this.handleRowDel.bind(this)}
					onRowAdd={this.handleRowAdd.bind(this)}
				/>
				<Link to = {nameObject+"/register"} className = {classes.links}> Add New Item </Link>
				<div align = "center">
					Page: <br />
					<input type="number" placeholder = "page" value = {page} ref="PageUpdate" onChange={this.pageChange.bind(this)} />
				</div>
			</div>
		);
	};
}

class SearchBar extends React.Component{
	state = {
		filterText: ""
	}
	handleChange() {
		this.setState({filterText: this.refs.filterTextUpdate.value});
		//this.props.onUserInput(this.refs.filterTextUpdate.value);
	}
	render () {
		return (
			<div>
				<div align = "right">
				<input type="text" placeholder = "Search..." value = {this.state.filterText} ref="filterTextUpdate" onChange={this.handleChange.bind(this)}/>
				</div>
			</div>
		);
	}
}

class ProductTable extends Component{
	render() { 
		var onProductTableUpdate = this.props.onProductTableUpdate;
		var rowDel = this.props.onRowDel;
		var data = this.props.data;
		var dir = this.props.endpoint.split("/");
		var nameObject = dir[dir.length-1];
		return (
		<div>
			{/*<button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right"> Add </button>*/}
			<table className="table table-bordered">
			<thead>
			  <tr>
			    {Object.entries(data[0]).map(el => <th key={key(el)}>{el[0]}</th>)}
			  </tr>
			</thead>
			<tbody>
				{data.map(el => (
				<ProductRow
					endpoint = {this.props.endpoint}
					onProductTableUpdate={onProductTableUpdate} 
					el = {el}
					onDelEvent= {rowDel.bind(this)}
					key = {el.id}
					rowkey = {el.id}				
				/>
				))}
			</tbody>
			</table>
		</div>
	); }
}

class ProductRow extends React.Component {
	onDelEvent() {
		this.props.onDelEvent(this.props.el);
		var newUrl = url+this.props.endpoint+"="+this.props.el.id+"/delete/";
		const conf = {
			  method: 'DELETE',
			  headers: { 'Content-Type': 'application/json'
				, Authorization: `JWT ${localStorage.getItem("ecom_token")}`
			  },
			  body: JSON.stringify({id: this.props.el.id})
		}
		fetch(`${newUrl}`, conf).then(res => res.text()).then(res => console.log(res));
	}
	onSaveEvent() {
		//this.props.onDelEvent(this.props.el);
		var newUrl = url+this.props.endpoint+"="+this.props.el.id+"/update/";
		const conf = {
			method: "PUT",
			body: JSON.stringify(this.props.el),
			headers: { "Content-Type": "application/json"
				, Authorization: `JWT ${localStorage.getItem("ecom_token")}`
			}
		};
		fetch(`${newUrl}`, conf).then(response => console.log(response));
	}
	onChangeValue(item){
		this.props.el[item.name]= item.value;
	}
	render () { 
		return (
			<tr className="eachRow" key={this.props.el.id}>
				{ Object.entries(this.props.el).map(el =>
				<EditableCell
					endpoint = {this.props.endpoint}
					onProductTableUpdate = {this.onChangeValue.bind(this)}
					key = {key(el)}
					cellData = {{
						id: this.props.rowkey,
						value: el[1],
						type: el[0],
						key: key(el)
					}}
				/>
				) }
				<td className="save-cell">
					<input type="button"
						onClick = {this.onSaveEvent.bind(this)}
						value = "Save"
						className = "save-btn"
					/>
				</td>
				<td className="del-cell">
					<input type="button"
						onClick = {this.onDelEvent.bind(this)}
						value = "X"
						className = "del-btn"
					/>
				</td>
			</tr>
		);
	}
}

let classes = {"author": true, "book": true}

class EditableCell extends React.Component {
	state ={
		input: "",
		placeholder: "",
		loaded: false
	};
	getAuthorValue(value){
		return value["first_name"] + 
			" " + 
			value["last_name"] +
			": " +
			value["id"];
	};
	options = [];
	loadoptions (type){
		var newUrl = url+"/api/"+type+"/";
		fetch(`${newUrl}`)
		.then(response => {
			if (response.status !== 200) {
				return this.setState({ placeholder: "Something went wrong" });
			}
			var result = response.json();
			return result;
		}).then( value => {
			value.map(el => {
				if(this.props.cellData.type === "author"){
					this.options.push(this.getAuthorValue(el));
				}
			});
		});
	}
	constructor (props){
		super(props);
		if(classes.hasOwnProperty(this.props.cellData.type)){
			var secondUrl = url+"/api/"+this.props.cellData.type+"="+this.props.cellData.value+"/detail/";
			fetch(`${secondUrl}`)
			.then(response => {
				if (response.status !== 200) {
					return this.setState({ placeholder: "Something went wrong" });
				}
				var result = response.json();
				return result;
			})
			.then( value => {
				if(this.props.cellData.type === "author"){
					var newValue = this.getAuthorValue(value);
					this.setState({input: newValue, loaded: true});
					this.loadoptions(this.props.cellData.type);
				}
			});
		} else {
			this.state = {input: this.props.cellData.value};
		}
	}
	onChangeValue = e => {
		this.setState({input: e.target.value});
		this.props.onProductTableUpdate(e.target);
	};
	onOptionSelected(option){
		var res = option.split(" ");
		var target = {
			name: this.props.cellData.type,
			value: parseInt(res[res.length-1])
		}
		this.props.onProductTableUpdate(target);
	}
	getDetail (){
		console.log(this.props.cellData.value);
	};
	getController(evt){
		console.log(evt.target);
	};
	render() {
		const {input} = this.state;
		if(this.props.cellData.type==="id") return (
			<td >
			{input}
			</td>
		);
		if(classes.hasOwnProperty(this.props.cellData.type) && this.state.loaded){
			return (
				<td >
				<ReactDataList
					list = "authors"
					options = {this.options} 
					initialFilter = {input}
					onOptionSelected = {this.onOptionSelected.bind(this)}
					forcePoly = {true}
					onInputChange = {this.getController.bind(this)}
				/>
				</td>
			);
		}
		return (
			<td >
			<input 
			className = "input"
			type = "text"
			name = {this.props.cellData.type}
			id = {this.props.cellData.id}
			onChange = {this.onChangeValue}
			value = {input} required
			/>
			</td>
		);
	}
}

/*Table.propTypes = {
  data: PropTypes.array.isRequired
};*/

export default Table;
