import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import Router from 'next/router';
import { unAuthPage } from '../../middlewares/authorizationPage';
import Link from 'next/link';

export async function getServerSideProps(ctx) {
	await unAuthPage(ctx);

	return { props: {} };
}

export default function Login() {
	const [fields, setFields] = useState({
		email: '',
		password: '',
	});

	const [status, setStatus] = useState('normal');

	async function loginHandler(e) {
		e.preventDefault();

		setStatus('loading');

		const loginReq = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(fields),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!loginReq.ok) return setStatus('error ' + loginReq.status);

		const loginRes = await loginReq.json();

		setStatus('success');

		Cookie.set('token', loginRes.token);
		Router.push('/posts');
	}

	function fieldHandler(e) {
		const name = e.target.getAttribute('name');

		setFields({
			...fields,
			[name]: e.target.value,
		});
	}

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={loginHandler.bind(this)}>
				<input
					name="email"
					type="text"
					onChange={fieldHandler.bind(this)}
					placeholder="Email"
				/>
				<br />
				<input
					name="password"
					type="password"
					onChange={fieldHandler.bind(this)}
					placeholder="Password"
				/>
				<br />
				<button type="submit">Login</button>

				<div>Output: {status}</div>
				<div>
					You don't have an account?
					<Link href="/auth/register">
						<a>Register</a>
					</Link>
				</div>
			</form>
		</div>
	);
}
