import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Theme } from "../../../theme/theme";
import { IoCalendarOutline, IoChevronDown, IoClose } from 'react-icons/io5';
import InfoIcon from "../icons/detailsIcon.svg";
import { useNavigate } from "react-router-dom";
import { useActiveReferralDiscount } from "../../../hooks/useActiveReferralDiscount";
import ReferralDiscountBanner from "../banners/status/referral-discount-banner";
import ReferralDiscountErrorBanner from "../banners/status/referral-discount-error-banner";
import ReferralDiscountExpiryWarning from "../banners/status/referral-discount-expiry-warning";
import { useToastService } from "../../../services/ToastService";
import { PurpleButtonLB60 } from "../buttons/purple_LB60";

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 700px) and (max-width: 1300px) {
    grid-template-columns: 1fr 1.1fr;
    grid-template-areas:
      "header header"
      "left right";
    align-items: start;
    gap: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  .title {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
  }
  @media (min-width: 700px) and (max-width: 1300px) { grid-area: header; }
`;

const PropertyInfoCard = styled.div`
  display: none;
  @media (min-width: 700px) and (max-width: 1300px) {
    display: block;
  }
  background: ${Theme.colors.white};
  border: ${Theme.borders.primary};
  border-radius: ${Theme.borders.radius.md};
  overflow: hidden;

  .cover {
    width: 100%;
    height: 160px;
    object-fit: cover;
    display: block;
  }

  .body {
    padding: 12px 14px;
  }

  .title {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
    margin-bottom: 6px;
  }

  .meta {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
  }
`;

const LeftColumn = styled.div`
  display: none;
  @media (min-width: 700px) and (max-width: 1300px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    grid-area: left;
  }
`;

const RightPane = styled.div`
  @media (min-width: 700px) and (max-width: 1300px) {
    grid-area: right;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
  }
`;

const DateField = styled.button`
  border: ${Theme.borders.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.quaternary};
  padding: 12px 16px;
  border-radius: ${Theme.borders.radius.extreme};
  width: 100%;
  background: ${Theme.colors.white};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.gray2};
  padding: 6px 0;
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font: ${Theme.typography.fonts.largeB};
  color: ${Theme.colors.black};
  .total-price {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.secondary};
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${Theme.colors.tertiary};
`;

// Reuse existing date picker styles from desktop where possible; provide compact grid here
const DatePickerDropdown = styled.div<{ isOpen: boolean }>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 84px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.18);
  z-index: 3000;
  display: ${p => p.isOpen ? 'block' : 'none'};
  padding: 10px;
  width: 90vw;
  max-width: 360px;
  @media (max-width: 700px) {
    width: 92vw;
    max-width: 320px;
    padding: 8px;
  }
`;

const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 6px;
  div { text-align: center; font-size: 12px; color: #94A3B8; }
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DayButton = styled.button<{ isToday?: boolean; isSelected?: boolean; isCurrentMonth?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  border: none;
  background: ${props => props.isSelected ? Theme.colors.primary : props.isToday ? '#EFF6FF' : 'transparent'};
  color: ${props => props.isSelected ? 'white' : props.isToday ? Theme.colors.primary : !props.isCurrentMonth ? '#CBD5E1' : '#1E293B'};
`;

const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${Theme.colors.white};
  padding-top: 8px;
  margin-top: auto;
`;

const DiscountContainer = styled.div``;

interface Props {
  title: string;
  isVerified: boolean;
  moveInDate: string;
  priceFor30Days: number;
  serviceFee: number;
  totalPrice: number;
  propertyId: string;
  ownerId: string;
  imageUrl?: string;
  city?: string;
  country?: string;
}

const MobilePropertyRequestCard: React.FC<Props> = ({
  title,
  isVerified,
  moveInDate,
  priceFor30Days,
  serviceFee,
  totalPrice,
  propertyId,
  ownerId,
  imageUrl,
  city,
  country
}) => {
  const navigate = useNavigate();
  const { activeDiscount, loading, error, refreshDiscount } = useActiveReferralDiscount();
  const toast = useToastService();

  const discountAmount = activeDiscount ? activeDiscount.amount : 0;
  const discountedTotalPrice = Math.max(0, totalPrice - discountAmount);

  // date handling
  const tomorrowISO = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    t.setHours(0,0,0,0);
    return t.toISOString().split('T')[0];
  }, []);

  const initialDate = useMemo(() => {
    if (moveInDate) {
      const d = new Date(moveInDate); const now = new Date(); now.setHours(0,0,0,0);
      if (!isNaN(d.getTime()) && d > now) return moveInDate;
    }
    return tomorrowISO;
  }, [moveInDate, tomorrowISO]);

  const [date, setDate] = useState(initialDate);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (activeDiscount && activeDiscount.timeLeft.days === 0 && activeDiscount.timeLeft.hours < 24) {
      toast.showToast('warning','Discount Expiring Soon',`Your ${activeDiscount.amount} MAD discount will expire in ${activeDiscount.timeLeft.hours}h ${activeDiscount.timeLeft.minutes}m`,true,10000);
    }
  }, [activeDiscount, toast]);

  const handleSendRequest = () => {
    if (!date) return;
    const rentalData = {
      scheduledDate: date,
      visitDate: '',
      message: '',
      intendedLengthOfStayMonths: 0,
      discount: activeDiscount ? { amount: activeDiscount.amount, code: activeDiscount.code, expiryDate: activeDiscount.expiryDate.toISOString() } : null
    };
    localStorage.setItem('rentalApplicationData', JSON.stringify(rentalData));
    const discountParam = activeDiscount ? `&discount=${activeDiscount.amount}&discountCode=${activeDiscount.code}` : '';
    navigate(`/checkout?propertyId=${propertyId}&moveInDate=${date}${discountParam}`);
  };

  // helpers for calendar
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
  const [currentMonth, setCurrentMonth] = useState(() => new Date(initialDate));
  const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const isToday = (y:number,m:number,d:number) => { const t=new Date(); return t.getDate()===d && t.getMonth()===m && t.getFullYear()===y; };
  const isSelectedDate = (y:number,m:number,d:number) => { if(!date) return false; const s=new Date(date); return s.getDate()===d && s.getMonth()===m && s.getFullYear()===y; };
  const formatDateString = (y:number,m:number,d:number) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const generateCalendarDays = () => {
    const y=currentMonth.getFullYear(); const m=currentMonth.getMonth(); const dim=getDaysInMonth(y,m); const first=getFirstDayOfMonth(y,m);
    const days:any[]=[]; const prev = first===0?6:first-1; if(prev>0){const pm=m===0?11:m-1; const py=m===0?y-1:y; const dimp=getDaysInMonth(py,pm); for(let i=prev-1;i>=0;i--){const d=dimp-i; days.push({day:d,month:pm,year:py,isCurrentMonth:false});}}
    for(let d=1; d<=dim; d++){ days.push({day:d,month:m,year:y,isCurrentMonth:true}); }
    const totalCells=42; const next=totalCells-days.length; if(next>0){const nm=m===11?0:m+1; const ny=m===11?y+1:y; for(let d=1; d<=next; d++){days.push({day:d,month:nm,year:ny,isCurrentMonth:false});}}
    return days;
  };

  const formatForDisplay = (ds: string) => {
    if (!ds) return 'Select date';
    const o = new Date(ds); if (isNaN(o.getTime())) return 'Select date';
    return new Intl.DateTimeFormat(navigator.language, { year: 'numeric', month: 'short', day: 'numeric' }).format(o);
  };

  return (
    <Container>
      <Header>
        <div className="title">Send a request</div>
      </Header>

      {/* Left column with property info and discount */}
      <LeftColumn>
        <PropertyInfoCard>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img className="cover" src={(imageUrl as string) || "/images/property-fallback.jpg"} />
          <div className="body">
            <div className="title">{title}</div>
            <div className="meta">{[city, country].filter(Boolean).join(', ')}</div>
          </div>
        </PropertyInfoCard>

        <DiscountContainer>
          {loading && (
            <div style={{ font: Theme.typography.fonts.smallM, color: Theme.colors.gray2 }}>Checking for available discounts...</div>
          )}
          {error && (
            <ReferralDiscountErrorBanner error={error} onRetry={refreshDiscount} />
          )}
          {activeDiscount && (
            <>
              <ReferralDiscountExpiryWarning timeLeft={activeDiscount.timeLeft} onBrowseProperties={() => {}} />
              <ReferralDiscountBanner amount={activeDiscount.amount} timeLeft={activeDiscount.timeLeft} code={activeDiscount.code} />
            </>
          )}
        </DiscountContainer>
      </LeftColumn>

      <RightPane>
      <div style={{ position: 'relative', paddingTop: 16 }} ref={ref}>
        <DateField type="button" onClick={() => setOpen(o => !o)}>
          <IoCalendarOutline style={{ marginRight: 8 }} />
          {formatForDisplay(date)}
          <IoChevronDown style={{ marginLeft: 8 }} />
          {date && (
            <span style={{ marginLeft: 8 }} onClick={e => { e.stopPropagation(); setDate(''); }}><IoClose size={16} /></span>
          )}
        </DateField>
        <DatePickerDropdown isOpen={open} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <button type="button" onClick={() => setCurrentMonth(prev => { const n=new Date(prev); n.setMonth(n.getMonth()-1); return n; })}>&lsaquo;</button>
            <div style={{ fontWeight: 600 }}>{currentMonth.toLocaleDateString(navigator.language, { month: 'long', year: 'numeric' })}</div>
            <button type="button" onClick={() => setCurrentMonth(prev => { const n=new Date(prev); n.setMonth(n.getMonth()+1); return n; })}>&rsaquo;</button>
          </div>
          <DaysHeader>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>(<div key={i}>{d}</div>))}</DaysHeader>
          <DayGrid>
            {generateCalendarDays().map((d:any,idx:number)=> (
              <DayButton key={idx} type="button" isToday={isToday(d.year,d.month,d.day)} isSelected={isSelectedDate(d.year,d.month,d.day)} isCurrentMonth={d.isCurrentMonth} disabled={new Date(d.year,d.month,d.day) < new Date(tomorrowISO)} onClick={()=>{ setDate(formatDateString(d.year,d.month,d.day)); setOpen(false); }}>
                {d.day}
              </DayButton>
            ))}
          </DayGrid>
        </DatePickerDropdown>
      </div>

      <div>
        <Row style={{ marginBottom: 8 }}>
          <span>Price breakdown <img src={InfoIcon} alt="info" style={{ width: 18, height: 18, verticalAlign: 'middle' }} /></span>
        </Row>
        <Row>
          <span>Price for 30 days</span>
          <span>{priceFor30Days} MAD</span>
        </Row>
        <Row>
          <span>Tenant commission</span>
          <span>{serviceFee} MAD</span>
        </Row>
        {activeDiscount && (
          <Row style={{ color: Theme.colors.secondary, font: Theme.typography.fonts.mediumB }}>
            <span>Referral discount</span>
            <span>-{activeDiscount.amount} MAD</span>
          </Row>
        )}
        <Divider />
        <Total>
          <span>In Total</span>
          <span className="total-price">
            {activeDiscount ? (
              <>
                <span style={{ textDecoration: 'line-through', fontSize: '0.8em', marginRight: '8px', color: Theme.colors.gray2 }}>{totalPrice} MAD</span>
                {discountedTotalPrice} MAD
              </>
            ) : (
              `${totalPrice} MAD`
            )}
          </span>
        </Total>
      </div>

      <StickyFooter>
        <PurpleButtonLB60 text='Send A Request' onClick={handleSendRequest} disabled={!date} />
        <div style={{ textAlign: 'center', color: Theme.colors.primary, marginTop: 8, font: Theme.typography.fonts.mediumM }}>You will not pay anything yet</div>
      </StickyFooter>
      </RightPane>
    </Container>
  );
};

export default MobilePropertyRequestCard;


