import React, { useContext, createContext, useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
	useHistory,
	useLocation,
	useParams
} from "react-router-dom";

import axios from 'axios';

import { CardHeader, Paper, Card, MenuItem, Container, CssBaseline, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, makeStyles, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Menu } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { useAuth, useProvideAuth, authContext } from './components/Auth';

import { Dashboard } from './components/Dashboard';
import { Rso } from './components/Rso';
import { NewRso } from './components/newRso';
import { Event } from './components/Event';
import { NewEvent } from './components/newEvent';
import { School } from './components/School';
// import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'


// This example has 3 pages: a public page, a protected
// page, and a login screen. In order to see the protected
// page, you must first login. Pretty standard stuff.
//
// First, visit the public page. Then, visit the protected
// page. You're not yet logged in, so you are redirected
// to the login page. After you login, you are redirected
// back to the protected page.
//
// Notice the URL change each time. If you click the back
// button at this point, would you expect to go back to the
// login page? No! You're already logged in. Try it out,
// and you'll see you go back to the page you visited
// just *before* logging in, the public page.

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	menuButton: {
		margin: theme.spacing(2),
		display: 'flex',
		position: 'absolute', right: 0
	},
	menuText: {
		margin: theme.spacing(2),
	},
}));

export default function App() {
	let auth = useProvideAuth();

	return (
		<ProvideAuth>
			<Router>
				<Switch>
					<Route exact path="/">
						<FrontPage />
					</Route>
					<Route exact path="/login">
						<LoginPage />
					</Route>
					<Route exact path="/signup">
						<SignupPage />
					</Route>
					<PrivateRoute exact path="/dashboard">
						<LeftNavLayout />
						{auth.user?.school != null ?
							<Dashboard /> :
							<School />
						}
					</PrivateRoute>
					<PrivateRoute exact path="/rso">
						<LeftNavLayout />
						<Rso />
					</PrivateRoute>
					<PrivateRoute exact path="/newrso" role={["admin", "superadmin"]}>
						<LeftNavLayout />
						<NewRso />
					</PrivateRoute>
					<PrivateRoute exact path="/event/:id">
						<LeftNavLayout />
						<Event />
					</PrivateRoute>
					<PrivateRoute exact path="/newevent" role={["admin", "superadmin"]}>
						<LeftNavLayout />
						<NewEvent />
					</PrivateRoute>


					<Route path="/no-perm">
						<LeftNavLayout />
						<p>test </p>
						{/* <NewEvent /> */}
					</Route>
					<Route>
						<p>page not found</p>
					</Route>
				</Switch>
			</Router>
		</ProvideAuth>
	);
}

function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return (
		<authContext.Provider value={auth}>
			{children}
		</authContext.Provider>
	);
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, role, ...rest }) {
	let auth = useAuth();

	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth.token ? (

					!role ?
						children
						:
						(role.includes(auth.user.role) ?
							children
							:
							<Redirect
								to={{
									pathname: "/no-perm",
									state: { from: location }
								}}
							/>
						)
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: location }
						}}
					/>
				)
			}
		/>
	);
}


const FrontPage = (props) => {
	const auth = useAuth();
	const history = useHistory();
	const classes = useStyles();


	if (auth.token) history.push('/dashboard');

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography className={classes.menuText}>ucfeventtracker</Typography>
					<div className={classes.menuButton}>
						<Button href="/signup">Sign Up</Button>
						<Button href="/login">Login</Button>
					</div>
				</Toolbar>
			</AppBar>

			<Container style={{ margin: 25 }}>
				<Typography variant="h1">ucfeventtracker</Typography>
				<Typography variant="h4">a project by Josh Kraftchick and Joseph Mansy</Typography>
				<Typography variant="h4">COP 4710</Typography>
				<Typography variant="h4">Spring 2021</Typography>
			</Container>

		</>
	);
}

const LeftNavLayout = () => {
	let history = useHistory();
	let location = useLocation();
	let auth = useAuth();
	const classes = useStyles();

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography className={classes.menuText}>ucfeventtracker</Typography>
				<div className={classes.menuButton}>
					{auth.user?.role === "student" && <Button>Request New RSO</Button>}
					{location.pathname != '/newevent' && (auth.user?.role === 'superadmin' || auth.user?.role === 'admin') &&
						<Button href="/newevent"> New Event </Button>}
					{location.pathname != '/newrso' && (auth.user?.role === 'superadmin' || auth.user?.role === 'admin') &&
						<Button href="/newrso"> New Rso </Button>}
					{location.pathname !== '/dashboard' && <Button href="/dashboard"> Dashboard </Button>}
					{location.pathname !== '/rso' && auth.user?.school && <Button href="/rso"> RSO Dashboard </Button>}
					<Button href="/" onClick={() => { auth.signout() }}>Sign Out</Button>
				</div>
			</Toolbar>
		</AppBar >
	)
}

const LoginPage = () => {
	let history = useHistory();
	let location = useLocation();
	let auth = useAuth();

	const classes = useStyles();

	let { from } = location.state || { from: { pathname: "/dashboard" } };

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);

	if (auth.token) history.push('/dashboard');

	let login = () => {

		//alert(username + ' ' + password)

		axios.post("/api/users/login", { username: username, password: password })
			.then(res => {
				auth.signin(res.data, () => {
					history.replace(from);
				});
			})
			.catch(err => {
				setError(err);
			})


	};

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Button component={Link} className={classes.menuText} to='/' variant='text'>ucfeventtracker</Button>
				</Toolbar>
			</AppBar>
			<Container component="main" maxWidth="sm">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
        			</Typography>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="username"
						label="Username"
						name="username"
						autoFocus
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
					{error &&
						<Typography>Error! invalid username or password</Typography>
					}
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={() => login()}

					>
						Sign In
				</Button>
				</div>
			</Container>
		</>
	);


}

const SignupPage = () => {
	let history = useHistory();
	let location = useLocation();
	let auth = useAuth();

	const classes = useStyles();

	let { from } = location.state || { from: { pathname: "/dashboard" } };

	const [username, setUsername] = useState("");
	const [confirmpassword, setConfirmpassword] = useState("");
	const [password, setPassword] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [error, setError] = useState()

	let signup = () => {
		axios.post("/api/users/signup", { username: username, password: password, firstName: firstname, lastName: lastname })
			.then(res => {
				auth.signin(res.data, () => {
					history.replace(from);
				});
			})
			.catch(err => {
				setError("failed to make account");
			})
	};

	useEffect(() => {

		if (firstname === "") setError("Missing first name")
		else if (lastname === "") setError("Missing last name")
		else if (username === "") setError("Missing username")

		else if (password === "") setError("No Password");
		else if (password !== confirmpassword) setError("Passwords do not match!");
		else setError();

	}, [password, confirmpassword, firstname, username, lastname])

	return (
		<Container component="main" maxWidth="sm">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
					</Typography>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="firstname"
					label="First Name"
					value={firstname}
					onChange={e => setFirstname(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="lastname"
					label="Last Name"
					value={lastname}
					onChange={e => setLastname(e.target.value)}
				/>
				<br />
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="username"
					label="Username"
					name="username"
					autoFocus
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="confirmpassword"
					label="Confirm Password"
					type="password"
					id="confirmpassword"
					value={confirmpassword}
					onChange={e => setConfirmpassword(e.target.value)}
				/>
				<br />
				{error &&
					<Typography>{error}</Typography>
				}
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
					onClick={() => signup()}
					disabled={Boolean(error)}
				>
					Sign up
				</Button>
			</div>
		</Container >
	)
}
