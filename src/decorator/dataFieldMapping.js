
/**
 * Decorator for setting the static {@code dataFieldMapping} property of an
 * entity class, which specifies the automatic mapping of raw entity data to
 * entity properties.
 *
 * @param {string} dataFieldMapping The descriptor of how the entity data
 *        should be mapped to the entity's properties.
 * @return {function(function(
 *             new: AbstractEntity,
 *             RestClient,
 *             Object<string, *>,
 *             ?AbstractEntity=
 *         ))} Callback that sets the data field mapping on the provided entity
 *         class.
 */
export default (dataFieldMapping) => {
	return (classConstructor) => {
		Object.defineProperty(classConstructor, 'dataFieldMapping', {
			value: dataFieldMapping
		});
	};
};
