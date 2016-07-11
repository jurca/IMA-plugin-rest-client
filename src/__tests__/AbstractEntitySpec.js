
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
	let restClientCallbacks;
	
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
			if (restClientCallbacks.patch) {
				restClientCallbacks.patch(data);
			}
			return Promise.resolve(restResult);
		}

		replace(resource, id, data, options = {}, parentEntity = null) {
			calledClientMethods.replace = true;
			if (restClientCallbacks.replace) {
				restClientCallbacks.replace(data);
			}
			return Promise.resolve(restResult);
		}

		create(resource, data, options = {}, parentEntity = null) {
			calledClientMethods.create = true;
			if (restClientCallbacks.create) {
				restClientCallbacks.create(data);
			}
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
		restClientCallbacks = {
			create: null,
			patch: null,
			replace: null
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

	fdescribe('serialization', () => {
		let serializeCalled = false;

		class TransformingEntity extends Entity {
			serialize(data = this) {
				serializeCalled = true;
				let serialized = super.serialize(data);
				serialized.serialized = true;
				delete serialized.dynamic;
				delete serialized.onlyDynamic;
				return serialized;
			}

			deserialize(data) {
				let clone = Object.assign({}, data);
				clone.dynamic = true;
				delete clone.serialized;
				return clone;
			}
		}

		beforeEach(() => {
			serializeCalled = false;
		});

		it('should deserialize entity data upon creation', () => {
			let entity = new TransformingEntity(restClient, {
				test: 'tested',
				serialized: true
			});
			expect(Object.assign({}, entity)).toEqual({
				test: 'tested',
				dynamic: true
			});
		});
		
		it('should create entities from deserialized data when using static ' +
				'create()', (done) => {
			let createCalled = false;
			restClientCallbacks.create = (data) => {
				createCalled = true;
				expect(data).toEqual({
					test: 'testing',
					serialized: true
				});
			};
			restResult = new TransformingEntity(restClient, {
				test: 'testing',
				serialized: true
			});
			TransformingEntity.create(restClient, {
				test: 'testing',
				dynamic: true
			}).then((entity) => {
				expect(serializeCalled).toBeTruthy();
				expect(Object.assign({}, entity)).toEqual({
					test: 'testing',
					dynamic: true
				});
				done();
			});
		});

		it('should use deserialized entity data in the patch method',
				(done) => {
			let entity = new TransformingEntity(restClient, {
				test: 'testing',
				testing: 'test',
				serialized: true
			});
			let patchCalled = false;
			restClientCallbacks.patch = (data) => {
				patchCalled = true;
				expect(data).toEqual({
					test: 'tested',
					test2: 1,
					serialized: true
				});
			};
			entity.patch({
				test: 'tested',
				test2: 1,
				onlyDynamic: true
			}).then(() => {
				expect(patchCalled).toBeTruthy();
				expect(Object.assign({}, entity)).toEqual({
					test: 'tested',
					testing: 'test',
					dynamic: true,
					onlyDynamic: true,
					test2: 1
				});
				done();
			});
		});

		it('should use deserialized entity data in the replace method',
				(done) => {
			let entity = new TransformingEntity(restClient, {
				test: 'testing',
				testing: 'test',
				serialized: true
			});
			let replaceCalled = false;
			restClientCallbacks.replace = (data) => {
				replaceCalled = true;
				expect(data).toEqual({
					test: 'tested',
					testing: 'test',
					serialized: true
				});
			};
			entity.test = 'tested';
			entity.replace().then(() => {
				expect(replaceCalled).toBeTruthy();
				expect(Object.assign({}, entity)).toEqual({
					test: 'tested',
					testing: 'test',
					dynamic: true
				});
				done();
			});
		});

		it('should use deserialized entity data in the dynamic create method',
				(done) => {
			let entity = new TransformingEntity(restClient, {
				test: 'testing',
				testing: 'test',
				serialized: true
			});
			let createCalled = false;
			restClientCallbacks.create = (data) => {
				createCalled = true;
				expect(data).toEqual({
					test: 'testing',
					testing: 'test',
					serialized: true
				});
			};
			entity.create().then(() => {
				expect(createCalled).toBeTruthy();
				expect(Object.assign({}, entity)).toEqual({
					test: 'testing',
					testing: 'test',
					dynamic: true
				});
				done();
			});
		});

	});
	
});
