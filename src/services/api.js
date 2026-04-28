import axios from "axios";

// Base URL pointing to your Spring Boot Backend
const API_BASE = "http://localhost:8080/api/readings";

/**
 * ✅ Fetch the latest reading for a SINGLE device (Global latest)
 */
export const getLatestReading = async () => {
  try {
    const res = await axios.get(`${API_BASE}/latest`);
    return res.data;
  } catch (error) {
    console.error("Error fetching latest reading:", error);
    throw error;
  }
};

/**
 * ✅ NEW: Fetch the latest reading for EVERY active device (Fleet View)
 * Use this to populate your sidebar with multiple device cards.
 */
export const getFleetReadings = async () => {
  try {
    const res = await axios.get(`${API_BASE}/latest-fleet`);
    return res.data;
  } catch (error) {
    console.error("Error fetching fleet readings:", error);
    throw error;
  }
};

/**
 * ✅ Fetch historical data (for the AreaChart)
 * In your Spring Boot controller, this is now limited to the last 100 records.
 */
export const getAllReadings = async () => {
  try {
    const res = await axios.get(API_BASE);
    return res.data;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};