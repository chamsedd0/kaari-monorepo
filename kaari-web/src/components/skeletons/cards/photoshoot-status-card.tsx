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
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    return dateObj.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const formatTime = (date: Date | string) => {
    const dateObj = new Date(date);
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    return dateObj.toLocaleTimeString(locale, {
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
      doc.text(t('advertiser_dashboard.photoshoot.pdf_header', 'KAARI PHOTOGRAPHY'), pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(14);
      doc.text(t('advertiser_dashboard.photoshoot.pdf_subtitle', 'Photoshoot Summary'), pageWidth / 2, 30, { align: 'center' });
      
      // Add current date
      const currentDate = new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Main content area
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      // Add date to right side
      doc.text(t('advertiser_dashboard.photoshoot.pdf_generated_date', 'Generated on: {{date}}', { date: currentDate }), pageWidth - 15, 50, { align: 'right' });
      
      // Booking ID
      doc.setFont('helvetica', 'bold');
      doc.text(t('advertiser_dashboard.photoshoot.pdf_booking_id', 'Booking ID:'), 15, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(photoshootId, 50, 60);
      
      // Property Information Section
      drawSectionHeading(t('advertiser_dashboard.photoshoot.pdf_property_info', 'PROPERTY INFORMATION'), 80);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(t('advertiser_dashboard.photoshoot.pdf_location', 'Location:'), 20, 90);
      doc.setFont('helvetica', 'normal');
      doc.text(propertyLocation, 60, 90);
      
      // Photoshoot Details Section
      drawSectionHeading(t('advertiser_dashboard.photoshoot.pdf_schedule_info', 'SCHEDULE INFORMATION'), 110);
      
      doc.setFont('helvetica', 'bold');
      doc.text(t('advertiser_dashboard.photoshoot.pdf_date', 'Date:'), 20, 120);
      doc.setFont('helvetica', 'normal');
      doc.text(formatDate(scheduledDate), 60, 120);
      
      doc.setFont('helvetica', 'bold');
      doc.text(t('advertiser_dashboard.photoshoot.pdf_time', 'Time:'), 20, 130);
      doc.setFont('helvetica', 'normal');
      doc.text(timeSlot, 60, 130);
      
      doc.setFont('helvetica', 'bold');
      doc.text(t('advertiser_dashboard.photoshoot.pdf_status', 'Status:'), 20, 140);
      doc.setFont('helvetica', 'normal');
      
      // Set status color based on status type
      if (status === 'assigned') {
        doc.setTextColor(successGreen.r, successGreen.g, successGreen.b);
      } else if (status === 'pending') {
        doc.setTextColor(primaryPurple.r, primaryPurple.g, primaryPurple.b);
      }
      
      doc.text(t(`advertiser_dashboard.photoshoot.${status}`, status.charAt(0).toUpperCase() + status.slice(1)), 60, 140);
      doc.setTextColor(50, 50, 50);
      
      // Photographer Details Section (if assigned)
      if (status === 'assigned' && photographerName) {
        drawSectionHeading(t('advertiser_dashboard.photoshoot.pdf_photographer_info', 'PHOTOGRAPHER INFORMATION'), 160);
        
        doc.setFont('helvetica', 'bold');
        doc.text(t('advertiser_dashboard.photoshoot.pdf_photographer', 'Photographer:'), 20, 170);
        doc.setFont('helvetica', 'normal');
        doc.text(photographerName, 60, 170);
        
        if (photographerInfo) {
          doc.setFont('helvetica', 'bold');
          doc.text(t('advertiser_dashboard.photoshoot.pdf_specialization', 'Specialization:'), 20, 180);
          doc.setFont('helvetica', 'normal');
          doc.text(photographerInfo, 60, 180);
        }
        
        if (phoneNumber) {
          doc.setFont('helvetica', 'bold');
          doc.text(t('advertiser_dashboard.photoshoot.pdf_contact', 'Contact:'), 20, 190);
          doc.setFont('helvetica', 'normal');
          doc.text(phoneNumber, 60, 190);
        }
      }
      
      // Notes section
      drawSectionHeading(t('advertiser_dashboard.photoshoot.pdf_important_notes', 'IMPORTANT NOTES'), status === 'assigned' ? 210 : 160);
      
      // Standard notes table
      const notesY = status === 'assigned' ? 220 : 170;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text([
        t('advertiser_dashboard.photoshoot.pdf_note1', '• Please ensure the property is clean and tidy before the photoshoot.'),
        t('advertiser_dashboard.photoshoot.pdf_note2', '• Remove personal items and declutter all spaces.'),
        t('advertiser_dashboard.photoshoot.pdf_note3', '• Turn on all lights and open curtains for better lighting.'),
        t('advertiser_dashboard.photoshoot.pdf_note4', '• Ensure all rooms are accessible for the photographer.'),
        t('advertiser_dashboard.photoshoot.pdf_note5', '• Have someone available to provide access to the property.')
      ], 20, notesY);
      
      // Footer with Kaari branding
      doc.setFillColor(primaryPurple.r, primaryPurple.g, primaryPurple.b);
      doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(t('advertiser_dashboard.photoshoot.pdf_footer_contact', 'For support: support@kaari.com | www.kaari.com'), pageWidth / 2, pageHeight - 15, { align: 'center' });
      doc.setFontSize(8);
      doc.text(t('advertiser_dashboard.photoshoot.pdf_footer_copyright', '© {{year}} Kaari. All rights reserved.', { year: new Date().getFullYear() }), pageWidth / 2, pageHeight - 8, { align: 'center' });
      
      // Save the document
      const formatToday = new Date().toISOString().slice(0, 10);
      const filename = `Kaari_Photoshoot_${formatToday}_${photoshootId.slice(-5)}.pdf`;
      
      doc.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t('advertiser_dashboard.photoshoot.pdf_error', 'There was an error generating the PDF. Please try again.'));
    }
  };

  return (
    <CardBaseModelStyleUpcomingPhotoshoot>
      <div className="first-container">
        <div className="title-container">
          <div className="circle-number">{number}</div>
          <h3 className="title">{t('advertiser_dashboard.photoshoot.upcoming_title', 'Upcoming Photoshoot')}</h3>
        </div>
        <p className="info-text">{propertyLocation}</p>
      </div>
      
      <div className="middle-container">
        <div className="left-container">
          {status === 'assigned' && photographerImage ? (
            <img src={photographerImage} alt={t('advertiser_dashboard.photoshoot.photographer_alt', 'Photographer')} />
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
                      alt={t('advertiser_dashboard.photoshoot.whatsapp_alt', 'WhatsApp')} 
                      style={{ width: '16px', height: '16px' }} 
                    />
                    {t('advertiser_dashboard.photoshoot.contact_whatsapp', 'Contact via WhatsApp')}
                  </button>
                )}
              </>
            ) : (
              <span className="description2">
                {t('advertiser_dashboard.photoshoot.assigning_message', 'An agent is being assigned to your photoshoot. Please wait a moment.')}
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
            text={t('advertiser_dashboard.photoshoot.reschedule', 'Reschedule')} 
            onClick={onReschedule}
          />
          <BpurpleButtonMB48 
            text={t('advertiser_dashboard.photoshoot.cancel', 'Cancel Photoshoot')} 
            icon={<img src={cancel} alt={t('common.cancel_icon_alt', 'cancel')} />}
            onClick={onCancel}
          />
        </div>
        
        {/* Download Icon */}
        <div 
          className="download-icon"
          onClick={handleDownloadSummary}
        >
          <img src={download} alt={t('advertiser_dashboard.photoshoot.download_alt', 'Download Summary')} />
          <div className="tooltip">{t('advertiser_dashboard.photoshoot.download_tooltip', 'Download Summary')}</div>
        </div>
      </div>
      
      {/* WhatsApp Contact Modal */}
      <WhatsAppContactModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        teamName={photographerName || t('advertiser_dashboard.photoshoot.photographer_team', 'Photography Team')}
        phoneNumber={phoneNumber || ''}
      />
    </CardBaseModelStyleUpcomingPhotoshoot>
  );
};

export default PhotoshootStatusCard; 