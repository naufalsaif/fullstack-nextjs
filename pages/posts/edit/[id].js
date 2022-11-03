import React, { useState } from 'react';
import { authPage } from '../../../middlewares/authorizationPage';
import Router from 'next/router';
import Nav from '../../../components/Nav';

export async function getServerSideProps(ctx) {
	let { token } = await authPage(ctx);

	const { id } = ctx.query;

	const postReq = await fetch(`http://localhost:3000/api/posts/detail/${id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const postRes = await postReq.json();

	return { props: { token, post: postRes.data } };
}

export default function PostEdit(props) {
	const { post } = props;

	const [fields, setFields] = useState({
		title: post.title,
		content: post.content,
	});

	const [status, setStatus] = useState('normal');

	async function updateHandler(e) {
		e.preventDefault();

		const { token } = props;

		setStatus('loading...');

		const updateReq = await fetch(`/api/posts/update/${post.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify(fields),
		});

		if (!updateReq.ok) return setStatus('Error ' + updateReq.status);

		const updateRes = await updateReq.json();

		setStatus(updateRes.message);

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
			<h1>Edit a Post</h1>
			<Nav />
			<p>Post ID: {post.id}</p>

			<form onSubmit={updateHandler.bind(this)}>
				<input
					onChange={fieldHandler.bind(this)}
					type="text"
					name="title"
					placeholder="Title"
					defaultValue={fields.title}
				/>
				<br />
				<br />
				<textarea
					onChange={fieldHandler.bind(this)}
					name="content"
					rows="4"
					cols="21"
					placeholder="Content"
					defaultValue={fields.content}
				></textarea>
				<br />
				<br />
				<button type="submit">Save Changes</button>
				<div>Status: {status}</div>
			</form>
		</div>
	);
}
