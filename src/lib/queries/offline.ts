// DECISION: opt-in offline mode for working on a network where MongoDB is unreachable.
// Set OFFLINE_DATA=true to serve the seed content instead of querying Payload. It is off by
// default, so production and normal development always read from the database.
export const isOffline = () => process.env.OFFLINE_DATA === 'true'
