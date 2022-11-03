import React, { useState } from 'react';
import { authPage } from '../../middlewares/authorizationPage';
import Router from 'next/router';
import Nav from '../../components/Nav';

export async function getServerSideProps(ctx) {
	let { token } = await authPage(ctx);

	return { props: { token } };
}

export default function PostCreate(props) {
	const [fields, setFields] = useState({
		title: '',
		content: '',
	});

	const [status, setStatus] = useState('normal');

	async function createHandler(e) {
		e.preventDefault();

		const { token } = props;

		setStatus('loading...');

		const createReq = await fetch('/api/posts/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify(fields),
		});

		if (!createReq.ok) return setStatus('Error ' + createReq.status);

		const createRes = await createReq.json();

		setStatus(createRes.message);

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
			<h1>Create a Post</h1>
			<Nav />
			<br />
			<br />

			<form onSubmit={createHandler.bind(this)}>
				<input
					onChange={fieldHandler.bind(this)}
					type="text"
					name="title"
					placeholder="Title"
				/>
				<br />
				<br />
				<textarea
					onChange={fieldHandler.bind(this)}
					name="content"
					rows="4"
					cols="21"
					placeholder="Content"
				></textarea>
				<br />
				<br />
				<button type="submit">Create Post</button>
				<div>Status: {status}</div>
			</form>
		</div>
	);
}
