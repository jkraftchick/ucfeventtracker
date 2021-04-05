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

export function Dashboard() {
	let history = useHistory();
	const auth = useProvideAuth();
	const [events, setEvents] = useState([])
	const [level, setLevel] = useState('rso')

	// if (!auth.token) history.push('/');


	useEffect(() => {
		axios.get(`/api/event?level=${level}`, {
			headers: {
				'Authorization': `Token ${auth.token}`
			}
		})
			.then(data => {
				setEvents(data.data);
			})
			.catch(err => {
				throw err;
			})
	}, [level])

	return (
		<>
			<Select
				value={level}
				onChange={(e) => setLevel(e.target.value)}
			>
				<MenuItem value={'public'}>Public</MenuItem>
				<MenuItem value={'school'}>School</MenuItem>
				<MenuItem value={'rso'}>RSO</MenuItem>
			</Select>
			<Paper style={{ height: '90vh', overflow: 'auto' }} elevation={0}>
				{events.map(event => (
					<Card key={event._id} style={{ margin: 10, padding: 10 }}>
						<CardHeader
							title={event.title}
							subheader={`${event.subtitle} : ${event.access_type}`}
						/>
						{new Date(event.starts).toLocaleString()} - {new Date(event.ends).toLocaleString()}
						<br />

						<br />
						{event.subtitle}
						<Paper style={{ maxHeight: 200, overflow: 'auto', margin: 2 }} elevation={0}>
							{event.description}
						</Paper>
						{event.contact_name}
						<br />
						{event.contact_email}, {event.contact_phone}
						<br />

						<Button variant="contained" color="primary"
							onClick={() => history.push(`/event/${event._id}`)}

						>
							Go to event page
						</Button>
					</Card>
				))}
			</Paper>
		</>
	)
}
