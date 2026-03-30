Plot object structure.
{
  "id": "P305",                          // Must start with P
  "type": "plot",                        // Fixed: plot
  "area_sqft": 1450,                     // Must be > 0
  "front_road_width_ft": 40,             // Must be > 0
  "sector": 2,                           // Only 1–9 allowed
  "distance_from_main_road_km": 1.5,     // Must be < 4.5
  "price": 6500000,                      // Must be > 0
  "owner_name": "Vikram Singh",
  "owner_phone": "9988776655",           // 10 digits validation

  "corner_property": true,               // Boolean
  "facing": "West",                      // North | South | East | West

  "land_type": "residential",            // residential | commercial | mixed
  "boundary_wall": true,                 // Boolean
  "soil_type": "normal",                 // normal | rocky | clay
  "plot_status": "available",            // available | booked | sold

  "registration_status": "clear",        // clear | pending | disputed
  "loan_approved": true                  // Boolean
} 



house object structure.
{
  "id": "H305",                          // Must start with H
  "type": "house",                       // Fixed: house
  "bhk": 3,                              // Integer (2, 3, 4...)
  "area_sqft": 1450,                     // Must be > 0
  "front_road_width_ft": 40,             // Must be > 0
  "sector": 2,                           // Only 1–9 allowed
  "distance_from_main_road_km": 1.5,     // Must be < 4.5
  "price": 6500000,                      // Must be > 0
  "owner_name": "Vikram Singh",
  "owner_phone": "9988776655",           // 10 digits validation

  "floors": 2,                           // >= 1
  "bathrooms": 3,                        // >= 1
  "balcony": 2,                          // >= 0
  "parking_available": true,             // Boolean
  "construction_year": 2023,             // Valid year
  "furnished_status": "furnished",       // furnished | semi-furnished | unfurnished

  "corner_property": true,               // Boolean
  "facing": "West",                      // North | South | East | West

  "property_status": "booked",           // available | booked | sold
  "registration_status": "clear",        // clear | pending | disputed
  "loan_approved": true                  // Boolean
}













// for data base formate to store data of sector is 

(
    sector ,
    average_income_level ,
    population_density ,
    rental_demand ,
    transaction_volume ,
    nearby_metro_distance_km ,
    national_highway_distance_km ,
    railway_station_distance_km ,
    nearest_hospital_distance_km ,
    nearest_mall_distance_km ,
    nearest_college_distance_km ,
    industrial_rating ,
    pollution_rate ,
    crime_rate ,
    traffic_rate ,
    sports_club_rating ,
    private_clinic_rating ,
    active_government_projects ,
    future_government_projects ,
    average_property_price_per_sqft 
  )

