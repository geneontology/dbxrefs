const DB_XREFS_URL = "https://current.geneontology.org/metadata/db-xrefs.json";

// Derived from https://github.com/geneontology/go-site/blob/d911c0ad30dbb2ec333e9d0f63804c8797ed79c2/metadata/db-xrefs.schema.yaml
interface EntityType {
  type_id: string;
  type_name: string;
  id_syntax?: string;
  url_syntax?: string;
  example_id?: string;
  example_url?: string;
}
interface DBXref {
  database: string;
  synonyms?: string[];
  name: string;
  description?: string;
  rdf_uri_prefix?: string;
  generic_urls: string[];
  entity_types?: EntityType[];
}

let dbxrefs: DBXref[] = [];
let dbReady = false;
let dbError = false;

function log_warning(...args: unknown[]) {
  console.warn("[@geneontology/dbxrefs]", ...args);
}

/**
 *
 * @param database valid database name, please refer to the GO db-xrefs.yaml
 * @param entityType e.g. gene or protein; if undefined, will look for the first entity described in dbxrefs
 * @param id ID of the entity to look for
 */
function getURL(database: string, entityType: string | undefined, id: string) {
  const db = dbxrefs.find(
    (elt) =>
      elt.database.toLowerCase() == database.toLowerCase() ||
      (elt.synonyms && elt.synonyms.includes(database)),
  );
  if (db === undefined) {
    log_warning(`Database not found: ${database}`);
    return undefined;
  }

  let entity: EntityType | undefined;
  if (db.entity_types) {
    if (entityType) {
      entity = db.entity_types.find(
        (elt) => elt.type_name.toLowerCase() == entityType.toLowerCase(),
      );
    } else {
      entity = db.entity_types[0];
    }
  }
  if (entity === undefined) {
    log_warning(`Entity type ${entityType} not found in database ${database}`);
    return undefined;
  }

  if (!entity.url_syntax) {
    log_warning(
      `No URL syntax defined for entity type ${entityType} in database ${database}`,
    );
    return undefined;
  }
  return entity.url_syntax.replace("[example_id]", id);
}

function isReady() {
  return dbReady;
}

function hasError() {
  return dbError;
}

function getDBXrefs() {
  return dbxrefs;
}

/**
 * Initializes the dbxrefs database by fetching the database file from the GO website.
 *
 * This function should be called once at the start of the application before calls to getURL or
 * getDBXrefs.
 */
async function init() {
  try {
    const response = await fetch(DB_XREFS_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch dbxrefs: ${response.status} ${response.statusText}`,
      );
    }
    dbxrefs = (await response.json()) as DBXref[];
    dbReady = true;
    dbError = false;
    return dbxrefs;
  } catch (error) {
    log_warning(error);
    dbReady = true;
    dbError = true;
    return undefined;
  }
}

export { init, getURL, isReady, hasError, getDBXrefs };
