// import React from "react";

import { useTranslation } from "react-i18next";

// type Props = {}

export default function RankingBoard() {
  const { t } = useTranslation();
  return (
    <div className="rounded-md bg-white w-[352px] h-full">{t("home")}</div>
  );
}
