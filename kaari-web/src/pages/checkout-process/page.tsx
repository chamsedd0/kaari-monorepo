import React, { useEffect, useState } from 'react';
import CheckoutProcessContainer from '../../components/skeletons/checkoutprocess/checkout-process-container';
import { useSearchParams } from 'react-router-dom';
import UnifiedHeader from '../../components/skeletons/constructed/headers/unified-header';
import Footer from '../../components/skeletons/constructed/footer/footer';

// Define valid status types
type StatusType = 'success' | 'pending' | 'rejected' | 'payment_failed' | 'refund_processing';

const CheckoutProcess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [initialStep, setInitialStep] = useState(1);
    const [status, setStatus] = useState<StatusType>('success');

    useEffect(() => {
        // Get status from URL parameter
        const statusParam = searchParams.get('status');
        if (statusParam) {
            // Validate that it's a valid status type
            const validStatus = ['success', 'pending', 'rejected', 'payment_failed', 'refund_processing'];
            if (validStatus.includes(statusParam)) {
                setStatus(statusParam as StatusType);
                setInitialStep(3); // Move to the last step if status is provided
            }
        }

        // Get step from URL parameter
        const stepParam = searchParams.get('step');
        if (stepParam) {
            const step = parseInt(stepParam, 10);
            if (!isNaN(step) && step >= 1 && step <= 3) {
                setInitialStep(step);
            }
        }
    }, [searchParams]);

    return (
        <>
            <UnifiedHeader variant="white" userType="user" showSearchBar={true} />
            <CheckoutProcessContainer initialStep={initialStep} successStatus={status} />
            <Footer />
        </>
    );
};

export default CheckoutProcess;
