import LanguageBannerBaseModel from "../../../styles/banners/status/banner-base-model-style-language";

export default function LanguageBanner({
  text,
  style,
}: {
  text: string;
  style?: React.CSSProperties;
}) {
  return (
    <LanguageBannerBaseModel style={style}>
      <p>{text}</p>
    </LanguageBannerBaseModel>
  );
}
