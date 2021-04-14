import React, { useContext, createContext, useState, useEffect } from "react";

export const authContext = createContext();

export function useAuth() {
	return useContext(authContext);
}

export function useProvideAuth() {
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

	const addSchool = (school, cb) => {
		let _user = { ...user };
		_user.school = school;
		setUser(_user);
		localStorage.setItem('user', JSON.stringify(_user));

		cb(_user);
	}

	const signin = (data, cb) => {
		localStorage.setItem('token', data.token);
		localStorage.setItem('user', JSON.stringify(data.user));
		setToken(data.token);
		setUser(data.user);

		cb();
	};

	const signout = cb => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setToken(null);
		setUser(null);

		cb();
	};

	return {
		token,
		user,
		signin,
		signout,
		addSchool
	};
}