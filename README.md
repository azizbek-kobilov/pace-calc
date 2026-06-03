# Pace Calculator

Простое мобильное приложение для iOS и Android: расчёт темпа бега, скорости и пропорциональных времён на стандартных дистанциях.

## Возможности

- Дистанция в милях и километрах (синхронизация полей)
- Быстрый выбор: 5/10/15/20 km, 13.1 mi, 26.2 mi
- Ввод времени: часы, минуты, секунды
- Темп: сек/милю, сек/км, mi/hr, km/hr
- Оценка времени на тех же дистанциях при текущем темпе

## Запуск

```bash
npm install
npx expo start
```

- **Android:** нажмите `a` в терминале или отсканируйте QR в приложении Expo Go
- **iOS:** нажмите `i` или отсканируйте QR в Expo Go (нужен Mac для симулятора)

## Сборка APK (Android)

1. Аккаунт на [expo.dev](https://expo.dev), затем в терминале:

```bash
npx eas-cli login
```

2. Сборка APK (профиль `preview` в `eas.json`):

```bash
npm run build:apk
```

3. По ссылке в терминале скачайте готовый `.apk` и установите на телефон.

## Сборка для магазинов

```bash
npx eas-cli login
eas build --platform all --profile production
```

## Стек

- [Expo](https://expo.dev) + React Native + TypeScript
