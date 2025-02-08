;; patient-record.clar

;; Define data structures
(define-map patient-records
  {id: uint}
  {
    patient: principal,
    encrypted-data: (string-ascii 1024),
    last-updated: uint
  }
)

(define-data-var next-record-id uint u0)

;; Functions for managing patient records
(define-public (create-patient-record (encrypted-data (string-ascii 1024)))
  (let
    (
      (record-id (var-get next-record-id))
    )
    (map-set patient-records
      {id: record-id}
      {
        patient: tx-sender,
        encrypted-data: encrypted-data,
        last-updated: block-height
      }
    )
    (var-set next-record-id (+ record-id u1))
    (ok record-id)
  )
)

(define-public (update-patient-record (record-id uint) (new-encrypted-data (string-ascii 1024)))
  (let
    (
      (record (unwrap! (map-get? patient-records {id: record-id}) (err u404)))
    )
    (asserts! (is-eq (get patient record) tx-sender) (err u403))
    (ok (map-set patient-records
      {id: record-id}
      (merge record
        {
          encrypted-data: new-encrypted-data,
          last-updated: block-height
        }
      )
    ))
  )
)

(define-read-only (get-patient-record (record-id uint))
  (map-get? patient-records {id: record-id})
)

