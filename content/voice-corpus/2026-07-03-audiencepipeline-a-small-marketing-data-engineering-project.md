---
title: "AudiencePipeline: A Small Marketing Data Engineering Project"
date: "2026-07-03T17:22:05"
slug: "audiencepipeline-a-small-marketing-data-engineering-project"
source: "https://firstnormalform.com/2026/07/03/audiencepipeline-a-small-marketing-data-engineering-project/"
---
# AudiencePipeline: A Small Marketing Data Engineering Project

I like small projects that stay close to real operational work. This one takes flat files that look like the kind of exports every data team inherits, cleans them up, stages them, and turns them into a usable marketing audience.

The pipeline uses CSV inputs, validates them with Python, stages them in SQLite, transforms them with SQL, and publishes an eligible audience. It also quarantines bad rows and writes a reconciliation report so there is a basic control layer around the output.

## What the pipeline does

- Loads customer, booking, consent, and suppression data from CSV files.

- Keeps only the latest customer snapshot when duplicates exist.

- Uses the latest email consent event per customer.

- Aggregates completed bookings from the last 365 days.

- Excludes inactive customers, suppressed customers, and records with missing email.

- Quarantines invalid booking amounts into a rejected-record file.

## Why I built it this way

This structure maps well to a real marketing data operation. In a cloud stack, the raw CSV layer could be an S3 landing zone, the SQLite staging tables could be a warehouse staging area, and the final audience output could feed BI, segmentation, or outbound campaign systems.

I kept the implementation small on purpose. The interesting part here is the sequence of decisions: what gets rejected, what gets deduplicated, what counts as the latest consent, and what gets filtered before an audience is published.

## Project files

The project repository lives here: [github.com/CodeWrangler55/AudiencePipeline](https://github.com/CodeWrangler55/AudiencePipeline). The links below point to files from the repo root.

- [README.md](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/README.md)

- [run-pipeline.py](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/src/run-pipeline.py)

- [schema.sql](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/sql/schema.sql)

- [transform-audience.sql](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/sql/transform-audience.sql)

- [diagnostic-queries.sql](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/sql/diagnostic-queries.sql)

- [customers.csv](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/data/raw/customers.csv)

- [bookings.csv](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/data/raw/bookings.csv)

- [consent-events.csv](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/data/raw/consent-events.csv)

- [suppressions.csv](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/data/raw/suppressions.csv)

- [expected audience output](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/data/expected/eligible-audience.csv)

- [generated audience output](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/output/eligible-audience.csv)

- [reconciliation report](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/output/reconciliation.json)

- [rejected rows](https://github.com/CodeWrangler55/AudiencePipeline/blob/main/output/rejected-bookings.csv)

## Pipeline shape

CSV inputs
  - customers
  - bookings
  - consent events
  - suppressions
        |
        v
Python validation and load
  - reject invalid booking amounts
  - preserve raw row counts
        |
        v
SQLite staging tables
        |
        v
SQL transformation
  - latest customer snapshot
  - latest email consent
  - last-365-day booking aggregation
  - suppression exclusion
        |
        v
Published eligible audience + reconciliation artifacts

## Python ETL layer

The Python script uses the standard library only. That keeps the attention on the ingestion logic instead of package selection.

def load_bookings(connection: sqlite3.Connection) -> tuple[int, int]:
    accepted_rows = []
    rejected_rows = []

    for row in read_csv(RAW_DIR / "bookings.csv"):
        try:
            amount = float(Decimal(row["booking_amount"]))
            accepted_rows.append(
                (
                    row["booking_id"],
                    int(row["customer_id"]),
                    row["booking_date"],
                    amount,
                    row["booking_status"],
                    row["product_name"],
                    row["source_system"],
                )
            )
        except (InvalidOperation, ValueError):
            row["rejection_reason"] = "booking_amount is not numeric"
            rejected_rows.append(row)

    connection.executemany(
        """
        INSERT INTO raw_bookings (
            booking_id,
            customer_id,
            booking_date,
            booking_amount,
            booking_status,
            product_name,
            source_system
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        accepted_rows,
    )
    write_csv(OUTPUT_DIR / "rejected-bookings.csv", rejected_rows)
    return len(accepted_rows), len(rejected_rows)

The useful part is that malformed values are handled explicitly instead of leaking downstream and turning into a quieter problem later.

## SQL transformation layer

The core SQL does three things that come up constantly in production data work:

- Uses ROW_NUMBER() to pick the latest customer snapshot.

- Uses ROW_NUMBER() again to pick the latest email consent event.

- Aggregates recent completed bookings and anti-joins suppressions.

WITH latest_customer AS (
    SELECT
        customer_id,
        email,
        home_state,
        loyalty_tier,
        is_active,
        updated_at,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id
            ORDER BY updated_at DESC
        ) AS row_num
    FROM raw_customers
),
current_customer AS (
    SELECT
        customer_id,
        email,
        home_state,
        loyalty_tier,
        is_active
    FROM latest_customer
    WHERE row_num = 1
),
latest_email_consent AS (
    SELECT
        customer_id,
        consent_status,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id, channel
            ORDER BY event_ts DESC
        ) AS row_num
    FROM raw_consent_events
    WHERE channel = 'email'
)
SELECT
    c.customer_id,
    c.email,
    c.home_state,
    c.loyalty_tier,
    b.bookings_last_365_days,
    b.total_spend_last_365_days,
    b.last_booking_date
FROM current_customer c
JOIN (
    SELECT customer_id, consent_status
    FROM latest_email_consent
    WHERE row_num = 1
) ec
    ON c.customer_id = ec.customer_id
JOIN recent_completed_bookings b
    ON c.customer_id = b.customer_id
LEFT JOIN active_suppressions s
    ON c.customer_id = s.customer_id
WHERE c.is_active = 1
  AND c.email IS NOT NULL
  AND TRIM(c.email) <> ''
  AND ec.consent_status = 'OPT_IN'
  AND s.customer_id IS NULL
ORDER BY c.customer_id;

This is the kind of SQL I like to keep nearby: enough logic to be useful, but still readable enough that someone else can audit the business rules without reverse engineering the whole query.

## Troubleshooting and data quality

A pipeline is not finished just because it runs. It also needs to make bad inputs and suspicious output visible.

That is why this project writes:

- rejected-bookings.csv for malformed numeric values

- reconciliation.json for row-count visibility

- diagnostic-queries.sql for audience-drop investigations

If the audience suddenly shrank, I would check raw counts, verify the latest consent logic, inspect suppressions, and compare inclusion and exclusion conditions one layer at a time.

## How to run it

python src/run-pipeline.py
python -m unittest discover tests

## What I wanted this project to prove

- Flat-file source data can still be handled with reasonable controls.

- SQL is where a lot of the business logic belongs, especially around deduplication, consent state, and eligibility rules.

- Python is useful here as the orchestration and validation layer.

- Troubleshooting gets easier when row counts, rejects, and exclusion logic are visible.

That is the whole shape of the project: ingest, validate, stage, transform, publish, and leave enough evidence behind that the next person can understand what happened.
