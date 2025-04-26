// Add this to your console to debug filtering issues:

function debugFilters() {
  // Get all active filters
  const activeFilters = Array.from(document.querySelectorAll('.filter-badge'))
    .map(el => el.textContent.trim().replace('×', '').trim());
  
  console.log("Current active filters:", activeFilters);
  
  // Inspect translation keys that might be problematic
  console.log("Translation keys that might be problematic:");
  console.log("- Studio:", i18next.t('property_list.studio'));
  console.log("- Bedroom:", i18next.t('property_list.bedroom'));
  console.log("- Bedrooms:", i18next.t('property_list.bedrooms'));
  console.log("- Parking:", i18next.t('property_list.parking'));
  console.log("- Pool:", i18next.t('property_list.pool'));
  console.log("- Fitness center:", i18next.t('property_list.fitness_center'));
  console.log("- Pets allowed:", i18next.t('property_list.pets_allowed'));
  
  // Check if apply button handler is working
  const applyButton = document.querySelector('button:contains("Apply Filters")');
  if (applyButton) {
    console.log("Apply button found:", applyButton);
    console.log("Try clicking this manually to see if it works");
  } else {
    console.log("Apply button not found - check if the button is rendered correctly");
  }
  
  // Check the property data
  if (window.__PROPERTY_LIST_PAGE) {
    const instanceProps = window.__PROPERTY_LIST_PAGE;
    console.log("Properties count:", instanceProps.properties.length);
    console.log("Filtered properties:", instanceProps.filteredProperties.length);
    console.log("Sample property data:", instanceProps.properties[0]);
    
    // Test filter conditions
    if (instanceProps.properties.length > 0 && activeFilters.length > 0) {
      console.log("Testing filters on first property:");
      const property = instanceProps.properties[0];
      
      activeFilters.forEach(filter => {
        if (filter === i18next.t('property_list.studio')) {
          console.log("- Studio check:", property.bedrooms === 0);
        } else if (filter === "1 " + i18next.t('property_list.bedroom')) {
          console.log("- 1 bedroom check:", property.bedrooms === 1);
        } else if (filter === "2 " + i18next.t('property_list.bedrooms')) {
          console.log("- 2 bedrooms check:", property.bedrooms === 2);
        } else if (filter === "3 " + i18next.t('property_list.bedrooms')) {
          console.log("- 3 bedrooms check:", property.bedrooms === 3);
        } else if (filter === "3+ " + i18next.t('property_list.bedrooms')) {
          console.log("- 3+ bedrooms check:", property.bedrooms >= 3);
        }
        
        if (filter === "Apartment") {
          console.log("- Apartment check:", property.propertyType === 'apartment');
        } else if (filter === "House") {
          console.log("- House check:", property.propertyType === 'house');
        } else if (filter === "Condo") {
          console.log("- Condo check:", property.propertyType === 'condo');
        }
        
        if (filter === i18next.t('property_list.parking') || filter === 'Parking') {
          const hasParking = property.amenities.some(a => a.toLowerCase() === 'parking');
          console.log("- Parking check:", hasParking, "- Amenities:", property.amenities);
        }
      });
    }
  } else {
    console.log("Property List Page component instance not found. Add this to your component:");
    console.log("window.__PROPERTY_LIST_PAGE = { properties, filteredProperties };");
  }
  
  return "Debug info logged to console";
}

// Instructions:
// 1. Open your browser dev console (F12)
// 2. Copy and paste this entire function
// 3. Run it by typing: debugFilters()
// 4. Check the console output for issues 