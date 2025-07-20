# Payouts System Test Cases

This document outlines test cases for the payouts system, including refunds, cancellations, and automatic rent payouts after safety window closures.

## Test Environment Setup

1. Make sure you're logged in as an admin user
2. Navigate to `c/dashboard/admin/payouts-test` to access the testing page
3. Have the `/dashboard/admin/payouts` page open in another tab to verify results

## Test Case 1: Refund Request Approval

**Objective:** Verify that approving a refund request creates a payout entry.

**Steps:**
1. On the payouts test page, click "Create Sample Refund Request"
2. Copy the generated refund request ID
3. Click "Approve Refund Request"
4. Navigate to the Pending Payouts page

**Expected Results:**
- A new pending payout should appear in the list
- The payout should have "Tenant Refund" as the reason
- The payout should be linked to the refund request ID
- The payout status should be "pending"

**Data Structure:**
```json
{
  "payeeId": "user123",
  "payeeName": "John Doe",
  "payeePhone": "+212612345678",
  "payeeType": "client",
  "paymentMethod": {
    "bankName": "Bank Al-Maghrib",
    "accountLast4": "1234",
    "type": "IBAN"
  },
  "reason": "Tenant Refund",
  "amount": 5000,
  "currency": "MAD",
  "status": "pending",
  "sourceId": "refundRequest123",
  "sourceType": "refund",
  "createdAt": "2023-08-15T14:30:00Z",
  "updatedAt": "2023-08-15T14:30:00Z"
}
```

## Test Case 2: Cancellation Request Approval

**Objective:** Verify that approving a cancellation request creates both a refund request and a cushion payout for the advertiser.

**Steps:**
1. On the payouts test page, click "Create Sample Cancellation Request"
2. Copy the generated cancellation request ID
3. Click "Approve Cancellation Request"
4. Navigate to the Pending Payouts page
5. Navigate to the Refund Requests page

**Expected Results:**
- A new pending payout should appear in the list for the advertiser (cushion payment)
- The payout should have either "Cushion – Pre-move Cancel" or "Cushion – Haani Max Cancel" as the reason
- A new refund request should be created with "pending" status
- The refund request should reference the cancellation request ID

**Data Structure for Cushion Payout:**
```json
{
  "payeeId": "advertiser123",
  "payeeName": "Property Owner",
  "payeePhone": "+212698765432",
  "payeeType": "advertiser",
  "paymentMethod": {
    "bankName": "CIH Bank",
    "accountLast4": "5678",
    "type": "RIB"
  },
  "reason": "Cushion – Pre-move Cancel",
  "amount": 500,
  "currency": "MAD",
  "status": "pending",
  "sourceId": "cancellationRequest123",
  "sourceType": "cancellation",
  "createdAt": "2023-08-15T14:30:00Z",
  "updatedAt": "2023-08-15T14:30:00Z"
}
```

**Data Structure for Auto-Generated Refund Request:**
```json
{
  "userId": "user123",
  "propertyId": "property123",
  "reservationId": "reservation123",
  "amount": 4500,
  "requestDate": "2023-08-15T14:30:00Z",
  "status": "pending",
  "reason": "Auto-generated from approved cancellation request: cancellationRequest123",
  "requestDetails": "Cancellation approved by admin",
  "cancellationRequestId": "cancellationRequest123",
  "createdAt": "2023-08-15T14:30:00Z",
  "updatedAt": "2023-08-15T14:30:00Z",
  "createdBy": "admin123"
}
```

## Test Case 3: Safety Window Closure - Single Booking

**Objective:** Verify that a specific booking can have its safety window closed and rent payout created.

**Steps:**
1. Create a booking with a move-in date more than 24 hours in the past
   - You can use the admin dashboard to create a test booking
   - Set the move-in date to yesterday or earlier
   - Make sure the booking status is "paid" or "movedIn"
2. On the payouts test page, enter the booking ID
3. Click "Check & Process Specific Booking"
4. Navigate to the Pending Payouts page

**Expected Results:**
- The booking should be updated with `safetyWindowClosed: true`
- A new pending payout should appear in the list for the advertiser
- The payout should have "Rent – Move-in" as the reason
- The payout should be linked to the booking ID
- The payout status should be "pending"

**Data Structure:**
```json
{
  "payeeId": "advertiser123",
  "payeeName": "Property Owner",
  "payeePhone": "+212698765432",
  "payeeType": "advertiser",
  "paymentMethod": {
    "bankName": "CIH Bank",
    "accountLast4": "5678",
    "type": "RIB"
  },
  "reason": "Rent – Move-in",
  "amount": 9500,
  "currency": "MAD",
  "status": "pending",
  "sourceId": "booking123",
  "sourceType": "rent",
  "propertyId": "property123",
  "createdAt": "2023-08-15T14:30:00Z",
  "updatedAt": "2023-08-15T14:30:00Z",
  "createdBy": "system",
  "notes": "Platform fee: 500 MAD"
}
```

## Test Case 4: Safety Window Closure - Batch Processing

**Objective:** Verify that all eligible bookings can have their safety windows closed and rent payouts created in a batch.

**Steps:**
1. Create multiple bookings with move-in dates more than 24 hours in the past
   - You can use the admin dashboard to create test bookings
   - Set the move-in dates to yesterday or earlier
   - Make sure the booking statuses are "paid" or "movedIn"
2. On the payouts test page, click "Process All Safety Window Closures"
3. Navigate to the Pending Payouts page

**Expected Results:**
- All eligible bookings should be updated with `safetyWindowClosed: true`
- New pending payouts should appear in the list for each booking's advertiser
- The payouts should have "Rent – Move-in" as the reason
- The payouts should be linked to their respective booking IDs
- The payout statuses should be "pending"

## Test Case 5: Marking Payouts as Paid

**Objective:** Verify that pending payouts can be marked as paid.

**Steps:**
1. Complete any of the above test cases to create pending payouts
2. Navigate to the Pending Payouts page
3. For each payout, click the "Mark as Paid" button

**Expected Results:**
- The payout status should change from "pending" to "paid"
- The payout should have a "paidAt" timestamp
- The payout should have a "paidBy" field with the admin's user ID
- The payout should move from the "Pending" to the "Completed" tab

## Edge Cases and Error Handling

### Test Case 6: Invalid Booking ID

**Steps:**
1. On the payouts test page, enter an invalid or non-existent booking ID
2. Click "Check & Process Specific Booking"

**Expected Results:**
- An error message should be displayed: "Booking not found"
- No payout should be created

### Test Case 7: Already Processed Booking

**Steps:**
1. Process a booking's safety window using Test Case 3
2. Try to process the same booking again

**Expected Results:**
- An error message should be displayed: "Payout has already been created for this booking"
- No duplicate payout should be created

### Test Case 8: Safety Window Not Yet Closed

**Steps:**
1. Create a booking with a move-in date less than 24 hours ago
2. On the payouts test page, enter the booking ID
3. Click "Check & Process Specific Booking"

**Expected Results:**
- An error message should be displayed: "Safety window has not closed yet"
- No payout should be created

### Test Case 9: Missing Payment Method

**Steps:**
1. Create a booking for an advertiser without a payment method
2. On the payouts test page, enter the booking ID
3. Click "Check & Process Specific Booking"

**Expected Results:**
- An error message should be displayed: "Advertiser has no payment method for rent payout"
- No payout should be created

## Database Validation

After running these tests, verify the following database collections:

1. `payouts` collection should contain new entries for each created payout
2. `refundRequests` collection should contain new entries for cancellation-generated refunds
3. `requests` collection should have updated statuses for processed bookings
4. `cancellationRequests` collection should have updated statuses for approved cancellations

## Notification Validation

If possible, also verify that the following notifications are sent:

1. Refund processed notification to tenant
2. Payout processed notification to advertiser
3. Cancellation approved notification to tenant

## Performance Considerations

- The batch processing of safety window closures should handle a large number of bookings efficiently
- Each operation should complete within a reasonable timeframe (< 5 seconds)
- Error handling should prevent the entire batch from failing if one booking fails 