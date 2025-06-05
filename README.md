# Gene Ontology database cross references

`@geneontology/dbxrefs`

## Description

This is a simple package using the Gene Ontology dbxrefs ([json](http://current.geneontology.org/metadata/db-xrefs.json) | [yaml](http://current.geneontology.org/metadata/db-xrefs.yaml)) to translate CURIE into URLs.

## Note

This is different from CURIE <-> IRI conversion used in the Semantic Web to provide universal and unique identifiers over the web, please refer to: [prefixcommons/biocontext](https://github.com/prefixcommons/biocontext) or [curie-util-py](https://github.com/geneontology/curie-util-py).

## API

### init()

Initializes the dbxrefs package. This should be called before using any other functions.

Returns a promise that resolves when the initialization is complete. If the initialization was successful, the promise resolves to the complete list of dbxrefs. If there was an error, the promise resolves to `undefined`

### isReady()

Returns `true` if the dbxrefs package has been successfully initialized, `false` otherwise.

### hasError()

Returns `true` if there was an error during initialization, `false` otherwise.

### getUrl(database, entityType, id)

Returns the URL for a given database, entity type, and ID. If the `entityType` parameter is `undefined`, the first entity type for the given database is used.

If a matching database or entity type cannot be found in the dbxref list, the function returns `undefined`.

### getDBXrefs()

Returns the complete list of dbxrefs as an array of objects.

## Contact

If you have questions regarding dbxrefs, please address them to the [GO helpdesk](http://help.geneontology.org/).
