import React, { useReducer } from 'react';
import { SessionContext, reducer, initialState } from '../store'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import useServiceWorker from '../util/useServiceWorker';
import Home from './home';
import SignIn from './signIn';
import Profile from './profile/index';
import MyProfile from './profile/myProfile';
import UpdateForm from './profile/updateProfile';
import ContactUs from './contact-us';
import Metrics from './metrics';
import MetricsAdmin from './metrics-admin';
import PropertyDetail from './property-detail';
import UpdatePreferenciesForm from './profile/updatePreferenciesProfile';
import PropertyList from "./propertyList";
import Property from "./property";
import PropertiesOnMap from "./properties-on-map";
import MyProperties from "./my-properties";
import Roommates from "./roommates";
import Notifications from "./notifications";
import FormPropertyUpdate from './property-update';
import Groups from './groups';
import PayOptions from './payOptions'
import PaymentResultSuccess from './paymentResultSuccess'
import PaymentResultFail from './paymentResultFail'
import AdList from './ad-list'
import Ad from './ad'
import FormAdUpdate from './ad-update'
import isAdminRole from '../util/isAdmin'

const Routes = () => {
	useServiceWorker();
	const [state, dispatch] = useReducer(reducer, initialState);

	const isAdmin = isAdminRole(state.user);

	const userRoutes = (
		<Switch>
			<Route exact path="/" component={PropertyList} />
			<Route path="/property/:idProperty/update" component={FormPropertyUpdate} />
			<Route path="/property/:idProperty" component={PropertyDetail} />
			<Route exact path="/property" component={Property} />
			<Route path="/my-properties" exact component={MyProperties} />
			<Route exact path="/properties-on-map" component={PropertiesOnMap} />
	
			<Route exact path="/my-profile" component={MyProfile} />
			<Route path="/my-profile/updatePreferencies" exact component={UpdatePreferenciesForm} />
			<Route path="/my-profile/update" exact component={UpdateForm} />
			
			<Route path="/profile/:nickname" component={Profile} />
			
			<Route path="/contact-us" component={ContactUs} />
			
			<Route path="/roommates" exact component={Roommates} />
			
			<Route path="/groups/:group/votations" component={Groups} />
			<Route path="/groups/:group/chat/:chat/:name" component={Groups} />
			<Route path="/groups/:group" component={Groups} />
			<Route path="/groups" exact component={Groups} />
			
			<Route path="/notifications" exact component={Notifications} />
			
			<Route path="/reports" exact component={Metrics} />
			
			<Route path="/payOptions" exact component={PayOptions} />
			<Route path="/paymentResultSuccess/:idowner/:cantidad" exact component={PaymentResultSuccess} />
			<Route path="/paymentResultFail" exact component={PaymentResultFail} />
			<Redirect from="*" to="/" />

		</Switch>
	)

	const adminRoutes = (
		<Switch>
			<Route path="/ads" exact component={AdList} />  
			<Route path="/ad" exact component={Ad} /> 
			<Route path="/ad/:idAd/update" component={FormAdUpdate} /> 
			<Route path="/reports-admin" exact component={MetricsAdmin} /> 
			<Redirect from="*" to="/reports-admin" />
		</Switch>
	)

	return (
		<SessionContext.Provider value={ {state, dispatch} }>
			<Router>
				{state.user ? (
					<>
						{ isAdmin ? adminRoutes : userRoutes }
					</>
				) : (
					<>
						<Route exact path="/" component={Home} />
						<Route path="/sign-in" exact component={SignIn} />
						<Route path="/contact-us" component={ContactUs} />
						<Redirect from="*" to="/"/>
					</>
				)}
			</Router>
		</SessionContext.Provider>
	);
};

export default Routes;
