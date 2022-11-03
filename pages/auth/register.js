import Link from 'next/link';
import React, { useState } from 'react';

import { unAuthPage } from '../../middlewares/authorizationPage';

export async function getServerSideProps(ctx) {
	await unAuthPage(ctx);

	return { props: {} };
}

export default function Register() {
	const [fields, setFields] = useState({
		email: '',
		password: '',
	});

	const [status, setStatus] = useState('normal');

	async function registerHandler(e) {
		e.preventDefault();

		setStatus('loading');

		const registerReq = await fetch('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(fields),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!registerReq.ok) return setStatus('error ' + registerReq.status);

		const registerRes = await registerReq.json();

		setStatus('success');
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
			<h1>Register</h1>
			<form onSubmit={registerHandler.bind(this)}>
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
				<button type="submit">Register</button>

				<div>Output: {status}</div>
				<div>
					You already have an account?
					<Link href="/auth/login">
						<a>Login</a>
					</Link>
				</div>
			</form>
		</div>
	);
}
