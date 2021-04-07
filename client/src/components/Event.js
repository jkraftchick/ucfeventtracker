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

import { List, Select, CardHeader, Paper, Card, MenuItem, Container, CssBaseline, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, makeStyles, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Menu, ListSubheader } from '@material-ui/core'

// import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'


import { useAuth, useProvideAuth, authContext } from './Auth';


export const Event = () => {
	const auth = useProvideAuth();

	let { id } = useParams();

	const [event, setEvent] = useState();

	useEffect(() => {
		axios.get(`/api/event?id=${id}`, {
			headers: {
				'Authorization': `Token ${auth.token}`
			}
		})
			.then(data => {
				setEvent(data.data);
			})
			.catch(err => {
				throw err;
			})
	}, [])

	return (
		<>
			{event ? <>
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

					{event.users.some(user => user._id === auth.user?._id) ?
						// {event.users.includes(auth.user?._id) ?
						<Button onClick={() => {
							axios.patch(`/api/event/leave/${event._id}`, {
								'user': auth.user._id
							}, {
								headers: {
									'Authorization': `Token ${auth.token}`
								}
							})
								.then(data => {
									setEvent(data.data);
								})
								.catch(err => {
									throw err;
								})
						}}>
							Leave Event</Button> :
						<Button onClick={() => {
							axios.patch(`/api/event/join/${event._id}`, {
								'user': auth.user._id
							}, {
								headers: {
									'Authorization': `Token ${auth.token}`
								}
							})
								.then(data => {
									setEvent(data.data);
								})
								.catch(err => {
									throw err;
								})
						}}>
							Join Event</Button>
					}
					<List>
						<Typography>
							Current Attendees
					</Typography>
						{event.users.map(user => (
							// idk how to have it show actual data
							<ListItemText>
								{user.firstName} {user.lastName}
							</ListItemText>
						))}
					</List>

					<MapContainer
						center={event.location}
						zoom={13}
						style={{ width: 300, height: 300 }}
					>
						<TileLayer
							url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
						/>
						<Marker position={event.location} />
					</MapContainer>
				</Card>
			</>
				:
				<Typography>Loading Event</Typography>
			}
		</>
	)
}