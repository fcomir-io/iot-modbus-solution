import React, { useState, useEffect } from "react";

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CFormGroup,
  CLabel,
  CInputCheckbox,
} from "@coreui/react";

/** Update table data */
import signalsData from "../../assets/myMockups/SignalsData";

const SignalSelector = (props) => {
  /** Edit Signals */
  const [signals, setSignals] = useState(signalsData);
  const [signalObjects, setSignalObjects] = useState(() => {
    console.log("EDIT", signals);
    let tempArray = [];
    let tempObject = {};
    signals.forEach((signal, i) => {
      /** Check if thi signal shall be selected */
      const x = props.selectedSignals.find((value) => {
        if (value == signal.id) return true;
        return false;
      });
      console.log("SIGNAL: ", signal, " - Found? ", x);
      tempObject = {
        id: signal.id,
        checked: x || false,
        name: signal.name,
      };
      tempArray.push(tempObject);
    });
    return tempArray;
  });
  const [old_signalObjects, setOldSignalObjects] = useState(signalObjects);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    console.log("Signals", signalObjects);
  }, [signalObjects]);

  /** Handler for CCheckBox */
  function handleOnChange_Signal(e) {
    //e.preventDefault();
    console.log(e.target);
    const signalID = e.target.id;

    // Update array of Device Objects
    setSignalObjects(
      signalObjects.map((object) => {
        if (object.id == signalID) {
          // Device to update
          return { ...object, checked: e.target.checked };
        }
        // Device is not the one clicked ==> nothing to do
        return object;
      })
    );
  }

  /** Handlers for CButtons */
  function handleClick_Save(e) {
    e.preventDefault();

    // Update old data with the new changed
    setOldSignalObjects(signalObjects);
  }

  function handleClick_Cancel(e) {
    e.preventDefault();

    // Discard changed data and keep the old one
    setSignalObjects(old_signalObjects);
  }

  return (
    <CModal show={true} onClose={props.onClose}>
      <CModalHeader closeButton>
        <h3>Signal Selector</h3>
      </CModalHeader>
      <CModalBody>
        <CCol>
          <CCard>
            <CCardBody>
              <CFormGroup row>
                <CCol md="9">
                  {signalObjects.map((signalObject, i) => {
                    console.log("SignalObject:", signalObject);
                    return (
                      <CFormGroup
                        key={i}
                        variant="checkbox"
                        className="checkbox"
                      >
                        <CInputCheckbox
                          id={i}
                          name={signalObject.name}
                          value={i}
                          checked={signalObject.checked}
                          onClick={handleOnChange_Signal}
                        />
                        <CLabel
                          variant="checkbox"
                          className="form-check-label"
                          htmlFor={signalObject.name}
                        >
                          {signalObject.name}
                        </CLabel>
                      </CFormGroup>
                    );
                  })}
                </CCol>
              </CFormGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CModalBody>
      <CModalFooter>
        <>
          <CButton color="info" onClick={handleClick_Save}>
            Save
          </CButton>
          <CButton color="light" onClick={handleClick_Cancel}>
            Cancel
          </CButton>
        </>
      </CModalFooter>
    </CModal>
  );
};

export default SignalSelector;

/* Los botens
Select ALl
Deselect All
fetch de los device data para cruzarlo con los IDs
Actualizar base de datos cuando se da OK
*/
