"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      i18n.changeLanguage(savedLanguage);
    } else {
      i18n.changeLanguage("en");
      localStorage.setItem("i18nextLng", "en");
    }
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const getCurrentLanguageIcon = () => {
    const currentLang = i18n.language || "en";
    return currentLang.startsWith("es") ? "🇪🇸" : "🇺🇸";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <span className="text-lg">{getCurrentLanguageIcon()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")} className="cursor-pointer">
          <span className="mr-2">🇺🇸</span>
          {t("language.english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("es")} className="cursor-pointer">
          <span className="mr-2">🇪🇸</span>
          {t("language.spanish")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
