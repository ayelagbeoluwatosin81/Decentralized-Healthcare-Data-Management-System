import { describe, it, expect, beforeEach } from "vitest"

// Mock the patient record storage
const patientRecords = new Map()
let nextRecordId = 0

// Mock functions to simulate contract behavior
function createPatientRecord(encryptedData: string) {
  const recordId = nextRecordId++
  patientRecords.set(recordId, {
    patient: "mock-patient-address",
    encryptedData,
    lastUpdated: Date.now(),
  })
  return recordId
}

function updatePatientRecord(recordId: number, newEncryptedData: string) {
  if (!patientRecords.has(recordId)) {
    throw new Error("Record not found")
  }
  const record = patientRecords.get(recordId)
  record.encryptedData = newEncryptedData
  record.lastUpdated = Date.now()
  patientRecords.set(recordId, record)
}

function getPatientRecord(recordId: number) {
  return patientRecords.get(recordId)
}

describe("Patient Record Contract", () => {
  beforeEach(() => {
    patientRecords.clear()
    nextRecordId = 0
  })
  
  it("should create a patient record", () => {
    const recordId = createPatientRecord("encrypted-data")
    expect(recordId).toBe(0)
    expect(patientRecords.size).toBe(1)
  })
  
  it("should update a patient record", () => {
    const recordId = createPatientRecord("initial-data")
    updatePatientRecord(recordId, "updated-data")
    const record = getPatientRecord(recordId)
    expect(record.encryptedData).toBe("updated-data")
  })
  
  it("should get a patient record", () => {
    const recordId = createPatientRecord("test-data")
    const record = getPatientRecord(recordId)
    expect(record).toBeDefined()
    expect(record.encryptedData).toBe("test-data")
  })
  
  it("should throw an error when updating non-existent record", () => {
    expect(() => updatePatientRecord(999, "data")).toThrow("Record not found")
  })
})

