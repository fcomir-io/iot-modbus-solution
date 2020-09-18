const db_connection = require("../db.config.js");

/** Devices */
// GET - All Devices
const getDevices = (request, response) => {
  db_connection.query('SELECT * FROM devices ORDER BY device_id DESC ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// GET - Devices with no associated Testbench
const getDevicesWithNoAssociatedTestbench = (request, response) => {
  const id = parseInt(request.params.id)

  //devices.device_id, devices.host, devices.description
  db_connection.query('SELECT * FROM devices, testbench_device WHERE device_id = $1 AND device_id != associated_device_id ORDER BY device_id DESC ', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


// GET - Device by Id
const getDeviceById = (request, response) => {
  const id = parseInt(request.params.id)

  db_connection.query('SELECT * FROM devices WHERE device_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// POST - New Device
const createDevice = (request, response) => {
  const { host, description } = request.body

  console.log("Body:", request.body)
  console.log("host:", host)
  console.log("description:", description)
  
  db_connection.query('INSERT INTO devices(host, description) VALUES ($1, $2) RETURNING device_id', [host, description], (error, result) => {
    if (error) {
      throw error
    }
    
    console.log("result:", result)
    const insertId = result.rows[0].device_id
    console.log("result.device_id:", result.rows[0].device_id)
    response.status(201).send(`Device added with ID: ${insertId}`)
  })
}

// PUT - Update Device
const updateDevice = (request, response) => {
  const id = parseInt(request.params.id)
  const { host, description } = request.body

  console.log("Body:", request.body)
  console.log("host:", host)
  console.log("description:", description)

  db_connection.query('UPDATE devices SET host = $1, description = $2 WHERE device_id = $3', [host, description, id], (error, result) => {
    if (error) {
      throw error
    }
    
    console.log("result:", result)
    response.status(200).send(`Device modified with ID: ${id}`)
  })
}

// DELETE - Delete Device
const deleteDeviceById = (request, response) => {
  const id = parseInt(request.params.id)

  db_connection.query('DELETE FROM devices WHERE device_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Device with ID: ${id} deleted`)
  })
}

// DELETE - Empty table Devices
const deleteAllDevices = (request, response) => {
  db_connection.query('DELETE FROM devices', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Table of Devices completely emptied!!!`)
  })
}

/** EXPORT API Functions */
module.exports = {
  /** Devices */
  getDevices,
  getDevicesWithNoAssociatedTestbench,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDeviceById,
  deleteAllDevices
}