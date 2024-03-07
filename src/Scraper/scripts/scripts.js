function getResultFromRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      resolve(request.result)
    }
  })
}

async function getDB(nameDB) {
  let request = indexedDB.open(nameDB)
  return await getResultFromRequest(request)
}

async function readAllKeyValuePairs(nameDB, objectDB) {
  const db = await getDB(nameDB)
  const objectStore = db.transaction(objectDB).objectStore(objectDB)
  const request = objectStore.getAll()
  return await getResultFromRequest(request)
}
