
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
	 * @param {*} parentEntity The parent entity within which the specified
	 *        resource will be manipulated. It may be needed to determine the
	 *        parent resource from the entity. Use {@code null} if the
	 *        specified resource is a top-level resource within the REST API.
	 * @param {*} resource The identifier of the REST resource.
	 * @param {?(number|string|(number|string)[])} id Unique ID(s) of a single
	 *        entity or a group of entities to access within the specified
	 *        resource, or {@code null} if the resource itself should be
	 *        accessed.
	 * @param {Object<string, (number|string)>} parameters Additional
	 *        parameters to use to generate the access URL.
	 * @param {?Object<string, *>} serverConfiguration Configuration of the
	 *        REST client as provided by the server, or {@code null} if no
	 *        server-provided configuration is being used with the current REST
	 *        client.
	 * @return {string} The generated URL for accessing the specified resource.
	 */
	createLink(parentEntity, resource, id, parameters, serverConfiguration) {}
}
