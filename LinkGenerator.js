
/**
 * Generator of HTTP(S) URLs to use for accessing or manipulating the resources
 * within the accessed REST API.
 *
 * @interface
 */
export default class LinkGenerator {
	/**
	 * Generates the URL to use for accessing or manipulating the specified
	 * resource.
	 *
	 * @param {*} resource The identifier of the REST resource.
	 * @param {?(number|string)} id Unique ID of a single entity to access
	 *        within the specified resource, or {@code null} if the resource
	 *        itself should be accessed.
	 * @param {Object<string, (number|string)>} parameters Additional
	 *        parameters to use to generate the access URL.
	 * @param {?Object<string, *>} serverConfiguration Configuration of the
	 *        REST client as provided by the server, or {@code null} if no
	 *        server-provided configuration is being used with the current REST
	 *        client.
	 * @return {string} The generated URL for accessing the specified resource.
	 */
	createLink(resource, id, parameters, serverConfiguration) {}
}
