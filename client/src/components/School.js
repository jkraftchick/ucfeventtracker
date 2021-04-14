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

import { CardMedia, Select, CardHeader, Paper, Card, MenuItem, Container, CssBaseline, Avatar, Typography, TextField, FormControlLabel, Checkbox, Button, makeStyles, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Menu } from '@material-ui/core'

import { useAuth, useProvideAuth, authContext } from './Auth';

export function School() {
	let history = useHistory();
	const auth = useProvideAuth();
	const _auth = useAuth();
	const [schools, setSchools] = useState([])
	const [forceUpdate, setForceUpdate] = useState(true);

	useEffect(() => {
		axios.get(`/api/school`, {
			headers: {
				'Authorization': `Token ${auth.token}`
			}
		})
			.then(data => {
				setSchools(data.data);
			})
			.catch(err => {
				throw err;
			})
	}, [forceUpdate])

	// useEffect(() => {
	// 	window.location.reload();
	// }, [auth])

	return (
		<>
			<Paper style={{ height: '90vh', overflow: 'auto' }} elevation={0}>
				{schools.map(school => (
					<Card key={school._id} style={{ margin: 10, padding: 10 }}>
						<CardHeader
							title={school.name}
							subheader={school.description}
						/>

						<Button variant="contained" color="primary"
							onClick={() => {
								axios.patch(`/api/school/join/${school._id}`, {
									'user': auth.user._id
								}, {
									headers: {
										'Authorization': `Token ${auth.token}`
									}
								})
									.then(data => {
										_auth.addSchool(school._id, () => {
											window.location.reload();
										})
									})
									.catch(err => {
										throw err;
									})
							}}>
							Join School
						</Button>

					</Card>
				))}
			</Paper>
		</>
	)
}
