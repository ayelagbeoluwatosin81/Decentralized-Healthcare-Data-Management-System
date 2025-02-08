import { describe, it, expect, beforeEach } from "vitest"

// Mock the research datasets storage
const researchDatasets = new Map()
let nextDatasetId = 0

// Mock functions to simulate contract behavior
function submitResearchDataset(anonymizedData: string) {
  const datasetId = nextDatasetId++
  researchDatasets.set(datasetId, {
    researcher: "mock-researcher-address",
    anonymizedData,
    createdAt: Date.now(),
  })
  return datasetId
}

function updateResearchDataset(datasetId: number, newAnonymizedData: string) {
  if (!researchDatasets.has(datasetId)) {
    throw new Error("Dataset not found")
  }
  const dataset = researchDatasets.get(datasetId)
  dataset.anonymizedData = newAnonymizedData
  dataset.createdAt = Date.now()
  researchDatasets.set(datasetId, dataset)
}

function getResearchDataset(datasetId: number) {
  return researchDatasets.get(datasetId)
}

describe("Research Data Sharing Contract", () => {
  beforeEach(() => {
    researchDatasets.clear()
    nextDatasetId = 0
  })
  
  it("should submit a research dataset", () => {
    const datasetId = submitResearchDataset("anonymized-data")
    expect(datasetId).toBe(0)
    expect(researchDatasets.size).toBe(1)
  })
  
  it("should update a research dataset", () => {
    const datasetId = submitResearchDataset("initial-data")
    updateResearchDataset(datasetId, "updated-data")
    const dataset = getResearchDataset(datasetId)
    expect(dataset.anonymizedData).toBe("updated-data")
  })
  
  it("should get a research dataset", () => {
    const datasetId = submitResearchDataset("test-data")
    const dataset = getResearchDataset(datasetId)
    expect(dataset).toBeDefined()
    expect(dataset.anonymizedData).toBe("test-data")
  })
  
  it("should throw an error when updating non-existent dataset", () => {
    expect(() => updateResearchDataset(999, "data")).toThrow("Dataset not found")
  })
})

