'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function PayoutsTestSimple() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Payouts Test Page
      </Typography>
      <Typography paragraph>
        This is a simple test page for payouts functionality.
      </Typography>
      <Button variant="contained" color="primary">
        Test Button
      </Button>
    </Box>
  );
} 