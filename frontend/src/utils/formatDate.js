// src/utils/formatDate.js

export const formatDate = (date) => {
  try {
    if (!date) return "-";

    const d = new Date(date);

    // Check invalid date
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Date format error:", error);
    return "-";
  }
};