# Mendix Widgets Monorepo

Monorepo ini dipakai untuk mengelola beberapa Mendix pluggable widget dalam satu workspace dengan `npm workspaces` dan `lerna`.

## 📦 Struktur

Semua widget disimpan di:

```text
src/packages/
```

Contoh package yang aktif di repo ini:

- `src/packages/edtsCalendar`
- `src/packages/edtsChartGraph`
- `src/packages/edtsDetailCard`
- `src/packages/edtsForm`
- `src/packages/edtsInput`
- `src/packages/edtsProfileDropDown`

## 🛠 Generate Package Baru

Gunakan script generator dari root monorepo:

```bash
npm run generate:package -- --name edts-rating-card --widgetName EdtsRatingCard
```

Contoh dengan deskripsi dan `projectPath`:

```bash
npm run generate:package -- \
  --name edts-rating-card \
  --widgetName EdtsRatingCard \
  --description "Rating card widget" \
  --projectPath "/Users/adreansyahaswafi/Mendix/MyApp"
```

### 📍 Catatan `projectPath`

`--projectPath "/Users/adreansyahaswafi/Mendix/MyApp"` hanya contoh. Kalau project Mendix kamu ada di lokasi lain, ganti path tersebut sesuai folder app kamu sendiri.

Contoh:

```bash
npm run generate:package -- \
  --name edts-rating-card \
  --widgetName EdtsRatingCard \
  --projectPath "/Users/adreansyahaswafi/Mendix/AppTestBookingRoomVersion-main"
```

Path ini dipakai agar hasil build package bisa diarahkan ke project Mendix yang benar.

Kalau mau ganti target path setelah package sudah dibuat, ubah nilai `projectPath` di file:

```text
src/packages/<nama-package>/package.json
```

Contoh:

```text
src/packages/edtsDetailCard/package.json
src/packages/edtsCalendar/package.json
```

Lalu cari field:

```json
"projectPath": "/Users/adreansyahaswafi/Mendix/MyApp"
```

dan ganti ke path project Mendix kamu.

### 🧱 Struktur Hasil Generator

Generator akan membuat struktur seperti ini:

```text
src/packages/edts-rating-card/
  package.json
  README.md
  src/
    EdtsRatingCard.jsx
    EdtsRatingCard.xml
    EdtsRatingCard.editorConfig.js
    EdtsRatingCard.editorPreview.jsx
    package.xml
    ui/
      EdtsRatingCard.css
```

## 📥 Install Dependencies

Install dependency root monorepo:

```bash
npm install
```

Kalau kamu ingin install dependency tambahan untuk package tertentu, masuk ke package tersebut lalu jalankan `npm install` seperti biasa.

Contoh:

```bash
cd src/packages/edtsChartGraph
npm install apexcharts react-apexcharts
```

## 🚀 Menjalankan Script Root

Jalankan semua package sekaligus dari root:

```bash
npm run build
npm run lint
npm run dev
```

Script root memakai `lerna`, jadi command akan dijalankan ke semua package yang punya script yang sesuai.

Kalau ingin target satu package saja dari root, pakai flag package di belakang command:

```bash
yarn build --edtsChartGraph
yarn lint --edtsChartGraph
yarn dev --edtsChartGraph
yarn install:pkg --edtsChartGraph
```

Atau kalau pakai `npm`:

```bash
npm run build -- --edtsChartGraph
npm run lint -- --edtsChartGraph
npm run dev -- --edtsChartGraph
npm run install:pkg -- --edtsChartGraph
```

Flag bisa pakai nama folder package, nama package, atau `widgetName` selama cocok.

## 🌐 Menjalankan Browser Playground

Repo ini punya browser playground di folder `playground/`, jadi widget utama bisa dicoba di website tanpa harus membuka Mendix terlebih dahulu.

Jalankan playground dari root:

```bash
npm run playground
```

Build playground:

```bash
npm run playground:build
```

Preview hasil build playground:

```bash
npm run playground:preview
```

Playground ini mengimpor source widget langsung dari `src/packages/*/src` dan memakai mock props Mendix untuk:

- datasource
- attribute
- action
- datasource action

## 📁 Menjalankan Script per Package

Kalau mau build atau develop satu widget saja:

```bash
cd src/packages/edtsChartGraph
npm run build
```

Contoh lain:

```bash
cd src/packages/edtsCalendar
npm run dev
```

## 🔧 Install dan Build Satu Package Saja

Kalau kamu tidak ingin menjalankan semua package sekaligus, cukup masuk ke package yang diinginkan lalu jalankan command di sana.

Contoh install dependency hanya untuk satu package:

```bash
cd src/packages/edtsChartGraph
npm install
```

Contoh build hanya untuk satu package:

```bash
cd src/packages/edtsChartGraph
npm run build
```

Contoh lint hanya untuk satu package:

```bash
cd src/packages/edtsChartGraph
npm run lint
```

Contoh development hanya untuk satu package:

```bash
cd src/packages/edtsChartGraph
npm run dev
```

Pola yang sama juga berlaku untuk package lain:

```bash
cd src/packages/edtsCalendar
npm install
npm run build
```

```bash
cd src/packages/edtsDetailCard
npm install
npm run build
```

Jadi kamu tidak wajib memakai command root seperti `npm run build` atau `npm run lint` kalau hanya sedang fokus di satu widget.

## 📜 Script Root yang Tersedia

- `npm run bootstrap`
  Menjalankan install dependencies dari root.
- `npm run generate:package -- --name my-widget --widgetName MyWidget`
  Membuat package widget baru di `src/packages`.
- `npm run build`
  Menjalankan build semua package, atau satu package jika diberi flag seperti `npm run build -- --edtsChartGraph`.
- `npm run lint`
  Menjalankan lint semua package, atau satu package jika diberi flag.
- `npm run dev`
  Menjalankan mode development semua package, atau satu package jika diberi flag.
- `npm run release`
  Menjalankan release script semua package, atau satu package jika diberi flag.
- `npm run install:pkg`
  Menjalankan install untuk package tertentu dengan flag, misalnya `npm run install:pkg -- --edtsChartGraph`.

## 📝 Catatan

- Setiap package tetap punya `package.json` sendiri dan bisa dijalankan secara mandiri.
- Konfigurasi workspace ada di `package.json` root.
- Konfigurasi `lerna` ada di `lerna.json`.
- Jika sebuah widget butuh `projectPath` Mendix yang berbeda, atur di `package.json` package tersebut.
- Kalau saat generate package atau build kamu ingin pindah target app Mendix, ubah nilai `projectPath` ke path project yang kamu pakai, misalnya dari `/Users/adreansyahaswafi/Mendix/MyApp` ke folder app lain.
- Lokasi penggantiannya ada di `src/packages/<nama-package>/package.json`, pada field `"projectPath"`.
