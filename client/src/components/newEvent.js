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

export const NewEvent = () => {
	let history = useHistory();
	let _location = useLocation();
	let auth = useAuth();

	const classes = useStyles();

	let { from } = _location.state || { from: { pathname: "/dashboard" } };

	const [title, setTitle] = useState("");
	const [subtitle, setSubtitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState(null);
	const [starts, setStarts] = useState("");
	const [ends, setEnds] = useState("");
	const [contact_name, setContact_name] = useState("");
	const [contact_phone, setContact_phone] = useState("");
	const [contact_email, setContact_email] = useState("");
	const [url, setUrl] = useState("");
	const [level, setLevel] = useState("public");


	const [lastname, setLastname] = useState("");
	const [error, setError] = useState()

	let create = () => {

		axios.post("/api/event", {
			title: title,
			subtitle: subtitle,
			description: description,
			location: location,
			starts: starts,
			ends: ends,
			contact_name: contact_name,
			contact_phone: contact_phone,
			contact_email: contact_email,
			url: url,
			access_type: level,
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

	// const create = () => {
	// 	title: title,
	// 	subtitle: subtitle,
	// 	description: description,
	// 	location: location,
	// 	starts: starts,
	// 	ends: ends,
	// 	contact_name: contact_name,
	// 	contact_phone: contact_phone,
	// 	contact_email: contact_email,
	// 	level: level,
	// }

	useEffect(() => {
		if (title === "") setError("Missing title");
		else if (subtitle === "") setError("Missing subtitle");
		else if (description === "") setError("Missing description");
		else if (starts === "") setError("Missing Start Time");
		else if (ends === "") setError("Missing End Time");
		else if (ends < starts) setError("Ending time is before start time");
		else if (contact_name === "") setError("Missing contact name");
		else if (contact_phone === "") setError("Missing contact phone");
		else if (contact_email === "") setError("Missing contact email");
		else if (url === "") setError("Missing url");
		else if (!location) setError("Missing location");

		else setError();

	}, [title, subtitle, description, location, starts, ends, contact_name, contact_phone, contact_email])

	function LocationMarker() {
		const map = useMapEvents({
			click(e) {
				setLocation(e.latlng);
			}
		})

		return location === null ? null : (
			<Marker position={location}>
				<Popup>Event Location</Popup>
			</Marker>
		)
	}


	return (
		<Container component="main" maxWidth="sm">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Create An Event
				</Typography>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="title"
					label="Event Title"
					autoFocus
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="subtitle"
					label="Event Subtitle"
					value={subtitle}
					onChange={e => setSubtitle(e.target.value)}
				/>
				<Typography>Select Event Visibility</Typography >
				<Select
					value={level}
					onChange={(e) => setLevel(e.target.value)}
				>
					<MenuItem value={'public'}>Public</MenuItem>
					<MenuItem value={'school'}>School</MenuItem>
					<MenuItem value={'rso'}>RSO</MenuItem>
				</Select>
				<br />
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					multiline
					label="description"
					name="Event Description"
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					type="datetime-local"
					name="contact_name"
					label="Event Start Date/Time"
					value={starts}
					InputLabelProps={{
						shrink: true,
					}}
					onChange={e => setStarts(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					type="datetime-local"
					name="contact_name"
					label="Event Ends Date/Time"
					value={ends}
					InputLabelProps={{
						shrink: true,
					}}
					onChange={e => setEnds(e.target.value)}
				/>
				<br />
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="contact_name"
					label="Event Contact Name"
					value={contact_name}
					onChange={e => setContact_name(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="contact_email"
					label="Event Contact Email"
					value={contact_email}
					onChange={e => setContact_email(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="contact_phone"
					label="Event Contact Phone Number"
					value={contact_phone}
					onChange={e => setContact_phone(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="url"
					label="Event URL"
					value={url}
					onChange={e => setUrl(e.target.value)}
				/>
				<MapContainer
					center={[28.5988389, -81.2007836]}
					zoom={13}
					style={{ width: '100%', height: 300 }}
				>
					<TileLayer
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<LocationMarker />
				</MapContainer>
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
					onClick={() => create()}
					disabled={Boolean(error)}
				>
					Create Event
				</Button>
			</div>
		</Container >
	)
}