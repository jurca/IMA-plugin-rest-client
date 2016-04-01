
import AbstractRestClient from '../AbstractRestClient';
import Configurator from '../Configurator';
import LinkGenerator from '../LinkGenerator';
import Request from '../Request';
import RequestPreProcessor from '../RequestPreProcessor';
import Response from '../Response';
import ResponsePostProcessor from '../ResponsePostProcessor';

describe('AbstractRestClient', () => {

	class DummyRestClient extends AbstractRestClient {}

	it('should follow the correct call chain', (done) => {
		let configuratorCalled = false;
		let linkGeneratorCalled = false;
		let preProcessor1Called = false;
		let preProcessor2Called = false;
		let agentCalled = false;
		let postProcessor1Called = false;
		let postProcessor2Called = false;

		let agentMock = {
			get(url, data, options) {
				expect(preProcessor2Called).toBe(true);
				expect(agentCalled).toBe(false);
				agentCalled = true;

				expect(url).toBe('http://foo.bar/baz?id=yup');
				// all query parameters are processed by the link generator
				expect(data).toEqual({});
				expect(options).toEqual({
					headers: {
						'Custom-Header': 'stuff'
					},
					withCredentials: true
				});

				return Promise.resolve({
					status: 206,
					body: { stuff: 3.141592653598 },
					params: {
						method: 'GET',
						url,
						transformedUrl: url,
						data,
						headers: options.headers
					},
					headers: {
						'Other-Header': 'other stuff'
					},
					cached: false
				});
			}
		};

		let configuratorMock = new (class extends Configurator {
			getConfiguration() {
				expect(configuratorCalled).toBe(false);
				configuratorCalled = true;
				return Promise.resolve({ configGenerated: true });
			}
		});

		let linkGeneratorMock = new (class extends LinkGenerator {
			createLink(parentEntity, resource, id, parameters, serverConfig) {
				expect(configuratorCalled).toBe(true);
				expect(linkGeneratorCalled).toBe(false);
				linkGeneratorCalled = true;

				expect(parentEntity).toEqual({ stuff: 'yeah', someId: 321 });
				expect(resource).toBe('foo');
				expect(id).toBe(123);
				expect(parameters).toEqual({ bar: 'baz', two: 2 });
				expect(serverConfig).toEqual({ configGenerated: true });

				return 'https+something://foo.bar/baz/xyz';
			}
		});

		let preProcessorMock1 = new (class extends RequestPreProcessor {
			process(request) {
				expect(linkGeneratorCalled).toBe(true);
				expect(preProcessor1Called).toBe(false);
				preProcessor1Called = true;

				expect(request.parentEntity).toEqual({
					stuff: 'yeah',
					someId: 321
				});
				expect(request.resource).toBe('foo');
				expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
				expect(request.method).toBe('GET');
				expect(request.url).toBe('https+something://foo.bar/baz/xyz');
				expect(request.data).toBeNull();
				expect(request.headers).toEqual({
					'Custom-Header': 'stuff'
				});
				expect(request.options).toEqual({
					withCredentials: true
				});
				expect(request.serverConfiguration).toEqual({
					configGenerated: true
				});

				return new Request(Object.assign({}, request, {
					url: 'http://foo.bar/baz?id=nope'
				}));
			}
		});

		let preProcessorMock2 = new (class extends RequestPreProcessor {
			process(request) {
				expect(preProcessor1Called).toBe(true);
				expect(preProcessor2Called).toBe(false);
				preProcessor2Called = true;

				expect(request.parentEntity).toEqual({
					stuff: 'yeah',
					someId: 321
				});
				expect(request.resource).toBe('foo');
				expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
				expect(request.method).toBe('GET');
				expect(request.url).toBe('http://foo.bar/baz?id=nope');
				expect(request.data).toBeNull();
				expect(request.headers).toEqual({
					'Custom-Header': 'stuff'
				});
				expect(request.options).toEqual({
					withCredentials: true
				});
				expect(request.serverConfiguration).toEqual({
					configGenerated: true
				});

				return new Request(Object.assign({}, request, {
					url: 'http://foo.bar/baz?id=yup'
				}));
			}
		});

		let postProcessorMock1 = new (class extends ResponsePostProcessor {
			process(response) {
				expect(agentCalled).toBe(true);
				expect(postProcessor1Called).toBe(false);
				postProcessor1Called = true;

				expect(response.status).toBe(206);
				expect(response.headers).toEqual({
					'Other-Header': 'other stuff'
				});
				expect(response.body).toEqual({ stuff: 3.141592653598 });
				expect(response.cached).toBe(false);
				let request = response.request;
				expect(request.parentEntity).toEqual({
					stuff: 'yeah',
					someId: 321
				});
				expect(request.resource).toBe('foo');
				expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
				expect(request.method).toBe('GET');
				expect(request.url).toBe('http://foo.bar/baz?id=yup');
				expect(request.data).toBeNull();
				expect(request.headers).toEqual({
					'Custom-Header': 'stuff'
				});
				expect(request.options).toEqual({
					withCredentials: true
				});
				expect(request.serverConfiguration).toEqual({
					configGenerated: true
				});
				
				return new Response(Object.assign({}, response, {
					status: 200
				}));
			}
		});
		
		let postProcessorMock2 = new (class extends ResponsePostProcessor {
			process(response) {
				expect(postProcessor1Called).toBe(true);
				expect(postProcessor2Called).toBe(false);
				postProcessor2Called = true;

				expect(response.status).toBe(200);
				expect(response.headers).toEqual({
					'Other-Header': 'other stuff'
				});
				expect(response.body).toEqual({ stuff: 3.141592653598 });
				expect(response.cached).toBe(false);
				let request = response.request;
				expect(request.parentEntity).toEqual({
					stuff: 'yeah',
					someId: 321
				});
				expect(request.resource).toBe('foo');
				expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
				expect(request.method).toBe('GET');
				expect(request.url).toBe('http://foo.bar/baz?id=yup');
				expect(request.data).toBeNull();
				expect(request.headers).toEqual({
					'Custom-Header': 'stuff'
				});
				expect(request.options).toEqual({
					withCredentials: true
				});
				expect(request.serverConfiguration).toEqual({
					configGenerated: true
				});
				
				return new Response(Object.assign({}, response, {
					status: 203
				}));
			}
		});

		let client = new DummyRestClient(
			agentMock,
			configuratorMock,
			linkGeneratorMock,
			[preProcessorMock1, preProcessorMock2],
			[postProcessorMock1, postProcessorMock2]
		);

		client.get('foo', 123, { bar: 'baz', two: 2 }, {
			headers: {
				'Custom-Header': 'stuff'
			},
			withCredentials: true
		}, { stuff: 'yeah', someId: 321 }).then((response) => {
			expect(postProcessor2Called).toBe(true);

			expect(response.status).toBe(203);
			expect(response.headers).toEqual({
				'Other-Header': 'other stuff'
			});
			expect(response.body).toEqual({ stuff: 3.141592653598 });
			expect(response.cached).toBe(false);
			let request = response.request;
			expect(request.parentEntity).toEqual({
				stuff: 'yeah',
				someId: 321
			});
			expect(request.resource).toBe('foo');
			expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
			expect(request.method).toBe('GET');
			expect(request.url).toBe('http://foo.bar/baz?id=yup');
			expect(request.data).toBeNull();
			expect(request.headers).toEqual({
				'Custom-Header': 'stuff'
			});
			expect(request.options).toEqual({
				withCredentials: true
			});
			expect(request.serverConfiguration).toEqual({
				configGenerated: true
			});
			
			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should follow the correct call chain when no configurator, ' +
			'pre-processors, or post-processors are set', (done) => {
		let linkGeneratorCalled = false;
		let agentCalled = false;

		let agentMock = {
			get(url, data, options) {
				expect(linkGeneratorCalled).toBe(true);
				expect(agentCalled).toBe(false);
				agentCalled = true;

				expect(url).toBe('https+something://foo.bar/baz/xyz');
				// all query parameters are processed by the link generator
				expect(data).toEqual({});
				expect(options).toEqual({
					headers: {
						'Custom-Header': 'stuff'
					},
					withCredentials: true
				});

				return Promise.resolve({
					status: 200,
					body: { stuff: 'yup' },
					params: {
						method: 'GET',
						url,
						transformedUrl: url,
						data,
						headers: options.headers
					},
					headers: {
						'Other-Header': 'other stuff'
					},
					cached: false
				});
			}
		};

		let linkGeneratorMock = new (class extends LinkGenerator {
			createLink(parentEntity, resource, id, parameters, serverConfig) {
				expect(linkGeneratorCalled).toBe(false);
				linkGeneratorCalled = true;

				expect(parentEntity).toEqual({ stuff: 'yeah', someId: 321 });
				expect(resource).toBe('foo');
				expect(id).toBe(123);
				expect(parameters).toEqual({ bar: 'baz', two: 2 });
				expect(serverConfig).toBeNull();

				return 'https+something://foo.bar/baz/xyz';
			}
		});

		let client = new DummyRestClient(
			agentMock,
			null,
			linkGeneratorMock,
			[],
			[]
		);

		client.get('foo', 123, { bar: 'baz', two: 2 }, {
			headers: {
				'Custom-Header': 'stuff'
			},
			withCredentials: true
		}, { stuff: 'yeah', someId: 321 }).then((response) => {
			expect(agentCalled).toBe(true);

			expect(response.status).toBe(200);
			expect(response.headers).toEqual({
				'Other-Header': 'other stuff'
			});
			expect(response.body).toEqual({ stuff: 'yup' });
			expect(response.cached).toBe(false);
			let request = response.request;
			expect(request.parentEntity).toEqual({
				stuff: 'yeah',
				someId: 321
			});
			expect(request.resource).toBe('foo');
			expect(request.parameters).toEqual({ bar: 'baz', two: 2 });
			expect(request.method).toBe('GET');
			expect(request.url).toBe('https+something://foo.bar/baz/xyz');
			expect(request.data).toBeNull();
			expect(request.headers).toEqual({
				'Custom-Header': 'stuff'
			});
			expect(request.options).toEqual({
				withCredentials: true
			});
			expect(request.serverConfiguration).toBeNull();

			done();
		}).catch((error) => {
			fail(error.stack);
			done();
		});
	});

	it('should call configurator only once', () => {});

	it('should allow preProcessors to generate a response', () => {});

	it('should execute a GET request when list() is called', () => {});
	it('should execute a GET request when get() is called', () => {});
	it('should execute a GET request when patch() is called', () => {});
	it('should execute a GET request when replace() is called', () => {});
	it('should execute a GET request when create() is called', () => {});
	it('should execute a GET request when delete() is called', () => {});

});
