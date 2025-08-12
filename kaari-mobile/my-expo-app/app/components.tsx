import { ScrollView, View, Text } from 'react-native';
import { TextWithBg, Timer, Timeslot, Switch, ProgressBar, SegmentedProgress, Stars, MessageBubbles, PrimaryButton, SecondaryButton, TextButton, IconButton, LikeButton, DualActionButtons, SectionBadge, TopPickBadge, SimpleChip, Tag, StatusTag, VerifiedTag, PeopleCountTag, FilterTag, CountTag, GirlsOnlyTag, WeekdayChatTag, TextField, SearchBar, PasswordField, SendMessageField, UploadField, RadioGroup, TextArea, AlertBanner, PropertyCardTenant, GenericHeader, Tabs, BottomNavBar, TenantNavBar, AdvertiserNavBar, LinkNavBar } from '~/components';
import React from 'react';

export default function ComponentsGallery() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 gap-6">
        <Text className="text-2xl font-bold">Components</Text>
        <View className="gap-4">
          <Text className="text-lg font-semibold">Text with BG</Text>
          <TextWithBg text="Purple pill" background="primaryTint2" color="primary" />
          <TextWithBg text="White chip" background="white" color="gray700" />
        </View>
        <View className="gap-4">
          <Text className="text-lg font-semibold">Timer</Text>
          <View className="flex-row gap-3">
            <Timer size="small" colorScheme="purple" timeText="00:45" />
            <Timer size="small" colorScheme="white" timeText="12:32" />
            <Timer size="big" colorScheme="white" timeText="02:13:44" />
          </View>
        </View>
        <View className="gap-4">
          <Text className="text-lg font-semibold">Timeslot</Text>
          <View className="flex-row gap-3">
            <Timeslot start="09:00" end="10:00" />
            <Timeslot start="10:00" end="11:00" isSelected />
          </View>
        </View>
        <View className="gap-4">
          <Text className="text-lg font-semibold">Switch</Text>
          <SwitchDemo />
        </View>
        <View className="gap-4">
          <Text className="text-lg font-semibold">Progress</Text>
          <ProgressBar progress={0.2} />
          <ProgressBar progress={0.6} height={8} foreground="primaryDark" />
          <View className="bg-black p-3 rounded-xl">
            <SegmentedProgress segments={4} activeIndex={1} progressInActive={0.5} activeColor="white" passiveColor="gray300" />
          </View>
        </View>
        <View className="gap-4">
          <Text className="text-lg font-semibold">Stars</Text>
          <Stars rating={3} />
        </View>
        <View className="gap-4">
          <Text className="text-lg font-semibold">Messages</Text>
          <MessageBubbles
            messages={[
              { id: '1', text: 'Hello!', from: 'them', time: '09:40' },
              { id: '2', text: 'Hey, how are you?', from: 'me', time: '09:41' },
              { id: '3', text: "Let's meet at 6", from: 'them' },
            ]}
          />
        </View>
        <ButtonsDemo />
        <BadgesDemo />
        <ChipsTagsDemo />
        <InputsDemo />
        <TagsDemo />
        <BannersCardsDemo />
        <HeadersNavDemo />
        <PngOverlayToggle />
      </View>
    </ScrollView>
  );
}


function SwitchDemo() {
  const [value, setValue] = React.useState(false);
  return (
    <View className="gap-3">
      <Switch label="Notifications" value={value} onChange={setValue} />
      <Switch label="Dark mode" value={!value} onChange={() => setValue((v) => !v)} />
    </View>
  );
}

function PngOverlayToggle() {
  const [show, setShow] = React.useState(false);
  const [alpha, setAlpha] = React.useState(0.4);
  return (
    <View className="gap-2">
      <Text className="text-lg font-semibold">Overlay (dev)</Text>
      <View className="flex-row items-center gap-3">
        <Switch label="Show PNG overlay" value={show} onChange={setShow} />
        <Text>Opacity: {Math.round(alpha * 100)}%</Text>
      </View>
      {show && (
        <View>
          <Text className="text-gray500">Place your reference PNGs here while aligning components.</Text>
          {/* Example: developer can temporarily put an <Image> here with adjustable opacity */}
        </View>
      )}
    </View>
  );
}

function ButtonsDemo() {
  const [liked, setLiked] = React.useState(false);
  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold">Buttons</Text>
      <PrimaryButton label="Primary" onPress={() => {}} />
      <SecondaryButton label="Secondary" onPress={() => {}} />
      <TextButton label="Text regular" onPress={() => {}} />
      <TextButton label="Text bold" bold onPress={() => {}} />
      <IconButton icon={<View className="w-4 h-4 bg-primary" />} onPress={() => {}} />
      <LikeButton liked={liked} onToggle={setLiked} />
      <DualActionButtons primaryLabel="Continue" secondaryLabel="Back" />
    </View>
  );
}

function BadgesDemo() {
  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold">Badges</Text>
      <SectionBadge text="Section" />
      <SectionBadge text="Section Alt" variant="white" />
      <TopPickBadge />
    </View>
  );
}

function ChipsTagsDemo() {
  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold">Chips & Tags</Text>
      <SimpleChip text="Room" />
      <Tag text="Purple" />
    </View>
  );
}

function InputsDemo() {
  const [text, setText] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [radio, setRadio] = React.useState('a');
  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold">Inputs</Text>
      <TextField label="Email" placeholder="Enter email" value={text} onChangeText={setText} />
      <SearchBar value={query} onChangeText={setQuery} />
      <PasswordField value={pwd} onChangeText={setPwd} />
      <SendMessageField value={msg} onChangeText={setMsg} />
      <UploadField />
      <RadioGroup options={[{ label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }]} value={radio} onChange={setRadio} />
      <TextArea label="About" placeholder="Write here..." />
    </View>
  );
}

function TagsDemo() {
  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold">Tags</Text>
      <StatusTag label="Under review" tone="info" />
      <VerifiedTag />
      <PeopleCountTag count={3} />
      <FilterTag label="Pet friendly" />
      <CountTag count={5} label="Photos" />
      <GirlsOnlyTag />
      <WeekdayChatTag weekday="Friday" />
    </View>
  );
}

function BannersCardsDemo() {
  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold">Banner & Card</Text>
      <AlertBanner title="Payment failed" subtitle="Please update your payment method" tone="danger" actionLabel="Fix" />
      <PropertyCardTenant
        imageUri="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600"
        title="Bright studio with balcony"
        location="Berlin, Germany"
        price="$1,200/mo"
        rating={4}
      />
    </View>
  );
}

function HeadersNavDemo() {
  const [tab, setTab] = React.useState('one');
  const [active, setActive] = React.useState('home');
  return (
    <View className="gap-3">
      <Text className="text-lg font-semibold">Headers & Navigation</Text>
      <GenericHeader title="Dashboard" subtitle="Welcome back" />
      <Tabs items={[{ key: 'one', title: 'One' }, { key: 'two', title: 'Two' }]} activeKey={tab} onTabPress={setTab} />
      <BottomNavBar
        items={[
          { key: 'home', label: 'Home', icon: <View className="w-5 h-5 bg-primary" /> },
          { key: 'msg', label: 'Messages', icon: <View className="w-5 h-5 bg-gray300" /> },
          { key: 'me', label: 'Profile', icon: <View className="w-5 h-5 bg-gray300" /> },
        ]}
        activeKey={active}
        onChange={setActive}
      />
      <TenantNavPreview />
      <AdvertiserNavPreview />
      <LinkNavPreview />
    </View>
  );
}

function TenantNavPreview() {
  const [active, setActive] = React.useState('home');
  return (
    <View className="gap-2">
      <Text className="text-gray500">Tenant Nav</Text>
      <TenantNavBar activeKey={active} onChange={setActive} />
    </View>
  );
}

function AdvertiserNavPreview() {
  const [active, setActive] = React.useState('dashboard');
  return (
    <View className="gap-2">
      <Text className="text-gray500">Advertiser Nav</Text>
      <AdvertiserNavBar activeKey={active} onChange={setActive} />
    </View>
  );
}

function LinkNavPreview() {
  const [active, setActive] = React.useState('info');
  return (
    <View className="gap-2">
      <Text className="text-gray500">Link Nav</Text>
      <LinkNavBar activeKey={active} onChange={setActive} />
    </View>
  );
}

