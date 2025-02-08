;; prescription-management.clar

;; Define data structures
(define-map prescriptions
  {id: uint}
  {
    patient: principal,
    doctor: principal,
    medication: (string-ascii 64),
    dosage: (string-ascii 32),
    refills: uint,
    expiration: uint
  }
)

(define-data-var next-prescription-id uint u0)

;; Functions for managing prescriptions
(define-public (create-prescription (patient principal) (medication (string-ascii 64)) (dosage (string-ascii 32)) (refills uint) (duration uint))
  (let
    (
      (prescription-id (var-get next-prescription-id))
      (expiration (+ block-height duration))
    )
    (map-set prescriptions
      {id: prescription-id}
      {
        patient: patient,
        doctor: tx-sender,
        medication: medication,
        dosage: dosage,
        refills: refills,
        expiration: expiration
      }
    )
    (var-set next-prescription-id (+ prescription-id u1))
    (ok prescription-id)
  )
)

(define-public (refill-prescription (prescription-id uint))
  (let
    (
      (prescription (unwrap! (map-get? prescriptions {id: prescription-id}) (err u404)))
    )
    (asserts! (is-eq (get patient prescription) tx-sender) (err u403))
    (asserts! (> (get refills prescription) u0) (err u401))
    (asserts! (< block-height (get expiration prescription)) (err u410))
    (ok (map-set prescriptions
      {id: prescription-id}
      (merge prescription {refills: (- (get refills prescription) u1)})
    ))
  )
)

(define-read-only (get-prescription (prescription-id uint))
  (map-get? prescriptions {id: prescription-id})
)

