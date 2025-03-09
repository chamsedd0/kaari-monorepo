import { AppliedFilterBanner } from "../../../styles/banners/static/applied-filters-banner-base-model-style";


export const AppliedFilterBannerComponent = ({label}: {label: String}) => {
    return(
        <AppliedFilterBanner>
            {label}
        </AppliedFilterBanner>
    )
}