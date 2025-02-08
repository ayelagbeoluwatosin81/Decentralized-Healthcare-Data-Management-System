import { describe, it, expect, beforeEach } from "vitest"

// Mock the prescriptions storage
const prescriptions = new Map()
let nextPrescriptionId = 0

// Mock functions to simulate contract behavior
function createPrescription(patient: string, medication: string, dosage: string, refills: number, duration: number) {
  const prescriptionId = nextPrescriptionId++
  const expiration = Date.now() + duration * 1000 // Convert duration to milliseconds
  prescriptions.set(prescriptionId, {
    patient,
    doctor: "mock-doctor-address",
    medication,
    dosage,
    refills,
    expiration,
  })
  return prescriptionId
}

function refillPrescription(prescriptionId: number) {
  if (!prescriptions.has(prescriptionId)) {
    throw new Error("Prescription not found")
  }
  const prescription = prescriptions.get(prescriptionId)
  if (prescription.refills <= 0) {
    throw new Error("No refills remaining")
  }
  if (prescription.expiration < Date.now()) {
    throw new Error("Prescription expired")
  }
  prescription.refills--
  prescriptions.set(prescriptionId, prescription)
}

function getPrescription(prescriptionId: number) {
  return prescriptions.get(prescriptionId)
}

describe("Prescription Management Contract", () => {
  beforeEach(() => {
    prescriptions.clear()
    nextPrescriptionId = 0
  })
  
  it("should create a prescription", () => {
    const prescriptionId = createPrescription("patient1", "Medication A", "10mg daily", 3, 2592000) // 30 days
    expect(prescriptionId).toBe(0)
    expect(prescriptions.size).toBe(1)
  })
  
  it("should refill a prescription", () => {
    const prescriptionId = createPrescription("patient1", "Medication A", "10mg daily", 3, 2592000)
    refillPrescription(prescriptionId)
    const prescription = getPrescription(prescriptionId)
    expect(prescription.refills).toBe(2)
  })
  
  it("should get a prescription", () => {
    const prescriptionId = createPrescription("patient1", "Medication A", "10mg daily", 3, 2592000)
    const prescription = getPrescription(prescriptionId)
    expect(prescription).toBeDefined()
    expect(prescription.medication).toBe("Medication A")
  })
  
  it("should throw an error when refilling an expired prescription", () => {
    const prescriptionId = createPrescription("patient1", "Medication A", "10mg daily", 3, -1) // Expired prescription
    expect(() => refillPrescription(prescriptionId)).toThrow("Prescription expired")
  })
  
  it("should throw an error when no refills are remaining", () => {
    const prescriptionId = createPrescription("patient1", "Medication A", "10mg daily", 0, 2592000)
    expect(() => refillPrescription(prescriptionId)).toThrow("No refills remaining")
  })
})

