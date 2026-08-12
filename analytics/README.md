# Data analyst portfolio layer

This directory adds a transparent, reproducible analytics demonstration to the portfolio.

## What is real evidence?

The public `Database-CRMS-` GitHub repository contains relational schema work and SQL/PL/SQL examples including aggregation, `GROUP BY`, `HAVING`, subqueries, joins, set operations, a `WITH` clause, views, procedures, functions, and a trigger.

## What is a portfolio demonstration?

`sample-data/orders.csv` and `sample-data/orders.json` are synthetic. They exist only to power the interactive `/api/analytics` dashboard and to show the reasoning pattern expected in analyst interviews:

1. define a business question,
2. query/aggregate the data,
3. validate the result,
4. extract the insight,
5. connect it to a decision.

The SQL in `sql/business_analysis.sql` is an additional portfolio demonstration built over that synthetic schema. It should not be described as employer data or as code that already existed in the CRMS repository.
