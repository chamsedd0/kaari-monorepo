import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PropertyRequestCardStyle } from "../../styles/cards/card-send-request-style";
import { CertificationBanner } from "../banners/static/certification-banner";
import { PurpleButtonLB60 } from "../buttons/purple_LB60";
import InfoIcon from "../icons/detailsIcon.svg";
import LikeBannerBaseModelLikeVariant1 from "../banners/status/banner-base-model-like-variant-1";
import ShareButton from "../buttons/button-share";
import { IoCalendarOutline, IoChevronDown, IoClose } from 'react-icons/io5';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { useActiveReferralDiscount } from "../../../hooks/useActiveReferralDiscount";
import ReferralDiscountBanner from "../banners/status/referral-discount-banner";
import ReferralDiscountErrorBanner from "../banners/status/referral-discount-error-banner";
import ReferralDiscountExpiryWarning from "../banners/status/referral-discount-expiry-warning";
import { useToastService } from "../../../services/ToastService";

// Date picker styles (from SearchFilterBar)
const DatePickerDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  width: 280px;
  padding: 16px;
`;
const DatePickerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const MonthNavigationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #64748B;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  &:hover { background: #F1F5F9; }
`;
const MonthYearLabel = styled.div`
  font-weight: 500;
  color: #1E293B;
`;
const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 8px;
`;
const DayLabel = styled.div`
  font-size: 12px;
  color: #94A3B8;
  text-align: center;
`;
const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;
const DayButton = styled.button<{ isToday?: boolean; isSelected?: boolean; isCurrentMonth?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  border: none;
  background: ${props =>
    props.isSelected ? Theme.colors.primary :
    props.isToday ? '#EFF6FF' : 'transparent'
  };
  color: ${props =>
    props.isSelected ? 'white' :
    props.isToday ? Theme.colors.primary :
    !props.isCurrentMonth ? '#CBD5E1' : '#1E293B'
  };
  &:hover {
    background: ${props => props.isSelected ? Theme.colors.primary : '#F1F5F9'};
  }
  &:disabled {
    cursor: default;
    color: #CBD5E1;
    background: transparent;
  }
`;

// Loading spinner component
const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${Theme.colors.primary}30;
  border-top: 2px solid ${Theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DiscountLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${Theme.colors.primary}10;
  border-radius: ${Theme.borders.radius.md};
  padding: 12px 16px;
  width: 100%;
  margin-bottom: 16px;
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.gray2};
`;

interface PropertyRequestCardProps {
  title: string;
  isVerified: boolean;
  advertiserName: string;
  advertiserImage: string;
  moveInDate: string;
  priceFor30Days: number;
  serviceFee: number;
  totalPrice: number;
  propertyId: string;
  ownerId: string;
}

const PropertyRequestCard: React.FC<PropertyRequestCardProps> = ({ 
  title, 
  isVerified, 
  advertiserName, 
  advertiserImage, 
  moveInDate, 
  priceFor30Days, 
  serviceFee, 
  totalPrice,
  propertyId,
  ownerId
}) => {
  const navigate = useNavigate();
  const { activeDiscount, loading, error, refreshDiscount } = useActiveReferralDiscount();
  const toast = useToastService();

  // Calculate price with discount applied
  const discountAmount = activeDiscount ? activeDiscount.amount : 0;
  const discountedTotalPrice = Math.max(0, totalPrice - discountAmount);

  // Calculate default date: tomorrow
  const tomorrowISO = getTomorrowISO();
  // If moveInDate is in the future, use it; otherwise, use tomorrow
  const initialDate = (() => {
    if (moveInDate) {
      const moveIn = new Date(moveInDate);
      const now = new Date();
      now.setHours(0,0,0,0);
      if (!isNaN(moveIn.getTime()) && moveIn > now) {
        return moveInDate;
      }
    }
    return tomorrowISO;
  })();

  const [date, setDate] = useState(initialDate);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => new Date(initialDate));
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return 'Select date';
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return 'Select date';
      return new Intl.DateTimeFormat(navigator.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dateObj);
    } catch (e) {
      return 'Select date';
    }
  };

  // Date picker helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysArray = [];
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
    if (prevMonthDays > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
      for (let i = prevMonthDays - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        daysArray.push({ day, month: prevMonth, year: prevMonthYear, isCurrentMonth: false });
      }
    }
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push({ day, month, year, isCurrentMonth: true });
    }
    const totalCells = 42;
    const nextMonthDays = totalCells - daysArray.length;
    if (nextMonthDays > 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextMonthYear = month === 11 ? year + 1 : year;
      for (let day = 1; day <= nextMonthDays; day++) {
        daysArray.push({ day, month: nextMonth, year: nextMonthYear, isCurrentMonth: false });
      }
    }
    return daysArray;
  };
  const formatDateString = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const handleDateSelect = (year: number, month: number, day: number) => {
    const dateString = formatDateString(year, month, day);
    setDate(dateString);
    setDateDropdownOpen(false);
  };
  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };
  const isSelectedDate = (year: number, month: number, day: number) => {
    if (!date) return false;
    try {
      const selectedDate = new Date(date);
      return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
    } catch (e) { return false; }
  };
  const handlePrevMonth = () => setCurrentMonth(prev => { const newMonth = new Date(prev); newMonth.setMonth(newMonth.getMonth() - 1); return newMonth; });
  const handleNextMonth = () => setCurrentMonth(prev => { const newMonth = new Date(prev); newMonth.setMonth(newMonth.getMonth() + 1); return newMonth; });
  // Day names
  const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show toast when discount is about to expire (less than 24 hours)
  useEffect(() => {
    if (activeDiscount && 
        activeDiscount.timeLeft.days === 0 && 
        activeDiscount.timeLeft.hours < 24) {
      toast.showToast(
        'warning',
        'Discount Expiring Soon',
        `Your ${activeDiscount.amount} MAD discount will expire in ${activeDiscount.timeLeft.hours}h ${activeDiscount.timeLeft.minutes}m`,
        true,
        10000
      );
    }
  }, [activeDiscount, toast]);

  const handleSendRequest = () => {
    if (!date) return;
    
    // Store the selected date and discount info in localStorage immediately
    const rentalData = {
      scheduledDate: date,
      visitDate: '',
      message: '',
      intendedLengthOfStayMonths: 0,
      // Add discount information if available
      discount: activeDiscount ? {
        amount: activeDiscount.amount,
        code: activeDiscount.code,
        expiryDate: activeDiscount.expiryDate.toISOString()
      } : null
    };
    localStorage.setItem('rentalApplicationData', JSON.stringify(rentalData));
    
    console.log(`Navigating to checkout with propertyId=${propertyId} and moveInDate=${date}`);
    // Navigate to the new checkout page with propertyId as a query parameter
    // Include discount information in URL if available
    const discountParam = activeDiscount ? `&discount=${activeDiscount.amount}&discountCode=${activeDiscount.code}` : '';
    navigate(`/checkout?propertyId=${propertyId}&moveInDate=${date}${discountParam}`);
  };

  function getTomorrowISO() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().split('T')[0];
  }

  // Navigate to property listings
  const handleBrowseProperties = () => {
    navigate('/property-list');
  };

  return (
    <PropertyRequestCardStyle>
      <div className="title">
        {title}
        {isVerified && <CertificationBanner purple text="Kaari Verified" />}
      </div>
      
      {loading && (
        <DiscountLoadingContainer>
          <LoadingSpinner />
          <span>Checking for available discounts...</span>
        </DiscountLoadingContainer>
      )}
      
      {error && (
        <ReferralDiscountErrorBanner 
          error={error}
          onRetry={refreshDiscount}
        />
      )}
      
      {activeDiscount && (
        <>
          <ReferralDiscountExpiryWarning 
            timeLeft={activeDiscount.timeLeft}
            onBrowseProperties={handleBrowseProperties}
          />
          <ReferralDiscountBanner 
            amount={activeDiscount.amount} 
            timeLeft={activeDiscount.timeLeft}
            code={activeDiscount.code}
          />
        </>
      )}
      
      <div className="advertiser-information">
        <div className="info-title">Advertiser</div>
        <div className="profile-info">
          <div className="profile">
            <div className="badge">Landlord / Broker / Agency</div>
          </div>
          <div className="view-profile" onClick={() => navigate(`/advertiser-profile/${ownerId}`)}>View Profile</div>
        </div>
      </div>
      
      <div className="move-in-date" style={{ position: 'relative' }}>
        <div className="info-title">Move in date</div>
        <div className="details">
          <div className="move-in-date-display" onClick={() => setDateDropdownOpen(!dateDropdownOpen)} style={{ cursor: 'pointer' }}>
            <IoCalendarOutline style={{ marginRight: 8 }} />
            {formatDateForDisplay(date)}
            <IoChevronDown style={{ marginLeft: 8 }} />
            {date && (
              <button 
                type="button"
                style={{ background: 'none', border: 'none', marginLeft: 8, cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); setDate(''); }}
              >
                <IoClose size={16} />
              </button>
            )}
          </div>
          <div className="buttons">
            <ShareButton />
            <LikeBannerBaseModelLikeVariant1 />
          </div>
        </div>
        <DatePickerDropdown isOpen={dateDropdownOpen} ref={datePickerRef} onClick={e => e.stopPropagation()}>
          <DatePickerHeader>
            <MonthNavigationButton type="button" onClick={handlePrevMonth}>&lsaquo;</MonthNavigationButton>
            <MonthYearLabel>{currentMonth.toLocaleDateString(navigator.language, { month: 'long', year: 'numeric' })}</MonthYearLabel>
            <MonthNavigationButton type="button" onClick={handleNextMonth}>&rsaquo;</MonthNavigationButton>
          </DatePickerHeader>
          <DaysHeader>
            {dayNames.map((day, index) => (
              <DayLabel key={index}>{day}</DayLabel>
            ))}
          </DaysHeader>
          <DayGrid>
            {generateCalendarDays().map((day, index) => (
              <DayButton
                key={index}
                type="button"
                isToday={isToday(day.year, day.month, day.day)}
                isSelected={isSelectedDate(day.year, day.month, day.day)}
                isCurrentMonth={day.isCurrentMonth}
                onClick={() => handleDateSelect(day.year, day.month, day.day)}
                disabled={new Date(day.year, day.month, day.day) < new Date(tomorrowISO)}
              >
                {day.day}
              </DayButton>
            ))}
          </DayGrid>
        </DatePickerDropdown>
      </div>
      
      <div className="price-breakdown">
          <div className="row first">Price breakdown <img src={InfoIcon} alt="info" /></div>
        <div className="row">
          <span>Price for 30 days</span>
          <span>{priceFor30Days} MAD</span>
        </div>
        <div className="row">
          <span>Tenant commission</span>
          <span>{serviceFee} MAD</span>
        </div>
        {activeDiscount && (
          <div className="row discount">
            <span>Referral discount</span>
            <span>-{activeDiscount.amount} MAD</span>
          </div>
        )}
        <div className="separation-line"></div>
        <div className="row total">
          <span>In Total</span>
          <span className="total-price">
            {activeDiscount ? (
              <>
                <span style={{ textDecoration: 'line-through', fontSize: '0.8em', marginRight: '8px', color: Theme.colors.gray2 }}>
                  {totalPrice} MAD
                </span>
                {discountedTotalPrice} MAD
              </>
            ) : (
              `${totalPrice} MAD`
            )}
          </span>
        </div>
      </div>
      
      <PurpleButtonLB60 text='Send A Request' onClick={handleSendRequest} disabled={!date} />
      <div className="disclaimer">
        You will not pay anything yet
      </div>
    </PropertyRequestCardStyle>
  );
};

export default PropertyRequestCard;