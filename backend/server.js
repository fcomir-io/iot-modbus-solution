/** To access .env file */
require('dotenv').config();
/** Express framework */
const express = require('express')
/** To understand JSON objects */
const bodyParser = require('body-parser')
/** REST APIs objects */
const postgreSQL_RestAPI__Testbenches = require('./app/Queries/queries_Testbenches')
const postgreSQL_RestAPI__Devices = require('./app/Queries/queries_Devices')
const postgreSQL_RestAPI__TestbenchDevice = require('./app/Queries/queries_TestbenchDevice')
const postgreSQL_RestAPI__Signals = require('./app/Queries/queries_Signals')
const postgreSQL_RestAPI__DeviceSignals = require('./app/Queries/queries_DeviceSignals')
const postgreSQL_RestAPI__Data = require('./app/Queries/queries_Data')

/** Define  */
const port = process.env.EXPRESS_PORT

/** Start Express application */
const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
/** Enable CORS */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/** Routes */
// Home: '/'
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

/** Access to Test Benches Table */
// GET - Test Benches '/test_benches'
app.get('/test_benches', postgreSQL_RestAPI__Testbenches.getTestBenches)
// GET - Test Bench by ID '/test_bench/{id}'
app.get('/test_bench/:id', postgreSQL_RestAPI__Testbenches.getTestBenchById)
// POST - Create New Test Bench '/test_bench' + JSON body
app.post('/test_bench', postgreSQL_RestAPI__Testbenches.createTestBench)
// PUT - Update Existing Test Bench by ID '/test_bench/{id}' + JSON body
app.put('/test_bench/:id', postgreSQL_RestAPI__Testbenches.updateTestBench)
// DELETE - Delete Test Bench by ID '/test_bench/{id}'
app.delete('/test_bench/:id', postgreSQL_RestAPI__Testbenches.deleteTestBenchById)
// DELETE - Test Benches'
app.delete('/test_benches/empty_table', postgreSQL_RestAPI__Testbenches.deleteAllTestBenches)

/** Access to Devices Table */
// GET - Devices '/devices'
app.get('/devices', postgreSQL_RestAPI__Devices.getDevices)
// GET - Devices with no Testbench associated '/devices/no_test_bench/{id}'
app.get('/devices/no_test_bench/:id', postgreSQL_RestAPI__Devices.getDevicesWithNoAssociatedTestbench)
// GET - Devices by ID '/device/{id}'
app.get('/device/:id', postgreSQL_RestAPI__Devices.getDeviceById)
// POST - Create New Device '/device' + JSON body
app.post('/device', postgreSQL_RestAPI__Devices.createDevice)
// PUT - Update Existing Device by ID '/device/{id}' + JSON body
app.put('/device/:id', postgreSQL_RestAPI__Devices.updateDevice)
// DELETE - Delete Device by ID '/device/{id}'
app.delete('/device/:id', postgreSQL_RestAPI__Devices.deleteDeviceById)
// DELETE - Devices'
app.delete('/devices/empty_table', postgreSQL_RestAPI__Devices.deleteAllDevices)

/** Access to Testbenches-Devices Table ==> Associations between Testbenches and Devices */
// POST - Create New ASSOCIATION ==> ONE Testbench to Device by Device Id '/test_bench/device/{id}' + JSON body
app.post('/test_bench/device/:id', postgreSQL_RestAPI__TestbenchDevice.createAssociation__TestbenchToDevice)
// GET - Devices(s) by Testbench Id '/devices/test_bench/{id}'
app.get('/devices/test_bench/:id', postgreSQL_RestAPI__TestbenchDevice.getDeviceByTestbenchId)
// GET - Testbench by Device Id '/test_bench/device/{id}'
app.get('/test_bench/device/:id', postgreSQL_RestAPI__TestbenchDevice.getTestbenchByDeviceId)
// POST - Create New ASSOCIATION ==> ONE Testbench to Device by ID '/devices_per_testbench/test_bench/{id}' + JSON body
app.post('/devices_per_testbench/test_bench/:id', postgreSQL_RestAPI__TestbenchDevice.createAssociation__DevicesToTestbench)
// DELETE - Clear ASSOCIATION between Testbench and Devices by Testbench ID '/test_benchToSignal/clear_testbench/{id}' + JSON body
app.delete('/devices_per_testbench/clear_testbench/:id', postgreSQL_RestAPI__TestbenchDevice.clearAssociation__DevicesToTestbench)

/** Access to Signals Table */
// GET - Signals '/signals'
app.get('/signals', postgreSQL_RestAPI__Signals.getSignals)
// GET - Signals by ID '/signal/{id}'
app.get('/signal/:id', postgreSQL_RestAPI__Signals.getSignalById)
// POST - Create New Signal '/signal' + JSON body
app.post('/signal', postgreSQL_RestAPI__Signals.createSignal)
// PUT - Update Existing Signal by ID '/signal/{id}' + JSON body
app.put('/signal/:id', postgreSQL_RestAPI__Signals.updateSignal)
// DELETE - Delete Signal by ID '/signal/{id}'
app.delete('/signal/:id', postgreSQL_RestAPI__Signals.deleteSignalById)
// DELETE - Signals'
app.delete('/signals/empty_table', postgreSQL_RestAPI__Signals.deleteAllSignals)

/** Access to Device-Signals Table ==> Associations between Devices and Signals */
// POST - Create New ASSOCIATION ==> MULTIPLE Signals to ONE Device by Device Id '/signals/device/{id}' + JSON body
app.post('/signals/device/:id', postgreSQL_RestAPI__DeviceSignals.createAssociation__SignalsToDevice)
// GET - Signal(s) by Device Id '/signals/device/{id}'
app.get('/signals/device/:id', postgreSQL_RestAPI__DeviceSignals.getSignalByDeviceId)
// GET - Devices(s) by Signal Id '/devices/signal/{id}'
app.get('/devices/signal/:id', postgreSQL_RestAPI__DeviceSignals.getDeviceBySignalId)
// DELETE - Clear ASSOCIATIONS between Device and Signals by Device ID '/clear_signals/device/{id}' + JSON body
app.delete('/clear_signals/device/:id', postgreSQL_RestAPI__DeviceSignals.clearAssociation__SignalsToDevice)

/** Access to Data Table */
// All Available Data '/data'
app.get('/data', postgreSQL_RestAPI__Data.getAllData)
// All Available Data of Device with Device Id '/data/device/:id'
app.get('/data/device/:id', postgreSQL_RestAPI__Data.getAllDataOfDevice)
// All Available Data of Device with Device Id WHERE Timestamp >= X '/recent_data/device/:id/:timestamp'
app.get('/recent_data/device/:id/:timestamp', postgreSQL_RestAPI__Data.getRecentDataOfDevice)

/** Inform alive */
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})