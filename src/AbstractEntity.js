
import RestClient from './RestClient';

/**
 * Symbols for representing the private fields in the entity.
 *
 * @type {Object<string, symbol>}
 */
const PRIVATE = Object.freeze({
	restClient: Symbol('restClient'),
	parentEntity: Symbol('parentEntity')
});

/**
 * The base class for typed REST API entities. Usage of typed entities may be
 * optional and is dependant on the specific implementation of the REST API
 * client.
 */
export default class AbstractEntity {
	/**
	 * Initializes the entity.
	 *
	 * @param {RestClient} restClient REST API client.
	 * @param {Object<string, *>} data Entity data, which will be directly
	 *        assigned to the entity's fields.
	 * @param {?AbstractEntity=} parentEntity The entity within which the
	 *        resource containing this entity is located. Can be set to null if
	 *        this entity belongs to a top-level resource without a parent.
	 */
	constructor(restClient, data, parentEntity = null) {
		if (!(restClient instanceof RestClient)) {
			throw new TypeError('The rest client must be a RestClient ' +
					`instance, ${restClient} provided`);
		}

		Object.assign(this, data);

		/**
		 * The REST API client to use to communicate with the REST API.
		 *
		 * @type {RestClient}
		 */
		this[PRIVATE.restClient] = restClient;

		/**
		 * The entity within which the resource containing this entity is
		 * located. Can be set to null if this entity belongs to a top-level
		 * resource without a parent.
		 *
		 * @type {?AbstractEntity}
		 */
		this[PRIVATE.parentEntity] = parentEntity;
	}

	/**
	 * Returns the name of the REST API resource containing this entity. The
	 * resource name does not have to match the URI path fragment in the REST
	 * API identifying the resource, depending on the REST API client's
	 * implementation.
	 *
	 * @return {string} The name of the REST API resource containing this
	 *         entity.
	 */
	static get resourceName() {
		throw new Error('The resourceName getter is abstract and must be ' +
				'overridden');
	}

	/**
	 * Returns the name of the field of this entity that contains the entity's
	 * primary key (ID).
	 *
	 * @return {string} The name of the field containing the entity's ID.
	 */
	static get idFieldName() {
		throw new Error('The idFieldName getter is abstract and must be ' +
				'overridden');
	}

	/**
	 * The flag specifying whether the REST API client should return only the
	 * response body (processed into entity/entities) instead of the complete
	 * response object.
	 *
	 * This is useful if all useful information outside the response body has
	 * been processed by response post-processors, or only the response body
	 * contains any useful data.
	 *
	 * @return {boolean} The flag specifying whether the REST client should
	 *         return only the response body instead of the response object.
	 */
	static get inlineResponseBody() {
		return false;
	}

	/**
	 * Returns the direct parent entity of this entity. The parent entity
	 * contains the REST resource from which this entity originates. The getter
	 * returns {@code null} if this entity's resource is a top-level resource
	 * without a parent.
	 *
	 * @return {?AbstractEntity} The direct parent entity of this entity.
	 */
	get parentEntity() {
		return this[PRIVATE.parentEntity];
	}

	/**
	 * Retrieves the entities within the REST API resource identified by this
	 * entity class according to the provided parameters.
	 * 
	 * @param {RestClient} restClient The REST API client using which the
	 *        request should be made.
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	static list(restClient, parameters = {}, options = {}) {
		return restClient.list(this, parameters, options);
	}

	/**
	 * Retrieves the specified entity or entities from the REST API resource
	 * identified by this entity class.
	 * 
	 * @param {RestClient} restClient The REST API client using which the
	 *        request should be made.
	 * @param {(number|string|(number|string)[])} id The ID(s) identifying the
	 *        entity or group of entities to retrieve.
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	static get(restClient, id, parameters = {}, options = {}) {
		return restClient.get(this, id, parameters, options);
	}

	/**
	 * Creates a new entity in the REST API resource identifying by this entity
	 * class using the provided data.
	 *
	 * @param {RestClient} restClient The REST API client using which the
	 *        request should be made.
	 * @param {Object<string, *>} data The entity data.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	static create(restClient, data, options = {}) {
		let instance = new this(restClient, data);
		return instance.create(options);
	}

	/**
	 * Deletes the specified entity or entities from the REST API resource
	 * identified by this entity class.
	 *
	 * @param {RestClient} restClient The REST API client using which the
	 *        request should be made.
	 * @param {(number|string|(number|string)[])} id The ID(s) identifying the
	 *        entity or group of entities to retrieve.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	static delete(restClient, id, options = {}) {
		return restClient.delete(this, id, options);
	}

	/**
	 * Retrieves the entities within the specified sub-resource of this
	 * entity's resources according to the provided parameters.
	 *
	 * @param {function(
	 *            new: AbstractEntity,
	 *            RestClient,
	 *            Object<string, *>
	 *        )} subResource The class identifying the resource of the REST API
	 *        resources within this entity.
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	list(subResource, parameters = {}, options = {}) {
		let client = this[PRIVATE.restClient];
		return client.list(subResource, parameters, options, this);
	}

	/**
	 * Retrieves the specified entity/entities from the specified sub-resource
	 * of this entity's resources.
	 *
	 * @param {function(
	 *            new: AbstractEntity,
	 *            RestClient,
	 *            Object<string, *>
	 *        )} subResource The class identifying the resource of the REST API
	 *        resources within this entity.
	 * @param {(number|string|(number|string)[])} id The ID(s) identifying the
	 *        entity or group of entities to retrieve.
	 * @param {Object<string, (number|string|(number|string)[])>=} parameters
	 *        The additional parameters to send to the server with the request
	 *        to configure the server's response.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	get(subResource, id, parameters = {}, options = {}) {
		let client = this[PRIVATE.restClient];
		return client.get(subResource, id, parameters, options, this);
	}

	/**
	 * Patches the state of this entity using the provided data. The method
	 * first patches the state of this entity in the REST API resource, and,
	 * after a successful update, then the method patches the state of this
	 * entity instance.
	 *
	 * @param {Object<string, *>} data The data with which this entity should
	 *        be patched.
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	patch(data, options = {}) {
		let resource = this.constructor;
		let id = this[resource.idFieldName];
		let client = this[PRIVATE.restClient];
		return client.patch(resource, id, data, options).then((response) => {
			Object.assign(this, data);
			return response;
		});
	}

	/**
	 * Replaces this entity in the REST API resource with this entity's current
	 * state.
	 *
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	replace(options = {}) {
		let id = this[this.constructor.idFieldName];
		let client = this[PRIVATE.restClient];
		return client.replace(this.constructor, id, this, options);
	}

	/**
	 * Creates this entity in the REST API resource it belongs to.
	 *
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	create(options = {}) {
		let client = this[PRIVATE.restClient];
		return client.create(this.constructor, this, options);
	}

	/**
	 * Deletes this entity from its resource.
	 *
	 * @param {{
	 *            timeout: number=,
	 *            ttl: number=,
	 *            repeatRequest: number=,
	 *            headers: Object<string, string>=,
	 *            cache: boolean=,
	 *            withCredentials: boolean=
	 *        }=} options Request options. See the documentation of the HTTP
	 *        agent for more details.
	 * @return {Promise<?(Response|AbstractEntity|AbstractEntity[])>} A promise
	 *         that will resolve to the server's response, or the entity,
	 *         entities or {@code null} constructed from the response body if
	 *         this entity class has the {@code inlineResponseBody} flag set.
	 */
	delete(options = {}) {
		let id = this[this.constructor.idFieldName];
		return this.constructor.delete(this[PRIVATE.restClient], id, options);
	}
}
