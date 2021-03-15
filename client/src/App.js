import React, { useContext, createContext, useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
	useHistory,
	useLocation
} from "react-router-dom";

import axios from 'axios';

import { Container, CssBaseline, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, makeStyles } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

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

export default function AuthExample() {
	return (
		<ProvideAuth>
			<Router>
				<div>
					<AuthButton />

					<ul>
						<li>
							<Link to="/public">Public Page</Link>
						</li>
						<li>
							<Link to="/protected">Protected Page</Link>
						</li>
					</ul>

					<Switch>
						<Route path="/public">
							<PublicPage />
						</Route>
						<Route path="/login">
							<LoginPage />
						</Route>
						<PrivateRoute path="/protected">
							<ProtectedPage />
						</PrivateRoute>
					</Switch>
				</div>
			</Router>
		</ProvideAuth>
	);
}

const fakeAuth = {
	isAuthenticated: false,
	signin(cb) {
		fakeAuth.isAuthenticated = true;
		setTimeout(cb, 100); // fake async
	},
	signout(cb) {
		fakeAuth.isAuthenticated = false;
		setTimeout(cb, 100);
	}
};

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext();

function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return (
		<authContext.Provider value={auth}>
			{children}
		</authContext.Provider>
	);
}

function useAuth() {
	return useContext(authContext);
}

function useProvideAuth() {
	const [user, setUser] = useState(null);

	const signin = cb => {
		return fakeAuth.signin(() => {
			setUser("user");
			cb();
		});
	};

	const signout = cb => {
		return fakeAuth.signout(() => {
			setUser(null);
			cb();
		});
	};

	return {
		user,
		signin,
		signout
	};
}

function AuthButton() {
	let history = useHistory();
	let auth = useAuth();

	return auth.user ? (
		<p>
			Welcome!{" "}
			<button
				onClick={() => {
					auth.signout(() => history.push("/"));
				}}
			>
				Sign out
      </button>
		</p>
	) : (
		<p>You are not logged in.</p>
	);
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
	let auth = useAuth();
	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth.user ? (
					children
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

function PublicPage() {
	const [data, setData] = useState("not loaded");
	useEffect(() => {
		axios.get('/testAPI')
			.then(res => {
				console.log(res.data);
				setData(res.data);
			})
	}, [])
	return <h3>{data}</h3>;
}

function ProtectedPage() {
	return <h3>protec</h3>;
}

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
}));

function LoginPage() {
	let history = useHistory();
	let location = useLocation();
	let auth = useAuth();

	const classes = useStyles();

	let { from } = location.state || { from: { pathname: "/" } };

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	let login = () => {

		//alert(username + ' ' + password)

		axios.post("/users/login",
			{
				username: username,
				password: password
			})
			// this is where we would store the data in the auth object
			// idk how to use it tho
			// i kinda wanna stop for tonight
			// we got a good start
			// you can keep going if you want or not
			// ok just push ur changes
			
			.then(res => {
				alert(JSON.stringify(res.data))
				console.log(res);
			}
			);

		auth.signin(() => {
			history.replace(from);
		});
	};

	return (
		<Container component="main" maxWidth="sm">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					You must log in to view the page at {from.pathname}
				</Typography>
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
					autoComplete="username"
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
					autoComplete="current-password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
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

	);
}
