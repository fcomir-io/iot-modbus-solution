const db_connection = require("../db.config.js");

/** Data */
// GET - All Available Data
const getAllData = (request, response) => {
  db_connection.query('SELECT * FROM public.data ORDER BY entry_id DESC ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// GET - All Available Data WHERE Timestamp >= X
const getRecentData = (request, response) => {
  const timestamp = parseInt(request.params.timestamp)
  // WHERE timestamp >= $1 
  // Formato de timestamp ?!?

  db_connection.query('SELECT * FROM data ORDER BY entry_id DESC ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// GET - All Available Data of Device with Device Id
const getAllDataOfDevice = (request, response) => {
  const id = parseInt(request.params.id)
  
  db_connection.query('SELECT * FROM data WHERE device_id = $1 ORDER BY entry_id DESC ', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
 
// GET - All Available Data of Device with Device Id WHERE Timestamp >= X
const getRecentDataOfDevice = (request, response) => {
  console.log(request.params)
  const id = parseInt(request.params.id)
  const timestamp = request.params.timestamp
  // WHERE timestamp >= $1 
  // Formato de timestamp ?!?

  db_connection.query('SELECT * FROM data WHERE device_id = $1 AND timestamp >= $2 ORDER BY entry_id DESC ', [id, timestamp], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

/** EXPORT API Functions */
module.exports = {
  /** Data */
  getAllData,
  getRecentData,
  getAllDataOfDevice,
  getRecentDataOfDevice
}