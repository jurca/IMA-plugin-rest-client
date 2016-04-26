
import AbstractEntity from '../AbstractEntity';
import AbstractRestClient from '../AbstractRestClient';

describe('AbstractEntity', () => {
	
	class Entity extends AbstractEntity {
		static get resourceName() {
			return 'foo';
		}

		static get idFieldName() {
			return 'id';
		}

		static get inlineResponseBody() {
			return true;
		}
	}
	
	let restResult;
	let calledClientMethods;
	let restClient;
	
	class RestClient extends AbstractRestClient {
		list(resource, parameters = {}, options = {}, parentEntity = null) {
			calledClientMethods.list = true;
			return Promise.resolve(restResult);
		}

		get(resource, id, parameters = {}, options = {}, parentEntity = null) {
			calledClientMethods.get = true;
			return Promise.resolve(restResult);
		}

		patch(resource, id, data, options = {}, parentEntity = null) {
			calledClientMethods.patch = true;
			return Promise.resolve(restResult);
		}

		replace(resource, id, data, options = {}, parentEntity = null) {
			calledClientMethods.replace = true;
			return Promise.resolve(restResult);
		}

		create(resource, data, options = {}, parentEntity = null) {
			calledClientMethods.create = true;
			return Promise.resolve(restResult);
		}

		delete(resource, id, options = {}, parentEntity = null) {
			calledClientMethods.delete = true;
			return Promise.resolve(restResult);
		}
	}
	
	beforeEach(() => {
		restResult = null;
		calledClientMethods = {
			list: false,
			get: false,
			patch: false,
			replace: false,
			create: false,
			delete: false
		};
		restClient = new RestClient(null, null, null, [], []);
	});
	
	it('should reject invalid rest client constructor argument', () => {
		expect(() => {
			new Entity(null, {});
		}).toThrowError(TypeError);
		
		new Entity(restClient, {});
	});
	
	it('should assign data to its instance', () => {
		let template = new Entity(restClient, {});
		template.id = 12;
		template.test = true;
		expect(new Entity(restClient, {
			id: 12,
			test: true
		})).toEqual(template);
	});

	it('should keep reference to its parent entity', () => {
		expect((new Entity(restClient, {}, new Entity(restClient, {
			id: 'yup'
		}))).parentEntity).toEqual(new Entity(restClient, {
			id: 'yup'
		}));
	});

	it('should allow listing of entities', (done) => {
		restResult = 123;
		return Entity.list(restClient).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.list).toBeTruthy();
			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow retrieving a single entity', (done) => {
		restResult = 234;
		return Entity.get(restClient, 1).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.get).toBeTruthy();
			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow creating new entities', (done) => {
		restResult = 345;
		return Entity.create(restClient, {}).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.create).toBeTruthy();

			calledClientMethods.create = false;
			restResult = 456;
			let entity = new Entity(restClient, {});
			return entity.create();
		}).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.create).toBeTruthy();

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow deleting entities', (done) => {
		restResult = 567;
		return Entity.delete(restClient, 1).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.delete).toBeTruthy();

			calledClientMethods.delete = false;
			restResult = 678;
			let entity = new Entity(restClient, { id: 1 });
			return entity.delete();
		}).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.delete).toBeTruthy();

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow listing of sub-resource entities', (done) => {
		restResult = 789;
		let entity = new Entity(restClient, {});
		entity.list(Entity).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.list).toBeTruthy();

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow fetching of single entities', (done) => {
		restResult = 890;
		let entity = new Entity(restClient, {});
		entity.get(Entity, 1).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.get).toBeTruthy();

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow patching entities', (done) => {
		restResult = 901;
		let entity = new Entity(restClient, { id: 1 });
		entity.patch({ id: 2, test: 'yay' }).then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.patch).toBeTruthy();

			expect(entity).toEqual(new Entity(restClient, {
				id: 2,
				test: 'yay'
			}));

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should allow replacing entities', (done) => {
		restResult = 12;
		let entity = new Entity(restClient, {});
		entity.replace().then((response) => {
			expect(response).toBe(restResult);
			expect(calledClientMethods.replace).toBeTruthy();

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});
	
});
