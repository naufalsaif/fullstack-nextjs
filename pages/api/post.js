export default function handler(req, res) {
	res.status(200).json({
		message: 'Ini testing post',
		data: {
			nama: 'naufal',
			prodi: 'teknik informatika',
		},
	});
}
