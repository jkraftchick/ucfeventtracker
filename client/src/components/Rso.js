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

export function Rso() {
	let history = useHistory();
	const auth = useProvideAuth();
	const [rsos, setRsos] = useState([])
	const [forceUpdate, setForceUpdate] = useState(true);

	useEffect(() => {
		axios.get(`/api/rso`, {
			headers: {
				'Authorization': `Token ${auth.token}`
			}
		})
			.then(data => {
				setRsos(data.data);
			})
			.catch(err => {
				throw err;
			})
	}, [forceUpdate])

	return (
		<>
			<Paper style={{ height: '90vh', overflow: 'auto' }} elevation={0}>
				{rsos.map(rso => (
					<Card key={rso._id} style={{ margin: 10, padding: 10 }}>
						<CardHeader
							title={rso.name}
						/>


						{rso.students.includes(auth.user?._id) ?
							<Button variant="contained" color="primary"
								onClick={() => {
									axios.patch(`/api/rso/leave/${rso._id}`, {
										'user': auth.user._id
									}, {
										headers: {
											'Authorization': `Token ${auth.token}`
										}
									})
										.then(data => {
											setForceUpdate(forceUpdate => !forceUpdate)
										})
										.catch(err => {
											throw err;
										})
								}}

							>
								Leave RSO
							</Button>
							:
							<Button variant="contained" color="primary"
								onClick={() => {
									axios.patch(`/api/rso/join/${rso._id}`, {
										'user': auth.user._id
									}, {
										headers: {
											'Authorization': `Token ${auth.token}`
										}
									})
										.then(data => {
											setForceUpdate(forceUpdate => !forceUpdate)
										})
										.catch(err => {
											throw err;
										})
								}}>
								Join RSO
							</Button>
						}
					</Card>
				))}
			</Paper>
		</>
	)
}
