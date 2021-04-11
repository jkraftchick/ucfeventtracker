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

import { Select, CardHeader, Paper, Card, MenuItem, Container, CssBaseline, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, makeStyles, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Menu } from '@material-ui/core'

import { useAuth, useProvideAuth, authContext } from './Auth';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'



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

export const NewRso = () => {
	let history = useHistory();
	let _location = useLocation();
	let auth = useAuth();

	const classes = useStyles();

	let { from } = _location.state || { from: { pathname: "/dashboard" } };

	const [title, setTitle] = useState("");

	const [error, setError] = useState()

	let create = () => {

		axios.post("/api/rso", {
			name: title,
			admin: auth.user._id,
			students: [auth.user._id]
		}, {
			headers: {
				'Authorization': `Token ${auth.token}`
			}
		})
			.then(data => {
				console.log(data);
			})
			.catch(err => {
				setError("failed to make account");
			})
	};

	useEffect(() => {
		if (title === "") setError("Missing title");

		else setError();

	}, [title])

	return (
		<Container component="main" maxWidth="sm">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Create An RSO
				</Typography>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="title"
					label="RSO Title"
					autoFocus
					value={title}
					onChange={e => setTitle(e.target.value)}
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
					onClick={() => {
						create()
						history.push('/dashboard')
					}}
					disabled={Boolean(error)}
				>
					Create RSO
				</Button>
			</div>
		</Container >
	)
}