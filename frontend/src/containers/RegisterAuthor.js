import {connect} from "react-redux";
//import {Author} from "../components/App";
import {AuthorForm} from "../components/FormAuthor";
import {
	updatePage,
} from "../actions/auth/authActions.js";

const mapDispatchToProps = dispatch => ({
	updatePage: (dispatch,location, push) =>
		dispatch(updatePage(dispatch, location, push)),
	dispatch
});

export default connect(null, mapDispatchToProps)(AuthorForm);
