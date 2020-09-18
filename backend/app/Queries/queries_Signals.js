const db_connection = require("../db.config.js");

/** Signals */
// GET - All Signals
const getSignals = (request, response) => {
  db_connection.query('SELECT * FROM signals ORDER BY signal_id DESC ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// GET - Signal by Id
const getSignalById = (request, response) => {
  const id = parseInt(request.params.id)

  db_connection.query('SELECT * FROM signals WHERE signal_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// POST - New Signal
const createSignal = (request, response) => {
  const { register_address, name, type, description } = request.body

  console.log("Body:", request.body)
  console.log("register_address:", register_address)
  console.log("name:", name)
  console.log("type:", type)
  console.log("description:", description)
  
  db_connection.query('INSERT INTO signals(register_address, name, type, description) VALUES ($1, $2, $3, $4) RETURNING signal_id', [register_address, name, type, description], (error, result) => {
    if (error) {
      throw error
    }
    
    console.log("result:", result)
    const insertId = result.rows[0].signal_id
    console.log("result.signal_id:", result.rows[0].signal_id)
    response.status(201).send(`Signal added with ID: ${insertId}`)
  })
}

// PUT - Update Signal
const updateSignal = (request, response) => {
  const id = parseInt(request.params.id)
  const { register_address, name, type, description } = request.body

  console.log("Body:", request.body)
  console.log("register_address:", register_address)
  console.log("name:", name)
  console.log("type:", type)
  console.log("description:", description)

  db_connection.query('UPDATE signals SET register_address = $1, name = $2, type = $3, description = $4 WHERE signal_id = $5', [register_address, name, type, description, id], (error, result) => {
    if (error) {
      throw error
    }
    
    console.log("result:", result)
    response.status(200).send(`Signal modified with ID: ${id}`)
  })
}

// DELETE - Delete Signal
const deleteSignalById = (request, response) => {
  const id = parseInt(request.params.id)

  db_connection.query('DELETE FROM signals WHERE signal_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Signal with ID: ${id} deleted`)
  })
}

// DELETE - Empty table Signals
const deleteAllSignals = (request, response) => {
  db_connection.query('DELETE FROM signals', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Table of Signals completely emptied!!!`)
  })
}

/** EXPORT API Functions */
module.exports = {
  /** Signals */
  getSignals,
  getSignalById,
  createSignal,
  updateSignal,
  deleteSignalById,
  deleteAllSignals
}