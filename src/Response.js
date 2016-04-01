
import clone from 'clone';
import Request from './Request';

/**
 * Typed representation of a REST API response.
 */
export default class Response {
	/**
	 * Initializes the response representation using the provided data.
	 *
	 * @param {{
	 *     status: number,
	 *     headers: Object<string, string>.
	 *     body: *,
	 *     cached: boolean,
	 *     request: Request
	 * }} responseData The data representing this response. See the fields of
	 *        this class for more information.
	 */
	constructor(responseData) {
		/**
		 * The HTTP response status code of this response.
		 *
		 * @type {number}
		 */
		this.status = responseData.status;

		/**
		 * The response headers. The keys are header names in lower-case, the
		 * values are header values.
		 *
		 * @type {Object<string, string>}
		 */
		this.headers = Object.freeze(Object.assign({}, responseData.headers));

		/**
		 * The response of the body, already parsed according to the value of
		 * the response's {@code Content-Type} header.
		 *
		 * @type {*}
		 */
		this.body = clone(responseData.body);
		if (this.body && (typeof this.body === 'object')) {
			Object.freeze(this.body);
		}

		/**
		 * The flag signalling whether this request was handled by the HTTP
		 * agent's cache.
		 *
		 * @type {boolean}
		 */
		this.cached = responseData.cached;

		/**
		 * The REST API request that was made and resulted in this response.
		 *
		 * @type {Request}
		 */
		this.request = new Request(responseData.request);
		
		Object.freeze(this);
	}
}
