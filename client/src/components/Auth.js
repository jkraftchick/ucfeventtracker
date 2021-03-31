import React, { useContext, createContext, useState, useEffect } from "react";

export const authContext = createContext();

export function useAuth() {
	return useContext(authContext);
}

export function useProvideAuth() {
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [user, setUser] = useState(null);

	const signin = (data, cb) => {
		localStorage.setItem('token', data.token);
		setToken(data.token);
		setUser(data.user);

		cb();
	};

	const signout = cb => {
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);

		cb();
	};

	return {
		token,
		user,
		signin,
		signout
	};
}