;; research-data-sharing.clar

;; Define data structures
(define-map research-datasets
  {id: uint}
  {
    researcher: principal,
    anonymized-data: (string-ascii 2048),
    created-at: uint
  }
)

(define-data-var next-dataset-id uint u0)

;; Functions for managing research datasets
(define-public (submit-research-dataset (anonymized-data (string-ascii 2048)))
  (let
    (
      (dataset-id (var-get next-dataset-id))
    )
    (map-set research-datasets
      {id: dataset-id}
      {
        researcher: tx-sender,
        anonymized-data: anonymized-data,
        created-at: block-height
      }
    )
    (var-set next-dataset-id (+ dataset-id u1))
    (ok dataset-id)
  )
)

(define-read-only (get-research-dataset (dataset-id uint))
  (map-get? research-datasets {id: dataset-id})
)

(define-public (update-research-dataset (dataset-id uint) (new-anonymized-data (string-ascii 2048)))
  (let
    (
      (dataset (unwrap! (map-get? research-datasets {id: dataset-id}) (err u404)))
    )
    (asserts! (is-eq (get researcher dataset) tx-sender) (err u403))
    (ok (map-set research-datasets
      {id: dataset-id}
      (merge dataset
        {
          anonymized-data: new-anonymized-data,
          created-at: block-height
        }
      )
    ))
  )
)

