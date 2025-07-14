# Kaari Referral Program

This document provides an overview of the referral program implementation in the Kaari platform.

## Overview

The referral program allows advertisers (property owners) to refer new users to the platform. When a referred user makes a booking, the advertiser earns a commission. The referred user gets a discount on their first booking.

## Referral Flow

1. **Generate Link**: Advertisers generate a unique referral link from their dashboard
2. **Share Link**: Advertisers share this link with potential users
3. **Claim Discount**: New users click the link and land on the claim discount page
4. **Create Account**: After claiming the discount, users are directed to sign up
5. **Apply Discount**: The discount is automatically applied to the user's account
6. **Use Discount**: User can use the discount on any booking within 7 days
7. **Earn Commission**: When a booking is made, the advertiser earns a commission

## Key Components

### Services

- **ReferralService.ts**: Core service that handles all referral-related operations
  - Creating referral codes
  - Managing referral passes
  - Tracking referral statistics
  - Processing discounts and commissions

### Hooks

- **useReferralProgram.ts**: Hook for advertisers to manage their referral program
  - Get referral data
  - Generate referral links
  - Track referral statistics
  - Request payouts

- **useReferralSignup.ts**: Hook for users to claim and use referral discounts
  - Apply referral codes during signup
  - Get active discounts
  - Apply discounts to bookings

### Utilities

- **referral-utils.ts**: Utility functions for referral code handling
  - Extract codes from URLs
  - Save/retrieve codes from localStorage
  - Generate referral links

### Pages

- **claim-discount.tsx**: Page where users claim their discount
- **referral-program/page.tsx**: Advertiser dashboard for the referral program
- **referral-program/performance/page.tsx**: Detailed referral performance metrics

### Components

- **ReferralDiscountBanner.tsx**: Banner shown to users with an active referral code
- **ReferralSignupField.tsx**: Form field for entering referral codes during signup

## Data Structure

### Firestore Collections

- **referrals/{advertiserId}**: Advertiser's referral data
  - referralCode: Unique code for this advertiser
  - referralPass: Information about the advertiser's referral pass
  - referralStats: Statistics about referrals and earnings
  - referralHistory: History of referrals and their status

- **referralDiscounts**: User discount records
  - userId: User who received the discount
  - advertiserId: Advertiser who provided the referral
  - code: The referral code used
  - amount: Discount amount (200 MAD)
  - expiryDate: When the discount expires (7 days after claiming)
  - isUsed: Whether the discount has been used
  - usedAt: When the discount was used
  - bookingId: The booking where the discount was applied

## Bonus Rates

Advertisers earn different commission rates based on their number of property listings:
- 1-2 listings: 5% commission
- 3-10 listings: 8% commission
- 11+ listings: 10% commission

## Implementation Notes

- Discounts are valid for 7 days after claiming
- Discount amount is fixed at 200 MAD
- Referral codes are automatically generated based on advertiser name and ID
- Referral pass requires maintaining a minimum number of listings or bookings
- Real-time updates are implemented using Firestore listeners

## Testing

To test the referral flow:
1. Log in as an advertiser and get your referral link
2. Open the link in an incognito window
3. Claim the discount and create a new account
4. Make a booking to see the discount applied
5. Check the advertiser dashboard to see the referral recorded

## Future Improvements

- Configurable discount amounts
- Tiered referral program with different reward levels
- Referral analytics dashboard
- Social sharing integration
- Email notifications for successful referrals 