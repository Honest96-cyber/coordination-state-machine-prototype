# DDD Coordination Prototype

A minimal prototype showing how payment links can act as coordination signals inside a workflow.

## Concept

This prototype tests a simple flow:

Task created  
→ Task started  
→ Task completed  
→ Payment link attached  
→ Payment confirmed  
→ Task state advances

It also includes a safety interrupt:

Task completed  
→ Hold raised  
→ Payout paused  
→ Hold released  
→ Flow resumes

## Stack

- NestJS backend
- Static frontend served by NestJS
- In-memory task store

## Core idea

This prototype is designed to demonstrate that:

- work completion can act as a signal
- payment links can act as structured payout steps
- payment confirmation can trigger state transitions
- safety holds can interrupt coordination flows

## State machine

- OPEN
- IN_PROGRESS
- COMPLETED_PENDING_PAYOUT
- ON_HOLD
- PAYOUT_SENT
- PAID_CONFIRMED

## API endpoints

- `GET /tasks`
- `POST /tasks`
- `POST /tasks/:id/start`
- `POST /tasks/:id/complete`
- `POST /tasks/:id/hold`
- `POST /tasks/:id/release`
- `POST /tasks/:id/payment-link`
- `POST /tasks/:id/confirm-payment`

## Run locally

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run start:dev
```

Open:

```text
http://localhost:3000
```

## Architecture framing

- Orivon = verification layer
- DDD = coordination layer
- Lancemint = execution layer

This prototype currently focuses on the DDD coordination layer and payout-triggered state transitions.
