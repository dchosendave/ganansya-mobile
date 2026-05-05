# 📱 Ganansya

## Sari-Sari Store Cash In/Out System

### High-Level Business + Application + UX Logic Document

---

# 1. 🎯 Objective

To build a **simple, mobile-first web application** that enables sari-sari stores to provide **Cash In / Cash Out services** while maintaining:

* Accurate float management
* Consistent revenue tracking
* Minimal operational complexity

---

# 2. 🧩 Business Model Overview

## Core Service

* Cash In (Customer → Digital Wallet)
* Cash Out (Digital Wallet → Cash) via GCash

## Revenue Source

* Fixed transaction fee per transaction

## Value Proposition

* Accessible financial service in barangay
* Faster than going to town
* Reliable availability (no downtime)

---

# 3. 👥 Roles & Responsibilities

## Investor / Owner

* Provides capital (float)
* Performs remote rebalancing
* Monitors transactions and reports
* Defines pricing rules

## Store Operator (Tindera)

* Executes transactions
* Logs all transactions
* Handles cash
* Follows operational rules

---

# 4. 💰 Capital Structure (Float System)

## Initial Setup

* ₱10,000 Cash
* ₱10,000 GCash
  **Total Float: ₱20,000**

## Float Behavior

### Cash In

* Customer gives cash
* Operator sends GCash
  → Cash ↑, GCash ↓

### Cash Out

* Customer sends GCash
* Operator gives cash
  → Cash ↓, GCash ↑

---

# 5. 💸 Pricing Model

| Amount Range     | Fee     |
| ---------------- | ------- |
| ₱1 – ₱1,000      | ₱10     |
| ₱1,001 – ₱5,000  | ₱20     |
| ₱5,001 – ₱10,000 | ₱30–₱50 |

Rules:

* Fixed pricing
* No negotiation
* Auto-computed by system
* Can be customized using the `admin/pricing` route.

---

# 6. 📊 Revenue Projection

## Assumptions

* 30 transactions/day
* Avg fee: ₱15–₱25

## Estimated Income

* Daily: ₱450 – ₱750
* Monthly: ₱13,500 – ₱22,500

## Conservative Range

* ₱8,000 – ₱15,000/month

---

# 7. 🔁 Reinvestment Strategy

* Profits are reinvested into float

### Growth Example

* ₱20k → ₱25k → ₱30k

Result:

* Higher transaction capacity
* Increased revenue

---

# 8. 🔄 Float Management Strategy

## Dual Buffer System

Maintain:

* Cash buffer
* GCash buffer

## Threshold Rules

* Cash < ₱3,000 → limit cash out
* GCash < ₱3,000 → limit cash in

---

## Remote Rebalancing

### Flow

1. Store runs low on GCash
2. Owner sends funds remotely
3. Store holds equivalent cash
4. Cash remitted later

### Result

* Eliminates travel to town
* Continuous operation

---

# 9. 🔒 Operational Rules

1. No confirmation = no release
2. No utang policy
3. All transactions must be logged
4. Fixed pricing only
5. Respect transaction limits
6. Maintain float thresholds

---

# 10. ⚠️ Risk Management

| Risk             | Description              | Mitigation                 |
| ---------------- | ------------------------ | -------------------------- |
| Human Error      | Wrong input, missed logs | Simple UI + reconciliation |
| Customer Fraud   | Fake screenshots         | Verify actual balance      |
| Float Imbalance  | Rapid depletion          | Dual buffer + limits       |
| Revenue Leakage  | Missed fees              | Auto fee calculation       |
| Operator Fatigue | Repetitive tasks         | Simplified UX              |
| System Downtime  | Network/app issues       | Delay release              |
| Account Risk     | High volume              | Gradual scaling            |

---

# 11. 📅 Daily Operations Flow

## Start of Day

* Check balances (cash + GCash)

## Transaction Flow

1. Select Cash In / Cash Out
2. Enter amount
3. Confirm transaction
4. Log entry

## End of Day

* Perform reconciliation
* Check discrepancies

---

# 12. 📊 Reconciliation Model

Compare:

* Expected (system)
* Actual (cash + GCash)

Output:

* Difference
* Error detection

---

# 13. 📈 Growth Strategy

## Phase 1

* Single store validation

## Phase 2

* Increase float

## Phase 3

* Multi-store rollout

## Phase 4

* Platform scaling

---

# 14. 📱 Application Modules (High-Level)

## MVP Modules

### 1. Login

* PIN-based login
* Minimal input

---

### 2. Dashboard

Display:

* Cash on Hand
* GCash Balance
* Kita Today

Alerts:

* Low Cash
* Low GCash

---

### 3. New Transaction

Actions:

* Cash In
* Cash Out

Fields:

* Amount
* Auto Fee
* Reference Number

Flow:
Tap → Input → Confirm → Done

---

### 4. Transaction History

* List view
* Time, type, amount, fee

---

### 5. Daily Reconciliation

Inputs:

* Actual Cash
* Actual GCash

Output:

* Difference

---

### 6. Rebalance Request

* Request additional GCash
* Owner responds remotely

---

### 7. Pricing Rules (Admin)

* Define fee tiers

---

### 8. Reports (Owner)

* Daily / Monthly profit
* Transaction volume

---

### 9. Audit Trail

* Track edits and corrections
* No silent changes

---

# 15. 🎨 UX & Design Principles

## Target Users

* Age: 30+
* Minimal tech familiarity
* Mobile-first usage

---

## UX Goals

* Simple
* Fast
* Clear
* Minimal

---

## Core UX Rules

### 1. Big Buttons

* Easy to tap

### 2. One Action Per Screen

* No clutter

### 3. Minimal Fields

* Only necessary inputs

### 4. Clear Feedback

* Success / Error messages

---

## Language Strategy (Taglish)

Use:

* Simple Tagalog + familiar English

### Example UI

```text
Cash on Hand
GCash Balance
Kita Today

[ Cash In ]
[ Cash Out ]

Amount
Bayad (Fee)

Confirm
Cancel
```

---

## Design Style

* Flat UI
* Light colors
* Minimal animations
* Fast loading

---

# 16. ⚡ Performance Principles

* Mobile-first responsive design
* Lightweight assets
* Minimal JS overhead
* Fast load times
* Works on low-end devices

---

# 17. 🧠 System Positioning

PondoFlow is:

> A simple financial tracking and float management system for sari-sari stores

Not:

* A banking app
* A complex fintech platform

---

# 18. 🎯 Success Criteria

* Continuous transactions (no downtime)
* Balanced float
* Accurate logs vs actual
* Consistent profit growth
* Easy to use for tindera

---

# 19. 🧠 Final Insight

This system is a:

> Micro financial operations platform driven by discipline, visibility, and simplicity

---

# ✅ Status

✔ Business Model Finalized
✔ Cash Flow Defined
✔ Risk Model Identified
✔ Application Modules Defined
✔ UX Direction Finalized

---

**Ready for Next Phase:**
➡️ Data Model (Schema)
➡️ API Design
➡️ UI Wireframes
