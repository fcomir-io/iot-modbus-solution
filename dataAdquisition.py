from pathlib import Path
import json
import threading
from modbusSlave.modbusTCP_Slave import modbusTCP_Slave
import os
from middleware.postgreSQL_MW import PostgreSQL_Middleware
import datetime as dt 

DEBUG = False

def CreateModbusSlaveObject(slaveID, modbusMasterDevice, resultMode):
    global slavesArray
    
    #  The structure of each element will be an array with the information 
    # in the positions as follow:
    #
    # [POS 0] ID based
    # [POS 1] JSON Struct
    #           + Master Host
    #           + Master Port
    #           + Data ==> Array of Addresses to poll
    # [POS 2] Slave Object
    # [POS 3] Status
    # [POS 4] New Data Flag 
    # [POS 5] New Data Array
    #
    #################################################
    
    slaveObject_Struct = []

    # Append Slave Object ID into the struct
    slaveObject_Struct.append(slaveID)

    # Append JSON Data into the struct    
    slaveObject_Struct.append(modbusMasterDevice)    

    # Create Slave Object
    tempSlaveObject = modbusTCP_Slave(modbusMasterDevice, resultMode)
    # Append Slave Object into Struct
    slaveObject_Struct.append(tempSlaveObject)

    # Setup Polling Process
    status = tempSlaveObject.SetupPollingProcess()
    # Append Slave Object Status into struct
    slaveObject_Struct.append(status)
    
    # Create New Data flag
    newData_Flag = False
    # Append New Data flag into struct
    slaveObject_Struct.append(newData_Flag)

    # Create New Data array 
    newDataArray = []
    # Append New Data array into struct
    slaveObject_Struct.append(newDataArray)

    ### Append Slave Object into Slaves array
    slavesArray.append(slaveObject_Struct)

    # Check if Polling Process was initiated correctly
    if status == 0:
        # --> Slave can start polling data from Master    
        StartPollingProcess(slaveObject_Struct, resultMode)
    else:
        # --> Polling process was not initiated correctly

        ### Possible errors
        #   - '1' ==> Problems accessing Modbus Server
        ###############################################        
        print("SetupPollingProcess - Status: ", status)               

def ConfigurePostgreSQL_Middleware():
    # Set up Middleware to store data in the postgre SQL DB
    CONTENT__DATABASE_INFO__PATH = Path(os.getcwd() + "/__content/database.ini")
    CONTENT__DATABASE_CONFIG_JSON__PATH = Path(os.getcwd() + "/__content/database.structure.json")
    database_handler = PostgreSQL_Middleware(Path(CONTENT__DATABASE_INFO__PATH), Path(CONTENT__DATABASE_CONFIG_JSON__PATH))    
    return database_handler

def StartPollingProcess(slaveObject_Struct, resultMode):

    global dataSemaphore

    # Extract Master Information from Slave Struct
    masterInformation = slaveObject_Struct[1]    
    # Extract Slave Object from Slave Struct
    slaveObject = slaveObject_Struct[2]

    # --> Status has been already checked, thus: Slave can start polling data from Master

    # Start Polling Loop        
    main_loop_flag = True
    while main_loop_flag:            
        
        # Get latest data from master
        result = slaveObject.PollDataFromDevice()

        # Check if there is an error
        if result == -1:
            # -->  There is no Server on the other side or the connection is not possible 
            print("[ERROR] TCP Server could not be opened - ", result, " [", type(result), "]")
        else:         

            if result != "" and result != []:
                # Lock semaphore
                dataSemaphore.acquire()
                #print ('lock acquired by', slaveObject_Struct[0])

                # Store data in the array of the Slave Struct
                slaveObject_Struct[5].append(result)
                # Notify main process by setting New Data flag to True
                slaveObject_Struct[4] = True        

                # Release semaphore
                dataSemaphore.release()
                #print ('lock released by', slaveObject_Struct[0])

    # Out of the while
    client.close()

def ProcessReceivedData(slave, resultMode, action = "printout"):
    
    global dataSemaphore    

    # Extract needed info from Slave Struct
    host = slave[1]['host']
    port = slave[1]['port']
    slaveObject = slave[2]
    dataArray = slave[5]

    dataSemaphore.acquire()
    #print ('lock acquired by ProcessReceivedData')

    for result in dataArray:
        
        # Depending on the action defined
        if  (action == 'store_db'):
            StoreDataInDB(host, port, result)
        else:
            PrintOutData(host, port, result, resultMode)
        
        # Pop processed data out of the data array
        dataArray.pop(0)

    dataSemaphore.release()
    #print ('lock released by ProcessReceivedData')

def PrintOutData(host, port, result, resultMode):

    ### Process Result depending on Result Mode set by execution
    #   RESULT_MODE__RETURN_ALL_VALUES__RAW ==> 0
    #   RESULT_MODE__RETURN_ALL_VALUES__FORMATTED ==> 1
    #   RESULT_MODE__RETURN_ONLY_NEW_VALUES__RAW ==> 2
    #   RESULT_MODE__RETURN_ONLY_NEW_VALUES__FORMATTED ==> 3
    ##################################################################

    if (resultMode == modbusTCP_Slave.RESULT_MODE__RETURN_ALL_VALUES__RAW):                    
        # All data - RAW
        if result != "":
            print("Host:", host, "@port:", port, " -  All RAW Data: ", result)
    elif (resultMode == modbusTCP_Slave.RESULT_MODE__RETURN_ALL_VALUES__FORMATTED):
        # All data - FORMATTED
        if result != []:                        
            for item in result:
                print("Host:", host, "@port:", port, " -  All FORMATTED Data: ", item)
    elif (resultMode == modbusTCP_Slave.RESULT_MODE__RETURN_ONLY_NEW_VALUES__RAW):
        # Only NEW data - RAW
        if result != []:
            print("Host:", host, "@port:", port, " -  Only NEW Data - RAW: ", result)
    elif (resultMode == modbusTCP_Slave.RESULT_MODE__RETURN_ONLY_NEW_VALUES__FORMATTED):
        # Only NEW data - FORMATTED
        if result != []:
            for item in result:
                print("Host:", host, "@port:", port, " -  Only NEW Data - FORMATTED: ", item)
    else:
        if result != "" and result != []:
            print("Host:", host, "@port:", port, " -  Unknown Result Mode: ", result)

def StoreDataInDB(host, port, result):
    global database_handler

    # Only NEW data - RAW
    if result != []:

        # Prepare timestamp
        temp = dt.datetime.now()        
        timestamp = dt.datetime.now()

        for data_point in result:
            # Prepare value
            value = int(data_point["value"][0])

            '''
            # Print out information
            print(
                str(timestamp) 
                + " ---> "
                + host
                + " @ Port: "
                + str(port)
                + " ==> Value: "
                + str(value).rjust(5)
                + " from "
                + (data_point["type"]).rjust(8)
                + " at address: "
                + str(data_point["address"])
                + " }"
            )
            '''

            # Store data in Database
            database_handler.InsertDataIntoTable(timestamp, value)    

if __name__ == "__main__":    

    # Semaphore to avoid conflicts while working with Slave Object Structs
    dataSemaphore = threading.Lock()

    # Check if file exists and extract JSON array from it
    modbusDeviceList = ""
    CONTENT__MODBUS_DEVICE_LIST__PATH = "./__content/modbusDeviceList.json"
    fileToCheck = Path(CONTENT__MODBUS_DEVICE_LIST__PATH)    
    if fileToCheck.is_file():
        # Check if file is JSON ok
        try:
            # Since we are working with python v3.5, open needs a string as argument
            json_object = json.loads(open(str(fileToCheck)).read())
        except Exception as e:
            print("[ERROR] No proper JSON file --- ", e)
        # JSON file was properly parsed
        modbusDeviceList = json_object
    else:
        print("[ERROR] No JSON file called 'modbusDeviceList.json' found in /__content")        

    if modbusDeviceList != "":
        # --> json was properly parsed
        
        slavesArray = []
        slavesCounter = 0
        resultMode = modbusTCP_Slave.RESULT_MODE__RETURN_ONLY_NEW_VALUES__RAW

        for device in modbusDeviceList:
            # A modbusSlave object will be instantiated
            x = threading.Thread(target=CreateModbusSlaveObject, args=(slavesCounter, device, resultMode, ))
            slavesCounter = slavesCounter + 1
            x.start()

        # --> Slaves object instantiated properly

        # MENU ?!?

        # Setup DB
        database_handler = ConfigurePostgreSQL_Middleware()        
        # Is connection with DB OK?
        if (database_handler.GetConfigurationStatus() == 0):

            # DEBUG ==> Empty table 'data'
            if DEBUG == True:
                database_handler.DeleteAllDataOfTable("data")
            ##################################################

            # Start main process        
            while True:
                for slave in slavesArray:
                    # Check if there is new data available
                    if (slave[4] == True):
                        ProcessReceivedData(slave, resultMode, "store_db")
                        # Set notification flag to False after processing data               
                        slave[4] = False                     
        else:
            print("Status: ", database_handler.GetConfigurationStatus())

        print("Dar parte de los Slaves que no pudieron conectarse... Intentarlo de nuevo ?!?")

        print("Los q status tienen 0, ir viendo newDataFlag para sacar la data y printearla")
        print("... La idea es que almacenemos solo data nueva pero sin perder nada")
        print("Necesitamos support tools ==> Recreate Struct ?!?")

    '''       
    NEXT ==> 
        ReadME s varios y comenzar Endpoints
        
    Martes 18 y Jueves 20 - Endpoints para obtener data

    Fin de semana del 23 de agosto debería comenzar con react

    Martes 25 de agosto - Read Me s hasta la fecha y tener Express.js cerrado
    Jueves 27 de agosto - Primera versión de React :-O

    15 septiembre ==> Entrega del proyecto
    '''

    print("\n --- END OF CLIENT --- \n")
   