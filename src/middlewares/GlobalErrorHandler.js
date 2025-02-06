import { ResponseDto } from "../dto/response/ResponseDto";
import Youch from "youch";

export const GlobalErrorHandler = async (err, req, res, next) => {
	// if (process.env.NODE_ENV === 'development') {
	//     const errors = await new Youch(err, req).toJSON();
	//     return res.status(err.code || 500).json(errors);
	// }

	const errCode = err.code || 500;
	const errMsg = err.message || "Something went wrong";
	const image = err.image || null;

	let response = new ResponseDto();
	response.setError({
		status: errCode,
		message: errMsg,
		image: image,
	});

	res.status(errCode).json(response);
};
