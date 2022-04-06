import { useTranslation } from "next-export-i18n";

export const daysAgo = (timestamp) => {
  const then = new Date(timestamp).setHours(0, 0, 0, 0);
  const msInDay = 24 * 60 * 60 * 1000;
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.round((+today - +then) / msInDay);
};

export const getDaysAgoText = (timestamp) => {
  const { t } = useTranslation();
  const days = daysAgo(timestamp);
  if (days < 1) return t("lessThan24Hours");
  else if (days === 1) return t("oneDayAgo");
  else if (days > 1 && days < 8) return `${days} ${t("daysAgo")}`;
  else if (days > 7 && days < 15) return t("withinPreviousWeek");
  else return t("overTwoWeeksAgo");
};
