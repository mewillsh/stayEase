const axios = require("axios");

const geocodeLocation = async (location) => {
  try {
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "StayNest/1.0 (harshsingh22082003@gmail.com)",
      },
    });

    if (geoRes.data.length > 0) {
      const { lat, lon } = geoRes.data[0];
      return {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      };
    } else {
      return {
        type: "Point",
        coordinates: [0, 0],
      };
    }
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return {
      type: "Point",
      coordinates: [0, 0],
    };
  }
};

module.exports = geocodeLocation;
