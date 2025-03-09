import ExistsBannerBaseModel from "../../../styles/banners/status/banner-base-model-style-exists";
import checkIcon from "../../icons/Check-Icon.svg";
import closeIcon from "../../icons/Cross-Icon.svg";


export default function ExistsBanner({
  status,
  style,
}: {
  status: 'exists' | 'not_exists';
  style?: React.CSSProperties;
}) {
  return (
    <ExistsBannerBaseModel status={status} style={style}>
      <img 
        src={status === 'exists' ? checkIcon : closeIcon} 
        alt={status === 'exists' ? 'Exists' : 'Does not exist'}
      />
    </ExistsBannerBaseModel>
  );
}
