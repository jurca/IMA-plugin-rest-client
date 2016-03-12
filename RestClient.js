
/**
 * Utility for easier communication with a REST API server.
 *
 * @interface
 */
export default class RestClient {
	/**
	 * Retrieves the entities from the specified REST resource.
	 *
	 * The response may be adjusted, filtered, sorted, or extended using the
	 * additional parameters sent to the server, depending on the server's
	 * options and capabilities.
	 *
	 * Implementation note: The method performs a GET HTTP request to the REST
	 * API.
	 *
	 * @param {*} resource The resource from which the entities should be
	 *        retrieved.
	 * @param {Object<string, (number|string)>=} parameters The additional
	 *        parameters to send to the server with the request to configure
	 *        the server's response.
	 * @param {{
	 *     timeout: number=,
	 *     ttl: number=,
	 *     repeatRequest: number=,
	 *     headers: Object<string, string>=,
	 *     cache: boolean=,
	 *     withCredentials: boolean=
	 * }=} options Request options. See the documentation of the HTTP agent for
	 *     more details.
	 * @return {Promise<Response>} A promise that will resolve to the server's
	 *         response.
	 */
	list(resource, parameters = {}, options = {}) {}

	/**
	 * Retrieves the specified entity form the specified REST resource.
	 *
	 * The response may be adjusted, filtered, or extended using the additional
	 * parameters sent to the server, depending on the server's options and
	 * capabilities.
	 *
	 * Implementation note: The method performs a GET HTTP request to the REST
	 * API.
	 *
	 * @param {*} resource The resource from which the entity should be
	 *        retrieved.
	 * @param {(number|string)} id The ID identifying the entity to retrieve.
	 * @param {Object<string, (number|string)>=} parameters The additional
	 *        parameters to send to the server with the request to configure
	 *        the server's response.
	 * @param {{
	 *     timeout: number=,
	 *     ttl: number=,
	 *     repeatRequest: number=,
	 *     headers: Object<string, string>=,
	 *     cache: boolean=,
	 *     withCredentials: boolean=
	 * }=} options Request options. See the documentation of the HTTP agent for
	 *     more details.
	 * @return {Promise<Response>} A promise that will resolve to the server's
	 *         response.
	 */
	get(resource, id, parameters = {}, options = {}) {}

	/**
	 * Patches the specified entity in the specified REST resource using the
	 * provided partial state of the entity, replacing the matching properties
	 * and adding the missing ones.
	 *
	 * Note that the the method cannot be used to remove existing fields from
	 * the entity, the {@linkcode replace} method has to be used for that
	 * instead.
	 *
	 * Implementation note: The method performs a PATCH HTTP request to the
	 * REST API.
	 *
	 * @param {*} resource The resource in which the entity should be modified.
	 * @param {(number|string)} id The ID identifying the entity to modify.
	 * @param {*} data The data representing the modifications to make to the
	 *        entity..
	 * @param {{
	 *     timeout: number=,
	 *     ttl: number=,
	 *     repeatRequest: number=,
	 *     headers: Object<string, string>=,
	 *     cache: boolean=,
	 *     withCredentials: boolean=
	 * }=} options Request options. See the documentation of the HTTP agent for
	 *     more details.
	 * @return {Promise<Response>} A promise that will resolve to the server's
	 *         response.
	 */
	patch(resource, id, data, options = {}) {}

	/**
	 * Replaces the specified entity in the specified REST resource by a new
	 * entity created using the provided data.
	 *
	 * Implementation note: The method performs a PUT HTTP request to the REST
	 * API.
	 *
	 * @param {*} resource The resource in which the entity should be created.
	 * @param {(number|string)} id The ID identifying the entity to replace.
	 * @param {*} data The data representing the entity.
	 * @param {{
	 *     timeout: number=,
	 *     ttl: number=,
	 *     repeatRequest: number=,
	 *     headers: Object<string, string>=,
	 *     cache: boolean=,
	 *     withCredentials: boolean=
	 * }=} options Request options. See the documentation of the HTTP agent for
	 *     more details.
	 * @return {Promise<Response>} A promise that will resolve to the server's
	 *         response.
	 */
	replace(resource, id, data, options = {}) {}

	/**
	 * Creates a new entity using the provided data in the specified REST
	 * resource.
	 *
	 * Implementation note: The method performs a POST HTTP request to the REST
	 * API.
	 *
	 * @param {*} resource The resource in which the entity should be created.
	 * @param {*} data The data representing the entity.
	 * @param {{
	 *     timeout: number=,
	 *     ttl: number=,
	 *     repeatRequest: number=,
	 *     headers: Object<string, string>=,
	 *     cache: boolean=,
	 *     withCredentials: boolean=
	 * }=} options Request options. See the documentation of the HTTP agent for
	 *     more details.
	 * @return {Promise<Response>} A promise that will resolve to the server's
	 *         response.
	 */
	create(resource, data, options = {}) {}

	/**
	 * Deletes the resource entity identified by the specified ID from the
	 * specified REST resource.
	 *
	 * Implementation note: The method performs a DELETE HTTP request to the
	 * REST API.
	 *
	 * @param {*} resource The resource from which the entity should be
	 *        deleted.
	 * @param {(number|string)} id The ID identifying the entity to delete.
	 * @param {{
	 *     timeout: number=,
	 *     ttl: number=,
	 *     repeatRequest: number=,
	 *     headers: Object<string, string>=,
	 *     cache: boolean=,
	 *     withCredentials: boolean=
	 * }=} options Request options. See the documentation of the HTTP agent for
	 *     more details.
	 * @return {Promise<Response>} A promise that will resolve to the server's
	 *         response.
	 */
	delete(resource, id, options = {}) {}
}
