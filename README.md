 Chef's Menu Manager (Chef's Table)

A React Native (Expo + TypeScript) mobile app for a chef to manage a restaurant menu, with a customer-facing menu and cart. This is Part 3 of the POE and builds on the Part 2 application.

## Features

### Chef tools (Manage tab)
- **Add, edit and delete menu items.** Changes appear immediately across the app. Deleting asks for confirmation.
- **Search and filter.** Search by dish name and filter by course (Starter, Main Course, Dessert). "Clear search & filter" shows every item again.
- **Menu statistics.** Shows the total number of items, the average price, and the number of items in each course. These update automatically.
- **Image upload.** Choose a dish photo from the phone gallery (`expo-image-picker`).
- **Validation.** Inline error messages on the form: name required (min 3 characters, no duplicates), price must be a number between 0 and 1000, description max 200 characters.

### Customer tools
- Splash, welcome and sign-in screens (username/email or phone number, with validation)
- Menu with search and course filter
- Dish detail screen, cart with quantity controls, and order summary with delivery fee

## Project structure

```
chefs-table/
├── App.tsx              Screens, state and handlers
├── types.ts             TypeScript types and interfaces
├── constants.ts         Colours, currency, delivery fee, sample menu data
├── utils.ts             formatPrice, filterDishes, calculateMenuStats, validateDishForm
├── styles.ts            Shared StyleSheet
└── components/          Reusable UI components
    ├── PrimaryButton, ScreenHeader, SearchBar, CourseFilterBar
    ├── ClearFiltersRow, EmptyState, StatCard, MenuStatsPanel
    └── FormField, CustomerDishCard, ManageDishRow
```

## Requirements

- Node.js (LTS) – https://nodejs.org
- Visual Studio Code
- Expo Go on your phone (or an Android emulator)

## Setup and run

1. Create the project and install the dependency:
   ```
   npx create-expo-app@latest chefs-table --template blank-typescript
   cd chefs-table
   npx expo install expo-image-picker
   ```
2. Copy the supplied files into the project root. `App.tsx` replaces the existing one; add `types.ts`, `constants.ts`, `utils.ts`, `styles.ts` and the `components` folder.
3. Start the app:
   ```
   npx expo start
   ```
4. Scan the QR code with Expo Go (phone and PC on the same Wi-Fi), or press `a` for an Android emulator.

## How to use

1. Tap **Continue as Guest**, or sign in with any username and a password of 4+ characters. Sign-in is simulated, so there are no real accounts.
2. **Menu tab:** browse, search, filter, open a dish and add it to the cart.
3. **Manage tab:** view the statistics, add a dish, and use **Edit** or **Delete** on any item.
4. **Cart tab:** change quantities and place an order.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module './components'` | The `components` folder must sit next to `App.tsx` |
| Warning about `MediaTypeOptions` | Change it to `mediaTypes: ['images']` in `App.tsx` |
| Phone cannot connect | Run `npx expo start --tunnel` |
| Stale errors after moving files | Run `npx expo start -c` |# PORTFOLIO-OF-EVIDENCE 





Changes from your Part 2 code

I renamed Mains, Starters and Desserts to Main Course, Starter and Dessert, as the brief specifies.
The course dropdown was static. It’s now a working three-option picker.
I replaced the “Popular” filter with the course filter, since the brief asks for course filtering. The 🔥 Popular badge on dishes is still there.
I replaced inset: 0 with explicit top/left/right/bottom, because older React Native versions don’t support inset.



<img width="1600" height="1200" alt="WhatsApp Image 2026-11-06 at 09 36 30" src="https://github.com/user-attachments/assets/d2e09367-c2f8-4f71-8c74-e84ca89ef469" /><img width="1600" height="1200" alt="WhatsApp Image 2026-11-06 at 09 36 31 (1)" src="https://github.com/user-attachments/assets/629b95a5-0065-4c20-aa94-49a75ac3b1f0" />
<img width="1600" height="1200" alt="WhatsApp Image 2026-11-06 at 09 36 31 (3)" src="https://github.com/user-attachments/assets/3c1dc226-bfd7-4948-9386-3c689bcbcaa2" />


