import { getColorByTimestamp } from "../../utils/colors";

export const eventContainerStyles = {
  padding: "1rem",
  borderBottom: "1px solid #E8E6E1",
  cursor: "pointer",
  listStyle: "none"
};

export const eventTimeContainerStyles = (timestamp) => ({
  color: getColorByTimestamp(timestamp),
  display: "flex",
  alignItems: "center",
  letterSpacing: ".05rem",
});

export const eventTitleStyles = (timestamp) => ({
  textTransform: "uppercase",
  fontWeight: "700",
  fontSize: "12px",
  lineHeight: "1rem",
  color: getColorByTimestamp(timestamp),
  marginLeft: ".5rem",
});

export const titleStyles = {
  fontSize: "1.2rem",
  lineHeight: "1.4rem",
  paddingTop: ".7rem",
  fontWeight: "600",
  margin: 0,
};

export const descriptionStyles = {
  fontSize: "1rem",
  fontWeight: "400",
  lineHeight: "1.5rem",
  color: "#3F3D36",
};

export const contentContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};
