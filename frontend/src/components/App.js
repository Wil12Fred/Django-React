import React from "react";
//import ReactDOM from "react-dom";
//import DataProvider from "./DataProvider";
import Table from "./Table";
import {FormPublisher} from "./Form";
//
const Publisher = () => (
  <React.Fragment>
  <Table endpoint = "/api/publisher"/>
  <FormPublisher endpoint = "/api/publisher/" />
  </React.Fragment>
);

const Author = () => (
  <React.Fragment>
  <Table endpoint = "/api/author"/>
  </React.Fragment>
);

const Book = () => (
  <React.Fragment>
  <Table endpoint = "/api/book"/>
  </React.Fragment>
);

export {
	Publisher,
	Author,
	Book
}

//const wrapper = document.getElementById("app");
//wrapper ? ReactDOM.render(<App />, wrapper) : null;
