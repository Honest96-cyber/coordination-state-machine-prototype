# Coordination State Machine Prototype

A lightweight prototype exploring how financial transactions can act as **coordination signals** inside decentralized systems.

Instead of treating payments as the final step of a workflow, this prototype treats **payment confirmation as a state transition signal** that advances a system's state.

---

# Core Idea

Many decentralized workflows rely on manual coordination between participants.

This prototype explores a simple alternative:
In this model, **financial transactions double as coordination signals**.

This turns payment links from simple payment tools into **coordination primitives**.

---

# Safety Mechanism

Real coordination systems require interruption mechanisms.

This prototype includes a basic **hold / dispute state**:
This introduces a **governance safety interrupt** without requiring full DAO voting.

---

# State Machine

The prototype currently implements the following task states:
Each state transition represents a **coordination event** in the workflow.

---

# Stack

Backend:
- NestJS

Frontend:
- Simple static HTML / CSS / JS

Storage:
- In-memory state (prototype only)

---

# Architectural Direction

The broader concept is a modular stack:
This repository focuses on the **DDD coordination layer**, exploring how task workflows can be driven by financial confirmation signals.

---

# Purpose of the Prototype

This is an early experiment designed to test a simple hypothesis:

> Payments can act as coordination signals inside governance workflows.

The goal is to build a minimal implementation and explore how this primitive might integrate with existing on-chain payment infrastructure.

---

# Status

Early prototype.

The focus is on testing the **state machine concept**, not production readiness.

---

# Potential Next Steps

- integrate payment link providers
- add verification gates
- support dispute resolution flows
- connect to DAO task systems
- experiment with on-chain confirmation triggers
