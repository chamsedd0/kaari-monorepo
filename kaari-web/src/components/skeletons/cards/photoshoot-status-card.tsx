import React, { useState } from 'react';
import { CardBaseModelStyleUpcomingPhotoshoot } from '../../styles/cards/card-base-model-style-upcoming-photoshoot';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import { CountdownTimer } from '../banners/status/countdown-timer';
import cancel from '../icons/Cross-Icon.svg';
import SpinningLoading from '../icons/SpinningLoading';
import WhatsAppContactModal from '../modals/whatsapp-contact-modal';
import whatsapp from '../icons/whatsapp-icon.svg';
import download from '../icons/icon_download.svg';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PhotoshootStatusCardProps {
  photoshootId: string;
  propertyLocation: string;
  scheduledDate: Date | string;
  timeSlot: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  photographerName?: string;
  photographerInfo?: string;
  photographerImage?: string;
  phoneNumber?: string;
  number?: number;
  onReschedule: () => void;
  onCancel: () => void;
}

// Extend the jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const PhotoshootStatusCard: React.FC<PhotoshootStatusCardProps> = ({
  photoshootId,
  propertyLocation,
  scheduledDate,
  timeSlot,
  status,
  photographerName,
  photographerInfo,
  photographerImage,
  phoneNumber,
  number,
  onReschedule,
  onCancel,
}) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const formatTime = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleContactClick = () => {
    if (status === 'assigned' && phoneNumber) {
      setShowWhatsAppModal(true);
    }
  };
  
  const handleDownloadSummary = async () => {
    try {
      // Create a new PDF document with better formatting options
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Theme colors - using RGB values
      const primaryPurple = { r: 113, g: 44, b: 145 }; // Purple
      const successGreen = { r: 41, g: 130, b: 45 }; // Green for assigned status
      const darkGray = { r: 50, g: 50, b: 50 }; // Dark gray for section backgrounds
      
      // Section headings with icons function
      const drawSectionHeading = (text: string, y: number): void => {
        // Heading background - dark charcoal
        doc.setFillColor(darkGray.r, darkGray.g, darkGray.b);
        try {
          doc.roundedRect(15, y - 8, pageWidth - 30, 14, 3, 3, 'F');
        } catch (e) {
          doc.rect(15, y - 8, pageWidth - 30, 14, 'F');
        }
        
        // Heading text - white
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(text, 25, y);
        
        // Add purple circle as icon
        doc.setFillColor(primaryPurple.r, primaryPurple.g, primaryPurple.b);
        doc.circle(20, y - 1, 2.5, 'F');
      };
      
      // Remove background pattern as it's not showing in the screenshot
      
      // Add a colored header bar - full width purple banner
      doc.setFillColor(primaryPurple.r, primaryPurple.g, primaryPurple.b);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Add title to header - center aligned, all caps
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('KAARI PHOTOGRAPHY', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(14);
      doc.text('PHOTOSHOOT BOOKING SUMMARY', pageWidth / 2, 30, { align: 'center' });
      
      // Add curved white section under header
      // We'll create a white background for the rest of the page with a curved top edge
      // by adding a white rectangle that overlaps with the header
      doc.setFillColor(255, 255, 255);
      
      // Create a diagonal line effect at the top of the white section
      // This simulates the curved design in the screenshot
      const points = [];
      for (let x = 0; x <= pageWidth; x += 5) {
        points.push([x, 40 + (x / pageWidth) * 15]);
      }
      
      // Fill the area below the curve
      doc.setFillColor(255, 255, 255);
      doc.moveTo(0, 55);
      
      // Add points along the curve
      for (const point of points) {
        doc.lineTo(point[0], point[1]);
      }
      
      // Complete the polygon
      doc.lineTo(pageWidth, pageHeight);
      doc.lineTo(0, pageHeight);
      doc.lineTo(0, 55);
      doc.fill();
      
      // Booking Reference - positioned where shown in screenshot
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Booking Reference: ${photoshootId}`, 20, 70);
      
      // Status box with rounded corners - make it green for assigned with proper positioning
      if (status === 'assigned') {
        doc.setFillColor(successGreen.r, successGreen.g, successGreen.b);
      } else {
        doc.setFillColor(primaryPurple.r, primaryPurple.g, primaryPurple.b);
      }
      
      // Create status box with rounded corners - make it wider and more visible
      try {
        doc.roundedRect(pageWidth - 100, 65, 80, 12, 6, 6, 'F');
      } catch (e) {
        doc.rect(pageWidth - 100, 65, 80, 12, 'F');
      }
      
      // Add status text - all caps as shown in screenshot
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(status.toUpperCase(), pageWidth - 60, 72, { align: 'center' });
      
      // Section headings - positioned as in the screenshot
      drawSectionHeading('BOOKING DETAILS', 100);
      
      // Details section - no background, just text
      const details = [
        ['Property:', propertyLocation],
        ['Date:', formatDate(scheduledDate)],
        ['Time:', timeSlot],
        ['Photographer:', photographerName || 'Pending Assignment']
      ];
      
      // Add details as simple text without background
      details.forEach((detail, index) => {
        // Label (bold)
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text(detail[0], 25, 120 + (index * 15));
        
        // Value (normal)
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(20, 20, 20);
        doc.text(detail[1], 120, 120 + (index * 15));
      });
      
      // Important notes section
      drawSectionHeading('IMPORTANT NOTES', 190);
      
      // Notes with bullet points - format as shown in screenshot
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      const notes = [
        'Please ensure the property is tidy and well-presented on the scheduled date.',
        'The photographer will arrive at the beginning of the time slot.',
        'The photoshoot typically takes 1-2 hours depending on property size.',
        'You will receive your photos within 48 hours after the photoshoot.',
        'To reschedule or cancel, please do so at least 24 hours in advance.'
      ];
      
      notes.forEach((note, index) => {
        // Add bullet symbol
        doc.text('•', 25, 210 + (index * 15));
        
        // Add note text with proper spacing
        doc.text(note, 35, 210 + (index * 15));
      });
      
      // No visible footer in the screenshot, so removing that
      
      // Save PDF
      const filename = `Kaari_Photoshoot_${photoshootId}.pdf`;
      doc.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  return (
    <CardBaseModelStyleUpcomingPhotoshoot>
      <div className="first-container">
        <div className="title-container">
          <div className="circle-number">{number}</div>
          <h3 className="title">Upcoming Photoshoot</h3>
        </div>
        <p className="info-text">{propertyLocation}</p>
      </div>
      
      <div className="middle-container">
        <div className="left-container">
          {status === 'assigned' && photographerImage ? (
            <img src={photographerImage} alt="Photographer" />
          ) : (
            <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SpinningLoading />
            </div>
          )}
          <div className="personal-info-container">
            {status === 'assigned' ? (
              <>
                <span className="name">{photographerName}</span>
                <span className="info">{photographerInfo}</span>
                {phoneNumber && (
                  <button 
                    onClick={handleContactClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: '#29822D',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 14px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      width: 'fit-content',
                      marginTop: '10px',
                      boxShadow: '0 2px 5px rgba(41, 130, 45, 0.2)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#1f6122';
                      e.currentTarget.style.boxShadow = '0 3px 8px rgba(41, 130, 45, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#29822D';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(41, 130, 45, 0.2)';
                    }}
                  >
                    <img 
                      src={whatsapp} 
                      alt="WhatsApp" 
                      style={{ width: '16px', height: '16px' }} 
                    />
                    Contact via WhatsApp
                  </button>
                )}
              </>
            ) : (
              <span className="description2">
                An agent is being assigned to your photoshoot. Please wait a moment.
              </span>
            )}
          </div>
        </div>
        <div className="right-container">
          <span className="date">{formatDate(scheduledDate)}</span>
          <span className="time">
            <CountdownTimer targetDate={scheduledDate} timeSlot={timeSlot} />
          </span>
        </div>
      </div>
      
      <div className="bottom-container">
        <div className="button-container">
          <PurpleButtonMB48 
            text="Reschedule" 
            onClick={onReschedule}
          />
          <BpurpleButtonMB48 
            text="Cancel Photoshoot" 
            icon={<img src={cancel} alt="cancel" />}
            onClick={onCancel}
          />
        </div>
        
        {/* Download Icon */}
        <div 
          className="download-icon"
          onClick={handleDownloadSummary}
        >
          <img src={download} alt="Download Summary" />
          <div className="tooltip">Download Summary</div>
        </div>
      </div>
      
      {/* WhatsApp Contact Modal */}
      <WhatsAppContactModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        teamName={photographerName || 'Photography Team'}
        phoneNumber={phoneNumber || ''}
      />
    </CardBaseModelStyleUpcomingPhotoshoot>
  );
};

export default PhotoshootStatusCard; 