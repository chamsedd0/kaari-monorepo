import ProgressBannerBaseModel from "../../../styles/banners/status/banner-base-model-style-progress";

export default function ProgressBanner({
  text,
  status,
  style,
}: {
  text: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Paid';
  style?: React.CSSProperties;
}) {
  return (
    <ProgressBannerBaseModel status={status} style={style}>
      <p>{text}</p>
    </ProgressBannerBaseModel>
  );
}
