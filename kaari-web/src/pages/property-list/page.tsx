import { AppliedFilterBannerComponent } from "../../components/skeletons/banners/static/applied-filter-banner";
import { PurpleButtonMB48 } from "../../components/skeletons/buttons/purple_MB48"
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import SearchBarModel from "../../components/skeletons/inputs/search-bars/search-bar-variant"
import SelectFieldBaseModelVariant2 from "../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2"
import { PropertyList } from "./styles"

import ExamplePic from '../../assets/images/propertyExamplePic.png'
import { WhiteHeaderUsers } from "../../components/skeletons/constructed/headers/header-users-white";


export default function PropertyListPage() {

    const appliedFilters = ['2 Bedrooms', '2 People', '1500 to 4000', 'Furnished'];

    const properties = [
        {
          title: "Luxury Villa",
          subtitle: " Oceanfront view",
          price: "$2,500",
          minstay: 'Min.stay (30 days)',
          priceType: "per night",
          description: "Deposit 3000$",
          isRecommended: true,
          image: ExamplePic
        },
        {
          title: "Cozy Cabin",
          subtitle: " Mountain retreat",
          price: "$300",
          priceType: "per night",
          minstay: 'Min.stay (30 days)',
          description: "Deposit 3000$",
          isRecommended: false,
          image: ExamplePic
        },
        {
          title: "Downtown Apartment",
          subtitle: " Heart of the city",
          price: "$1,800",
          minstay: 'Min.stay (30 days)',
          priceType: "per month",
          description: "Deposit 3000$",
          isRecommended: true,
          image: ExamplePic
        },
        {
          title: "Beach House",
          subtitle: " Steps from the sand",
          price: "$3,000",
          priceType: "per week",
          minstay: 'Min.stay (30 days)',
          description: "Deposit 3000$",
          isRecommended: true,
          image: ExamplePic
        },
        {
          title: "Suburban Home",
          subtitle: " Quiet neighborhood",
          price: "$2,200",
          priceType: "per month",
          minstay: 'Min.stay (30 days)',
          description: "Deposit 3000$",
          isRecommended: false,
          image: ExamplePic
        },
        {
          title: "Penthouse Suite",
          subtitle: " Skyline views",
          price: "$5,500",
          priceType: "per month",
          minstay: 'Min.stay (30 days)',
          description: "Deposit 3000$",
          isRecommended: true,
          image: ExamplePic
        }
      ];

  return (
    <PropertyList>
      <WhiteHeaderUsers user></WhiteHeaderUsers>
        <div className="main-content">

            <div className="search-form">
                <SearchBarModel placeholder="Search"></SearchBarModel>
                <PurpleButtonMB48 text="Advanced filtering"></PurpleButtonMB48>
            </div>

            <div className="search-results-container">

                <div className="filters-container">
                    <div className="text-select">
                        <div className="text">

                            <div className="title">
                                Renting flats, houses and rooms 
                            </div>

                            <div className="sub-title">
                                100 amazing listings are waiting for new tenants
                            </div>

                        </div>

                        <SelectFieldBaseModelVariant2 options={[]} placeholder="Recommended Filtering"></SelectFieldBaseModelVariant2>
                    </div>

                    <div className="applied-filters">

                        {
                            appliedFilters.map((filter, index) => {
                                return <AppliedFilterBannerComponent key={index} label={filter}></AppliedFilterBannerComponent>
                            })
                        }

                    </div>
                </div>

                <div className="results-container">
                {properties.map((property, index) => (
                    <div className="result">
                        <PropertyCard 
                        key={index}
                        image={property.image}
                        title={property.title}
                        subtitle={property.subtitle}
                        minstay={property.minstay}
                        price={property.price}
                        priceType={property.priceType}
                        description={property.description}
                        isRecommended={property.isRecommended}
                    />
                    </div>
                ))}
                </div>
            </div>

        </div>
        <div className="map">
          Map
        </div>
    </PropertyList>
  )
}