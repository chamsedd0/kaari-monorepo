# Payouts System Documentation

## Overview

The payouts system handles the automatic creation and management of payouts for various scenarios:

1. **Refund Payouts**: Created when an admin approves a refund request
2. **Cancellation Payouts**: Created when an admin approves a cancellation request
3. **Rent Payouts**: Automatically created when the safety window closes after move-in

## Key Components

### Services

- **PayoutsService**: Core service that handles creating and managing payouts
- **ExpirationService**: Handles safety window closures and automatic rent payout creation

### Server Actions

- **PayoutsServerActions**: Server-side actions for payout operations
- **AdminServerActions**: Admin actions that trigger payout creation

## Payout Flow

### Refund Flow

1. User submits a refund request
2. Admin reviews and approves the refund request
3. System automatically creates a payout for the refund amount
4. Admin processes the payout (marks it as paid)
5. User receives notification that refund has been processed

### Cancellation Flow

1. User submits a cancellation request
2. Admin reviews and approves the cancellation request
3. System automatically:
   - Creates a refund request for the tenant
   - Creates a cushion payout for the advertiser (compensation)
4. Admin processes both payouts
5. Both tenant and advertiser receive notifications

### Rent Flow (Safety Window)

1. Tenant completes move-in
2. System waits for 24-hour safety window to close
3. After 24 hours, system automatically creates a rent payout for advertiser
4. Admin processes the payout
5. Advertiser receives notification that rent has been paid

## Database Collections

### Payouts Collection

Stores all payout records with the following structure:

```typescript
interface Payout {
  id: string;
  payeeId: string;
  payeeName: string;
  payeePhone: string;
  payeeType: 'advertiser' | 'client';
  paymentMethod: {
    bankName: string;
    accountLast4: string;
    type: 'RIB' | 'IBAN';
  };
  reason: 'Rent – Move-in' | 'Cushion – Pre-move Cancel' | 'Cushion – Haani Max Cancel' | 'Referral Commission' | 'Tenant Refund';
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  sourceId?: string;
  sourceType?: 'rent' | 'referral' | 'refund' | 'cancellation';
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  paidBy?: string;
  notes?: string;
}
```

### Payout Requests Collection

Stores payout requests that require admin approval:

```typescript
interface PayoutRequest {
  id: string;
  userId: string;
  userType: 'advertiser' | 'client';
  amount: number;
  currency: string;
  sourceType: 'rent' | 'referral' | 'refund' | 'cancellation';
  sourceId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  notes?: string;
  paymentMethod?: {
    type: 'RIB' | 'IBAN';
    bankName: string;
    accountNumber: string;
    accountLast4: string;
  };
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  approvedBy?: string;
  rejectedBy?: string;
}
```

## Testing

For testing the payouts system, we have created:

1. **Test Page**: `/dashboard/admin/payouts-test` - A UI for testing various payout scenarios
2. **Test Cases**: Documented in `payouts-test-cases.md`

## Implementation Details

### Automatic Rent Payouts

When a booking's move-in date is more than 24 hours in the past, the system automatically:

1. Marks the booking as having its safety window closed
2. Calculates the platform fee (5% of total)
3. Creates a payout for the advertiser with the remaining amount
4. Updates the booking with the payout information

### Refund Payouts

When an admin approves a refund request, the system:

1. Gets the user's payment method information
2. Creates a payout record with "Tenant Refund" as the reason
3. Links the payout to the refund request
4. Updates the refund request status

### Cancellation Payouts

When an admin approves a cancellation request, the system:

1. Creates a refund request for the tenant
2. Creates a cushion payout for the advertiser
3. The cushion amount depends on how close to move-in the cancellation occurred:
   - Within 3 days of move-in: 500 MAD
   - More than 3 days before move-in: 250 MAD

## Admin Interface

The admin interface for managing payouts includes:

1. **Pending Payouts**: View and process pending payouts
2. **Completed Payouts**: View history of processed payouts
3. **Payout Requests**: View and approve/reject payout requests
4. **Testing Page**: Test various payout scenarios

## Notifications

The system sends notifications for various payout events:

1. **Refund Processed**: Sent to tenant when their refund is processed
2. **Payout Processed**: Sent to advertiser when their payout is processed
3. **Payout Request Approved/Rejected**: Sent when a payout request is approved or rejected

## Error Handling

The system includes robust error handling for various scenarios:

1. Missing payment methods
2. Invalid booking statuses
3. Safety window not yet closed
4. Already processed payouts
5. Invalid user or booking IDs

## Future Improvements

Potential improvements to the payouts system:

1. Integration with payment gateways for automatic disbursement
2. Bulk processing of payouts
3. Enhanced reporting and analytics
4. Additional payout types (promotions, bonuses, etc.)
5. Scheduled automatic processing of all pending payouts 