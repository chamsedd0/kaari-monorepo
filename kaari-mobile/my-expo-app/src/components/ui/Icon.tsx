import { SvgProps } from 'react-native-svg';

// Central icon map from assets names to React components
import IconSearch from '../../../assets/Icon_Search.svg';
import IconFavorites from '../../../assets/Icon_Favorites.svg';
import IconNotifications from '../../../assets/Icon_Notifications.svg';
import IconProfile from '../../../assets/Icon_Profile.svg';
import IconProperty from '../../../assets/Icon_Property.svg';
import IconReservation from '../../../assets/Icon_Reservation.svg';
import IconVerified from '../../../assets/Icon_Verified.svg';
import IconWater from '../../../assets/Icon_Water.svg';
import IconWifi from '../../../assets/Icon_Wifi.svg';
import IconPhone from '../../../assets/Icon_Phone.svg';
import IconMail from '../../../assets/Icon_Mail.svg';
import IconShare from '../../../assets/Icon_Share.svg';
import IconArrowLeft from '../../../assets/Icon_Arrow_Left.svg';
import IconClose from '../../../assets/Icon_Cross.svg';
import IconInfo from '../../../assets/Icon_Info.svg';
import IconCheck from '../../../assets/Icon_Check.svg';
import IconAlert from '../../../assets/Icon_Alert_Round.svg';
import IconPayments from '../../../assets/Icon_Payments.svg';
import IconPhotoshoot from '../../../assets/Icon_Photoshoot.svg';
import IconDashboard from '../../../assets/Icon_Dashboard.svg';
import IconMessages from '../../../assets/Icon_Messages.svg';
import IconShow from '../../../assets/Icon_Show.svg';
import IconHide from '../../../assets/Icon_Hide.svg';
import IconArrowRight from '../../../assets/Icon_Arrow_Right.svg';

const map = {
  search: IconSearch,
  favorites: IconFavorites,
  messages: IconMessages,
  notifications: IconNotifications,
  payments: IconPayments,
  profile: IconProfile,
  property: IconProperty,
  reservation: IconReservation,
  verified: IconVerified,
  water: IconWater,
  wifi: IconWifi,
  phone: IconPhone,
  mail: IconMail,
  share: IconShare,
  back: IconArrowLeft,
  close: IconClose,
  info: IconInfo,
  check: IconCheck,
  alert: IconAlert,
  photoshoot: IconPhotoshoot,
  dashboard: IconDashboard,
  show: IconShow,
  hide: IconHide,
  arrowRight: IconArrowRight,
} as const;

export type IconName = keyof typeof map;

export function Icon({ name, fill = 'currentColor', ...props }: { name: IconName } & SvgProps) {
  const Cmp = map[name];
  return <Cmp width={props.width ?? 20} height={props.height ?? 20} fill={fill} color={fill} {...props} />;
}


