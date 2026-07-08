#!/usr/bin/env bash
set -euo pipefail

# ============================================================
#  VK Ads (myTarget) Expo Module — локальная установка
# ============================================================
#  Запусти из корня ТВОЕГО Expo-проекта:
#
#    bash ../ads-vk-module/install.sh
#
#  Или укажи путь до модуля явно:
#
#    bash ./install.sh /путь/к/твоему/expo-проекту
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# --- Определяем пути ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ $# -ge 1 ]; then
  TARGET_DIR="$1"
else
  TARGET_DIR="$(pwd)"
fi

# Нормализуем
TARGET_DIR="$(cd "$TARGET_DIR" 2>/dev/null && pwd)" || {
  echo -e "${RED}❌  Папка '$TARGET_DIR' не найдена.${NC}"
  exit 1
}

# --- Проверки ---
echo -e "${CYAN}🔍  Проверяю окружение...${NC}"

if [ ! -f "$TARGET_DIR/package.json" ]; then
  echo -e "${RED}❌  $TARGET_DIR/package.json не найден. Это точно Expo-проект?${NC}"
  echo -e "${YELLOW}💡  Запусти из корня своего Expo-проекта:${NC}"
  echo "    bash $SCRIPT_DIR/install.sh"
  exit 1
fi

if [ ! -f "$SCRIPT_DIR/package.json" ]; then
  echo -e "${RED}❌  Модуль не найден в $SCRIPT_DIR${NC}"
  exit 1
fi

MODULE_NAME=$(node -e "console.log(require('$SCRIPT_DIR/package.json').name)" 2>/dev/null)
echo -e "${GREEN}✅  Модуль: ${YELLOW}$MODULE_NAME${NC}"
echo -e "${GREEN}✅  Проект: ${YELLOW}$TARGET_DIR${NC}"

# --- Шаг 1: Установка npm-зависимости ---
echo ""
echo -e "${CYAN}📦  Шаг 1/4: Установка npm-пакета...${NC}"

cd "$TARGET_DIR"

# Проверяем, не установлен ли уже
if node -e "require('$MODULE_NAME')" 2>/dev/null; then
  echo -e "${YELLOW}⚠️   Пакет уже установлен. Обновляю...${NC}"
fi

npm install "$SCRIPT_DIR" --save
echo -e "${GREEN}✅  Пакет установлен.${NC}"

# --- Шаг 2: Config Plugin ---
echo ""
echo -e "${CYAN}🔧  Шаг 2/4: Проверка Config Plugin...${NC}"

# Ищем app.json или app.config.js
APP_CONFIG=""
if [ -f "$TARGET_DIR/app.json" ]; then
  APP_CONFIG="$TARGET_DIR/app.json"
elif [ -f "$TARGET_DIR/app.config.js" ]; then
  APP_CONFIG="$TARGET_DIR/app.config.js"
elif [ -f "$TARGET_DIR/app.config.ts" ]; then
  APP_CONFIG="$TARGET_DIR/app.config.ts"
fi

if [ -n "$APP_CONFIG" ]; then
  if grep -q "$MODULE_NAME" "$APP_CONFIG" 2>/dev/null; then
    echo -e "${YELLOW}⚠️   Config Plugin уже добавлен в $APP_CONFIG${NC}"
  else
    echo -e "${YELLOW}⚠️   Добавь плагин в $APP_CONFIG вручную:${NC}"
    echo ""
    echo -e "  ${GREEN}\"plugins\": [${NC}"
    echo -e "    ${GREEN}[\"$MODULE_NAME\", { \"debugMode\": __DEV__ }]${NC}"
    echo -e "  ${GREEN}]${NC}"
    echo ""
  fi
else
  echo -e "${YELLOW}⚠️   app.json / app.config.js не найден. Добавь плагин вручную:${NC}"
  echo ""
  echo -e "  ${GREEN}\"plugins\": [${NC}"
  echo -e "    ${GREEN}[\"$MODULE_NAME\", { \"debugMode\": true }]${NC}"
  echo -e "  ${GREEN}]${NC}"
  echo ""
fi

# --- Шаг 3: Prebuild ---
echo ""
echo -e "${CYAN}🏗️   Шаг 3/4: Expo Prebuild...${NC}"

# Проверяем, есть ли android/ папка с gradle
if [ -f "$TARGET_DIR/android/build.gradle" ] || [ -f "$TARGET_DIR/android/build.gradle.kts" ]; then
  echo -e "${YELLOW}⚠️   android/ уже существует. Делаю prebuild без --clean...${NC}"
  npx expo prebuild --platform android 2>&1 || {
    echo -e "${RED}❌  Prebuild не удался. Попробуй с --clean:${NC}"
    echo "    npx expo prebuild --clean --platform android"
    exit 1
  }
else
  npx expo prebuild --platform android 2>&1 || {
    echo -e "${RED}❌  Prebuild не удался.${NC}"
    exit 1
  }
fi

echo -e "${GREEN}✅  Prebuild завершён.${NC}"

# --- Шаг 4: Проверка myTarget SDK в gradle ---
echo ""
echo -e "${CYAN}🔎  Шаг 4/4: Проверка зависимостей...${NC}"

if [ -f "$TARGET_DIR/android/build.gradle" ] || [ -f "$TARGET_DIR/android/build.gradle.kts" ]; then
  echo -e "${GREEN}✅  android/ создан.${NC}"
else
  echo -e "${RED}❌  android/ не найден после prebuild.${NC}"
fi

# --- Финал ---
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        🎉  Установка завершена!                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📋  Что дальше:${NC}"
echo ""
echo -e "  1. ${YELLOW}Замени slotId${NC} в своём коде на реальные из"
echo -e "     ${CYAN}https://ads.vk.com/partner${NC}"
echo ""
echo -e "  2. ${YELLOW}Используй в коде:${NC}"
echo ""
echo -e "     ${GREEN}import { VKAds, VKAdsBannerView, VKAdsInterstitial, VKAdsRewarded, VKAdSize }${NC}"
echo -e "     ${GREEN}  from '$MODULE_NAME';${NC}"
echo ""
echo -e "  3. ${YELLOW}Собери и запусти:${NC}"
echo ""
echo -e "     ${GREEN}npx expo run:android${NC}"
echo ""
echo -e "  4. ${YELLOW}Пример кода лежит в:${NC}"
echo -e "     ${CYAN}$SCRIPT_DIR/example/App.tsx${NC}"
echo ""
echo -e "${YELLOW}💡  Если не работает — попробуй clean-сборку:${NC}"
echo -e "     ${GREEN}cd $TARGET_DIR && npx expo prebuild --clean && npx expo run:android${NC}"
echo ""
