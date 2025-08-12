import { ScrollView, View, Text } from 'react-native';
import { Button } from '../src/components/ui/Button';
import { Tag } from '../src/components/ui/Tag';
import { Input } from '../src/components/ui/Input';
import { TextArea } from '../src/components/ui/TextArea';
import { Card } from '../src/components/ui/Card';
import { Stars } from '../src/components/ui/Stars';
import { Switch } from '../src/components/ui/Switch';
import { ProgressBar } from '../src/components/ui/ProgressBar';
import { Chip } from '../src/components/ui/Chip';
import { Header } from '../src/components/ui/Header';
import { PaginationDots } from '../src/components/ui/PaginationDots';
import { PropertyCard } from '../src/components/cards/PropertyCard';
import { RequestCard } from '../src/components/cards/RequestCard';
import { ReviewCard } from '../src/components/cards/ReviewCard';
import { CreditCard } from '../src/components/ui/CreditCard';
import { PriceBreakdown } from '../src/components/booking/PriceBreakdown';
import { PaymentMethodPicker } from '../src/components/booking/PaymentMethodPicker';
import { PhotoshootBookingCard } from '../src/components/photoshoot/PhotoshootBookingCard';
import { useState } from 'react';
import { AlertBanner } from '../src/components/ui/AlertBanner';
import { Modal as SimpleModal } from '../src/components/ui/Modal';
import { BottomDrawer } from '../src/components/ui/BottomDrawer';
import { Icon } from '../src/components/ui/Icon';
import { ConfirmDialog } from '../src/components/ui/ConfirmDialog';
import { SegmentedTabs } from '../src/components/ui/SegmentedTabs';
import { MessageBubble } from '../src/components/chat/MessageBubble';
import { StatusBlock } from '../src/components/ui/StatusBlock';
import { PerformanceCard } from '../src/components/cards/PerformanceCard';
import { ReferralPerformance } from '../src/components/cards/ReferralPerformance';
import { ReferralSimulator } from '../src/components/cards/ReferralSimulator';
import { Perk } from '../src/components/ui/Perk';
import { TenantProtectionBanner } from '../src/components/ui/TenantProtectionBanner';
import { UtilityChip } from '../src/components/ui/UtilityChip';
import { LoginBlock } from '../src/components/ui/LoginBlock';
import { ProfileNavBar } from '../src/components/ui/ProfileNavBar';
import { StatusTag } from '../src/components/ui/StatusTag';
import { FilterTag } from '../src/components/ui/FilterTag';
import { FooterButton } from '../src/components/ui/FooterButton';
import { Timer } from '../src/components/ui/Timer';
import { SegmentedButtons } from '../src/components/ui/SegmentedButtons';
import { IconButton } from '../src/components/ui/IconButton';
import { LikeButton } from '../src/components/ui/LikeButton';
import { SearchBarItem } from '../src/components/ui/SearchBarItem';
import { Counter } from '../src/components/ui/Counter';
import { Selector } from '../src/components/ui/Selector';
import { ReservationCard } from '../src/components/cards/ReservationCard';
import { PaymentCard } from '../src/components/cards/PaymentCard';
import { MessageCard } from '../src/components/cards/MessageCard';
import { RadialSelector } from '../src/components/ui/RadialSelector';
import { TimeChoice } from '../src/components/ui/TimeChoice';
import { FAQItem } from '../src/components/ui/FAQItem';
import { ListingRequestCard } from '../src/components/cards/ListingRequestCard';
import { MonthlyPaymentsSummaryCard } from '../src/components/cards/MonthlyPaymentsSummaryCard';
import { CommissionRatePopup } from '../src/components/popups/CommissionRatePopup';
import { ReservationRequestPopup } from '../src/components/popups/ReservationRequestPopup';
import { PaymentDetailsPopup } from '../src/components/popups/PaymentDetailsPopup';
import { SupportedDocumentsPopup } from '../src/components/popups/SupportedDocumentsPopup';
// Newly added UI wrappers/primitives
import { Review as ReviewUI } from '../src/components/ui/Review';
import { Reservation as ReservationUI } from '../src/components/ui/Reservation';
import { ReservationList } from '../src/components/ui/ReservationList';
import { RequestCard as RequestCardUI } from '../src/components/ui/RequestCard';
import { Message as MessageUI } from '../src/components/ui/Message';
import { MessageFrame } from '../src/components/ui/MessageFrame';
import { Logo } from '../src/components/ui/Logo';
import { ProfileLink } from '../src/components/ui/ProfileLink';
import { PaymentStatus } from '../src/components/ui/PaymentStatus';
import { PaymentsCard, PaymentsSummary } from '../src/components/ui/Payments';
import { Redirect } from '../src/components/ui/Redirect';
import { Setting } from '../src/components/ui/Setting';
import { SupportedDocuments } from '../src/components/ui/SupportedDocuments';
import { Tenant as TenantUI } from '../src/components/ui/Tenant';
import { WeekdayChat } from '../src/components/ui/WeekdayChat';
import { PaymentByTenant } from '../src/components/ui/PaymentByTenant';
import { Property as PropertyUI } from '../src/components/ui/Properties';
import { AmountOfPeople } from '../src/components/ui/AmountOfPeople';
import { PropertyUtility } from '../src/components/ui/PropertyUtility';
import { PropertiesGrid } from '../src/components/ui/PropertiesGrid';
import { RoomDescriptionCard as RoomDescription } from '../src/components/ui/RoomDescriptionCard';
import { RadioGroup } from '../src/components/ui/RadioGroup';
import { Checkbox } from '../src/components/ui/Checkbox';
import { Knob } from '../src/components/ui/Knob';
import { DragHandle } from '../src/components/ui/DragHandle';
import { SectionBadge } from '../src/components/ui/SectionBadge';
import { VerifiedTag } from '../src/components/ui/VerifiedTag';
import { TextBar } from '../src/components/ui/TextBar';
import { ListingPerformance as ListingPerformanceUI } from '../src/components/ui/ListingPerformance';
import { ReferralPerformance as ReferralPerformanceUI } from '../src/components/ui/ReferralPerformance';
import { PhotoshootHistoryItem } from '../src/components/ui/PhotoshootHistoryItem';
import { NavBarPreview } from '../src/components/ui/NavBarPreview';

export default function ComponentsGallery() {
  const [checked, setChecked] = useState(true);
  const [count, setCount] = useState(1);
  const [tab, setTab] = useState('one');
  const [dialog, setDialog] = useState(false);
  const [showCommission, setShowCommission] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [commission, setCommission] = useState('10');
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 gap-6">
        <Header title="Components" />
        <Text className="text-xl font-bold">Checkbox</Text>
        <View className="flex-row gap-2 items-center">
          <Checkbox checked={checked} onChange={setChecked} />
          <Text>{checked ? 'Checked' : 'Unchecked'}</Text>
        </View>
        <Text className="text-xl font-bold">Typography (Visby CF)</Text>
        <View className="gap-1">
          <Text style={{ fontFamily: 'VisbyCF' }}>VisbyCF Regular/Medium</Text>
          <Text style={{ fontFamily: 'VisbyCF-DemiBold' }}>VisbyCF DemiBold</Text>
          <Text style={{ fontFamily: 'VisbyCF-Bold' }}>VisbyCF Bold</Text>
          <Text style={{ fontFamily: 'VisbyCF-Heavy' }}>VisbyCF Heavy</Text>
        </View>
        <Text className="text-xl font-bold">Buttons</Text>
        <View className="gap-3">
          <Button title="Button" iconName="messages" />
          <Button title="Button" variant="secondary" iconName="messages" />
          <SegmentedButtons left={{ label: 'Skip for now', value: 'skip' }} right={{ label: 'Write a Review', value: 'review' }} value={'skip'} onChange={() => {}} />
        </View>

        <Text className="text-xl font-bold">Tags</Text>
        <View className="flex-row gap-2">
          <Tag label="Default" />
          <Tag label="Success" tone="success" />
          <Tag label="Warning" tone="warning" />
          <Tag label="Danger" tone="danger" />
        </View>

        <Text className="text-xl font-bold">Inputs</Text>
        <View className="gap-3">
          <Input placeholder="Your e-mail" />
          <Input placeholder="Your e-mail" variant="success" />
          <Input placeholder="Your e-mail" variant="error" />
          <Input placeholder="Password" variant="password" />
          <Input placeholder="Aa1234" variant="password" secureTextEntry />
          <Input placeholder="********" variant="password" secureTextEntry />
          <Input placeholder="Aa1234" />
          <Input placeholder="********" variant="error" />
          <Input placeholder="Aa1234" variant="error" />
          <Input placeholder="Your e-mail" variant="withAction" onActionPress={() => {}} />
          <Input placeholder="Your e-mail" variant="withAction" />
          <Input placeholder="Your e-mail" variant="withAction" />
          <Input placeholder="Aa1234" />
          <Input placeholder="Aa1234" variant="filled" />
        </View>
        <Text className="text-xl font-bold">Text Areas</Text>
        <View className="gap-3">
          <TextArea placeholder="Tell us more about yourself" />
          <TextArea placeholder="Tell us more about yourself" variant="success" />
          <TextArea placeholder="Tell us more about yourself" variant="error" />
        </View>

        <Text className="text-xl font-bold">Cards</Text>
        <Card style={{ padding: 16 }}>
          <Text>Regular Card</Text>
        </Card>
        <Card glass style={{ padding: 16 }}>
          <Text>Glass Card</Text>
        </Card>

        <Text className="text-xl font-bold">Stars</Text>
        <Stars rating={4.5} />

        <Text className="text-xl font-bold">Switch</Text>
        <Switch value={checked} onValueChange={setChecked} />

        <Text className="text-xl font-bold">Progress</Text>
        <ProgressBar value={60} />

        <Text className="text-xl font-bold">Chips</Text>
        <View className="flex-row gap-2">
          <Chip label="Studio" />
          <Chip label="Furnished" selected />
        </View>

        <Text className="text-xl font-bold">Status Tag</Text>
        <View className="flex-row gap-2">
          <StatusTag status="pending" />
          <StatusTag status="paid" />
          <StatusTag status="accepted" />
        </View>

        <Text className="text-xl font-bold">Filter Tag</Text>
        <View className="flex-row gap-2">
          <FilterTag label="Broker" />
          <FilterTag label="Active" active />
        </View>

        <Text className="text-xl font-bold">Icon Buttons</Text>
        <View className="flex-row gap-2">
          <IconButton name="close" />
          <LikeButton />
        </View>

        <Text className="text-xl font-bold">Search Bar</Text>
        <SearchBarItem />

        <Text className="text-xl font-bold">Counter</Text>
        <Counter value={count} onChange={setCount} />
        <Text className="text-xl font-bold">Amount of People</Text>
        <AmountOfPeople value={count} onChange={setCount} />

        <Text className="text-xl font-bold">Selector</Text>
        <Selector options={[{ label: 'Study', value: 'study' }, { label: 'Work', value: 'work' }]} value={'study'} onChange={() => {}} />
        <RadialSelector options={[{ label: 'Studio', value: 'studio' }, { label: 'Room', value: 'room' }, { label: 'Apartment', value: 'apt' }]} />

        <Text className="text-xl font-bold">Pagination Dots</Text>
        <PaginationDots index={1} total={5} />

        <Text className="text-xl font-bold">Property Card</Text>
        <PropertyCard title="City Studio" price="4,500 MAD" badge="broker" />
        <Text className="text-base text-gray500 mt-2">Property (UI re-export)</Text>
        <PropertyUI title="City Studio" price="4,500 MAD" badge="broker" />
        <Text className="text-xl font-bold mt-4">Properties Grid</Text>
        <PropertiesGrid items={[{ title: 'City Studio', price: '4,500 MAD', badge: 'broker' }, { title: 'Old Town Studio', price: '3,200 MAD' }, { title: 'Agadir Loft', price: '5,200 MAD' }, { title: 'Beach Apartment', price: '7,800 MAD' }]} />

        <Text className="text-xl font-bold">Listing Request</Text>
        <ListingRequestCard title="Apartment" subtitle="flat in the center of Agadir" user="John, 20    1 month" />
        <Text className="text-xl font-bold">Room Description</Text>
        <RoomDescription title="Room Description" description="A bright studio in the heart of the city with natural light and modern finishes." />

        <Text className="text-xl font-bold">Monthly Payments Summary</Text>
        <MonthlyPaymentsSummaryCard month="April 2024" income="3000$" tenants={3} total="35000$" />

        <Text className="text-xl font-bold">Request Card</Text>
        <RequestCard name="John Doe" status="pending" moveInDate="2025-10-01" people={2} />
        <Text className="text-base text-gray500 mt-2">Request (UI re-export)</Text>
        <RequestCardUI name="John Doe" status="pending" moveInDate="2025-10-01" people={2} />
        <Text className="text-base text-gray500 mt-2">Reservation List (UI)</Text>
        <ReservationList items={[{ title: 'City Studio', status: 'paid', date: '2025-10-01', people: 2 }, { title: 'Downtown Loft', status: 'accepted', date: '2025-11-15', people: 1 }]} />

        <Text className="text-xl font-bold">Reservation</Text>
        <ReservationCard title="City Studio" status="paid" date="2025-10-01" people={2} />
        <Text className="text-base text-gray500 mt-2">Reservation (UI re-export)</Text>
        <ReservationUI title="City Studio" status="paid" date="2025-10-01" people={2} />

        <Text className="text-xl font-bold">Payment</Text>
        <PaymentCard amount="4,500 MAD" date="2025-10-05" status="paid" />
        <Text className="text-base text-gray500 mt-2">Payments (UI re-exports)</Text>
        <PaymentsCard amount="4,500 MAD" date="2025-10-05" status="paid" />
        <PaymentsSummary month="April 2024" income="3000$" tenants={3} total="35000$" />

        <Text className="text-xl font-bold">Message</Text>
        <MessageCard name="Support" message="Your request was accepted" time="12:30" unread />
        <Text className="text-base text-gray500 mt-2">Message (UI)</Text>
        <MessageUI text="Hello!" />
        <MessageUI text="Hi there" mine />
        <MessageFrame title="Support Chat" messages={[{ text: 'Hello!' }, { text: 'Hi there', mine: true }]} />

        <Text className="text-xl font-bold">Review</Text>
        <ReviewCard author="Alice" rating={5} content="Great place!" date="Apr 2025" />
        <Text className="text-base text-gray500 mt-2">Review (UI re-export)</Text>
        <ReviewUI author="Alice" rating={5} content="Great place!" date="Apr 2025" />

        <Text className="text-xl font-bold">Timer</Text>
        <Text className="text-base text-gray500">Labeled</Text>
        <View className="rounded-2xl overflow-hidden">
          <View className="bg-[rgba(99,177,255,0.25)] p-4">
            <Timer target={Date.now() + 24 * 3600 * 1000 + 23 * 3600 * 1000 + 59 * 60 * 1000 + 45 * 1000} variant="labeled" showDays />
          </View>
        </View>
        <Text className="text-base text-gray500 mt-4">Compact Light</Text>
        <Timer target={Date.now() + 23 * 3600 * 1000 + 59 * 60 * 1000 + 45 * 1000} variant="compactLight" showDays={false} />
        <Text className="text-base text-gray500 mt-4">Compact Accent</Text>
        <Timer target={Date.now() + 23 * 3600 * 1000 + 59 * 60 * 1000 + 45 * 1000} variant="compactAccent" showDays={false} />

        <Text className="text-xl font-bold">Credit Card</Text>
        <CreditCard brand="visa" last4="4242" name="John Doe" />

        <Text className="text-xl font-bold">Booking Price Breakdown</Text>
        <PriceBreakdown
          rows={[
            { label: 'Monthly rent', value: '4,500 MAD' },
            { label: 'Service fee', value: '1,125 MAD' },
            { label: 'Broker fee', value: '450 MAD' },
            { label: 'Discount', value: '-0 MAD', tone: 'muted' },
          ]}
          total={'6,075 MAD'}
        />

        <Text className="text-xl font-bold">Payment Methods</Text>
        <PaymentMethodPicker methods={[{ id: '1', brand: 'visa', last4: '4242', name: 'John Doe' }]} selectedId={'1'} onSelect={() => {}} />
        <Text className="text-base text-gray500 mt-2">Payment by Tenant (UI)</Text>
        <PaymentByTenant methods={[{ id: '1', brand: 'visa', last4: '4242', name: 'John Doe' }]} selectedId={'1'} onSelect={() => {}} />
        <Text className="text-xl font-bold">Time Choice</Text>
        <TimeChoice times={["10:00", "11:30", "13:00", "15:00"]} />

        <Text className="text-xl font-bold">Photoshoot Booking</Text>
        <PhotoshootBookingCard title="Professional photoshoot" step="Step 1 of 3" cta="Book a photoshoot" />
        <Text className="text-xl font-bold">Photoshoot History</Text>
        <PhotoshootHistoryItem title="Listing: City Studio" date="Mar 10, 2025" status="accepted" />

        <Text className="text-xl font-bold">Alert</Text>
        <AlertBanner kind="info" title="Heads up" message="Another request is in progress" />

        <Text className="text-xl font-bold">Segmented Tabs</Text>
        <SegmentedTabs tabs={[{ key: 'one', label: 'One' }, { key: 'two', label: 'Two' }]} value={tab} onChange={setTab} />
        <Text className="text-base text-gray500 mt-2">Girls Only (Radio)</Text>
        <RadioGroup options={[{ label: 'Any', value: 'any' }, { label: 'Girls only', value: 'girls' }]} value={'girls'} onChange={() => {}} />

        <Text className="text-xl font-bold">Chat Bubbles</Text>
        <MessageBubble text="Hello!" />
        <MessageBubble text="Hi there" mine />

        <Text className="text-xl font-bold">Status Block</Text>
        <Text className="text-xl font-bold">Knob</Text>
        <Knob value={75} label="Score" />
        <Text className="text-xl font-bold">Drag Handle</Text>
        <DragHandle />
        <Text className="text-xl font-bold">Verified Tag</Text>
        <VerifiedTag />
        <Text className="text-xl font-bold">Text Bar</Text>
        <TextBar onSend={() => {}} />
        <StatusBlock title="Payment successful" subtitle="Your reservation is confirmed" />

        <Text className="text-xl font-bold">Performance</Text>
        <PerformanceCard title="Listing views" value="1,240" progress={70} />
        <ListingPerformanceUI title="Listing views" value="1,240" progress={70} />
        <ReferralPerformance clicks={120} signups={24} earnings="500 MAD" />
        <ReferralPerformanceUI clicks={120} signups={24} earnings="500 MAD" />
        <ReferralSimulator />

        <Text className="text-xl font-bold">Perks & Safety</Text>
        <View className="flex-row gap-2">
          <Perk label="No hidden fees" />
          <Perk label="Verified listings" />
        </View>
        <TenantProtectionBanner />

        <Text className="text-xl font-bold">Utility Chip</Text>
        <UtilityChip icon="water" label="Water included" />
        <Text className="text-base text-gray500 mt-2">Property Utility</Text>
        <PropertyUtility icon="wifi" label="Wi-Fi included" />

        <Text className="text-xl font-bold">Login Block</Text>
        <LoginBlock />

        <Text className="text-xl font-bold">FAQ Item</Text>
        <FAQItem question="How do payments work?" answer="Payments are processed securely via card and deposits are held until move-in." />

        <Text className="text-xl font-bold">Drawers & Modals</Text>
        <View className="gap-2">
          <Button title="Commission Rate" onPress={() => setShowCommission(true)} />
          <Button title="Reservation Request" onPress={() => setShowReservation(true)} />
          <Button title="Payment Details" onPress={() => setShowPayment(true)} />
          <Button title="Supported Documents" onPress={() => setShowDocs(true)} />
          <Button title="Open Simple Modal" onPress={() => setShowSimpleModal(true)} />
          <Button title="Open Bottom Drawer" onPress={() => setShowDrawer(true)} />
        </View>

        <Text className="text-xl font-bold">Profile Nav</Text>
        <ProfileNavBar name="Kaari User" email="user@kaari.dev" />
        <Text className="text-xl font-bold">Nav Bars Preview</Text>
        <NavBarPreview />
        <Text className="text-xl font-bold">Logo</Text>
        <Logo width={48} height={48} />
        <Text className="text-xl font-bold">Profile Link</Text>
        <ProfileLink title="Account" />
        <Text className="text-xl font-bold">Payment Status</Text>
        <PaymentStatus label="Payment" status="paid" />
        <Text className="text-xl font-bold">Redirect</Text>
        <Redirect label="Go to Profile" />
        <Text className="text-xl font-bold">Setting Row</Text>
        <Setting label="Language" value="English" />
        <Text className="text-xl font-bold">Supported Documents</Text>
        <SupportedDocuments items={["ID Card", "Passport", "Driver's License"]} />
        <Text className="text-xl font-bold">Tenant Row</Text>
        <TenantUI name="John Doe" verified subtitle="Member since 2023" />
        <Text className="text-xl font-bold">Weekday Chat</Text>
        <WeekdayChat weekday="Monday" time="9:00 - 18:00" />
      </View>
      <FooterButton label="Open dialog" onPress={() => setDialog(true)} />
      <ConfirmDialog visible={dialog} title="Confirm" message="Proceed with action?" onCancel={() => setDialog(false)} onConfirm={() => setDialog(false)} />
      <SimpleModal visible={showSimpleModal} onClose={() => setShowSimpleModal(false)}>
        <View className="gap-3">
          <Text className="text-lg font-semibold">Simple Modal</Text>
          <Text className="text-gray700">This is the Modal component from UI.</Text>
          <Button title="Close" onPress={() => setShowSimpleModal(false)} />
        </View>
      </SimpleModal>
      {showDrawer ? (
        <BottomDrawer visible={showDrawer} onClose={() => setShowDrawer(false)}>
          <View className="p-4">
            <View className="items-center py-2">
              <DragHandle />
            </View>
            <Text className="text-lg font-semibold mb-2">Bottom Drawer</Text>
            <Text className="text-gray700 mb-3">This is the BottomDrawer component from UI.</Text>
            <View className="flex-row gap-2">
              <Button title="Close" onPress={() => setShowDrawer(false)} />
              <IconButton name="close" />
              <Icon name="search" />
            </View>
          </View>
        </BottomDrawer>
      ) : null}
      <CommissionRatePopup visible={showCommission} value={commission} onChange={setCommission} onSave={() => setShowCommission(false)} onClose={() => setShowCommission(false)} />
      <ReservationRequestPopup visible={showReservation} guestName="Derek Xavier" moveInDate="20.09.2024 6:00 PM" onAccept={() => setShowReservation(false)} onReject={() => setShowReservation(false)} />
      <PaymentDetailsPopup visible={showPayment} amount="1500$" method="Visa •••• 4242" status="Paid" onClose={() => setShowPayment(false)} />
      <SupportedDocumentsPopup visible={showDocs} onClose={() => setShowDocs(false)} />
    </ScrollView>
  );
}


