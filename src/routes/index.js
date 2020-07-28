import React, { useReducer } from 'react';
import { SessionContext, reducer, initialState } from '../store'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './home';
import SignIn from './signIn';
import Profile from './profile/index';
import UpdateForm from './profile/updateProfile';
import Property from './property';
import UpdatePreferenciesForm from './profile/updatePreferenciesProfile';
import PropertyList from "./propertyList";
import FormPropertyUpdate from './property/updateProperty';
import UserHome from '../routes/userHome'

const Routes = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<SessionContext.Provider value={ {state, dispatch} }>
			<Router>
				{state.user ? (
					<Switch>
						<Route exact path="/" component={UserHome} />
						<Route path="/profile/updatePreferencies" exact component={UpdatePreferenciesForm} />
						<Route path="/profile/update" exact component={UpdateForm} />
						<Route path="/profile/:nickname" component={Profile} />
						<Route path="/property/:idProperty/update" component={FormPropertyUpdate} />
						<Route path="/property" exact component={Property} />
						<Route path="/property/properties" exact component={PropertyList} />
					</Switch>
				) : (
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/sign-in" exact component={SignIn} />
						<Redirect from="*" to="/"/>
					</Switch>
				)}
			</Router>
		</SessionContext.Provider>
	);
};

export default Routes;
