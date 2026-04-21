# Mendix Component Styling Pattern Guide

## Tujuan

Dokumen ini menjadi acuan styling global untuk seluruh component di project Mendix.
Arah visual mengacu pada **feel shadcn/ui**: clean, modern, soft, konsisten, dan reusable.

Yang distandardisasi:
- ukuran component
- tipe visual / variant
- spacing
- radius
- state
- naming class
- cara pakai class di Mendix

Dokumen ini **tidak mengikat ke Tailwind** dan dibuat agar cocok untuk **Mendix + CSS / SCSS biasa**.

---

## 1. Prinsip Utama

### 1.1 Styling harus berbasis pattern, bukan per-widget acak
Jangan styling setiap widget secara unik di masing-masing page.

Semua component harus mengikuti pola global:
- **base class** untuk struktur visual dasar
- **size class** untuk ukuran
- **variant class** untuk warna/gaya
- **state class** untuk kondisi khusus

### 1.2 Konsistensi lebih penting daripada variasi
Kalau dua component punya fungsi serupa, tampilannya harus terasa serupa.

Contoh:
- semua action button pakai aturan tinggi yang sama
- semua input pakai radius dan focus ring yang sama
- semua destructive action pakai warna destructive yang sama

### 1.3 Ambil rasa visual shadcn/ui, bukan implementasi teknisnya
Yang diadopsi:
- spacing rapi
- border halus
- radius konsisten
- state hover/focus modern
- hierarchy visual jelas

Yang tidak perlu dipaksakan:
- utility class Tailwind
- struktur React component
- CVA atau pattern JS tertentu

---

## 2. Token Dasar Visual

Gunakan nilai global berikut agar tampilan tetap konsisten.

### 2.1 Spacing scale
Gunakan hanya skala ini:
- `4px`
- `8px`
- `12px`
- `16px`
- `20px`
- `24px`
- `32px`

Hindari spacing random seperti `5px`, `7px`, `13px`, `22px` bila tidak benar-benar diperlukan.

### 2.2 Radius scale
Gunakan hanya radius berikut:
- `6px` untuk element kecil
- `8px` untuk default control
- `12px` untuk card / panel / modal content
- `999px` untuk pill / badge

### 2.3 Typography scale
Gunakan skala teks berikut:
- `12px` untuk helper text, caption, info kecil
- `14px` untuk mayoritas UI
- `16px` untuk CTA besar atau text penting

Font weight yang disarankan:
- `400` normal
- `500` medium
- `600` semibold

### 2.4 Transition
Semua interactive element gunakan transisi yang halus:
- `transition: all 0.2s ease;`

---

## 3. Standard Size Pattern

Gunakan hanya 3 ukuran utama untuk semua component:
- `sm`
- `md`
- `lg`

`md` adalah default.

### 3.1 Mapping size global

#### `sm`
- tinggi: `32px`
- horizontal padding: `12px`
- font-size: `14px`
- radius: `6px`

#### `md`
- tinggi: `40px`
- horizontal padding: `16px`
- font-size: `14px`
- radius: `8px`

#### `lg`
- tinggi: `48px`
- horizontal padding: `20px`
- font-size: `16px`
- radius: `12px`

### 3.2 Class size standard

```css
.ui-size-sm {
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
  border-radius: 6px;
}

.ui-size-md {
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border-radius: 8px;
}

.ui-size-lg {
  height: 48px;
  padding: 0 20px;
  font-size: 16px;
  border-radius: 12px;
}
```

### 3.3 Aturan size
- Jangan buat size custom per component kecuali benar-benar diperlukan.
- Semua button, input, select, dropdown, picker, dan field action mengacu ke skala ini.
- Kalau satu form pakai `md`, semua field di form itu sebaiknya tetap `md`.

---

## 4. Standard Variant Pattern

Gunakan nama variant yang sama di semua component interactive.

Variant yang diizinkan:
- `default`
- `secondary`
- `outline`
- `ghost`
- `destructive`

### 4.1 Definisi tiap variant

#### `default`
Primary action. Paling dominan. Dipakai untuk aksi utama.

#### `secondary`
Secondary action. Lebih lembut dan netral.

#### `outline`
Netral, transparan, menggunakan border.

#### `ghost`
Minim visual, cocok untuk toolbar atau inline action.

#### `destructive`
Dipakai untuk aksi berbahaya seperti delete, remove, reset.

### 4.2 Variant CSS reference

```css
.ui-variant-default {
  background: #111827;
  color: #ffffff;
  border-color: #111827;
}

.ui-variant-default:hover {
  opacity: 0.92;
}

.ui-variant-secondary {
  background: #f3f4f6;
  color: #111827;
  border-color: #e5e7eb;
}

.ui-variant-secondary:hover {
  background: #e5e7eb;
}

.ui-variant-outline {
  background: #ffffff;
  color: #111827;
  border-color: #d1d5db;
}

.ui-variant-outline:hover {
  background: #f9fafb;
}

.ui-variant-ghost {
  background: transparent;
  color: #111827;
  border-color: transparent;
}

.ui-variant-ghost:hover {
  background: #f3f4f6;
}

.ui-variant-destructive {
  background: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

.ui-variant-destructive:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}
```

---

## 5. Base Classes

### 5.1 Base class untuk clickable control

```css
.ui-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  background: transparent;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
  text-decoration: none;
}
```

Dipakai untuk:
- button
- action link yang dibuat seperti button
- icon button
- segmented action

### 5.2 Base class untuk input field

```css
.ui-field {
  width: 100%;
  border: 1px solid #d0d7de;
  background: #ffffff;
  color: #111827;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
}
```

Dipakai untuk:
- text box
- text area
- dropdown
- date input
- custom picker wrapper

---

## 6. State Pattern

### 6.1 Focus
Semua interactive component harus punya focus state yang konsisten.

```css
.ui-control:focus,
.ui-control:focus-visible,
.ui-field:focus,
.ui-field:focus-visible {
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.25);
}
```

### 6.2 Disabled

```css
.ui-disabled,
.ui-control:disabled,
.ui-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### 6.3 Error

```css
.ui-error {
  border-color: #dc2626 !important;
}

.ui-error:focus,
.ui-error:focus-visible {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.18);
}
```

### 6.4 Readonly
Kalau ada readonly state, tampilkan tetap bersih tapi beda halus dari disabled.

```css
.ui-readonly {
  background: #f9fafb;
  color: #6b7280;
}
```

---

## 7. Naming Convention

Gunakan naming class yang sederhana, deskriptif, dan reusable.

### 7.1 Base classes
- `ui-control`
- `ui-field`
- `ui-card`
- `ui-badge`
- `ui-label`
- `ui-helptext`
- `ui-form-group`
- `ui-section`

### 7.2 Modifier classes
- `ui-size-sm`
- `ui-size-md`
- `ui-size-lg`
- `ui-variant-default`
- `ui-variant-secondary`
- `ui-variant-outline`
- `ui-variant-ghost`
- `ui-variant-destructive`
- `ui-error`
- `ui-disabled`
- `ui-readonly`

### 7.3 Aturan kombinasi class
Pattern kombinasi selalu:
- base class
- size class
- variant class bila perlu
- state class bila perlu

Contoh:

```html
<button class="ui-control ui-size-md ui-variant-default">Save</button>
```

```html
<input class="ui-field ui-size-md" />
```

```html
<input class="ui-field ui-size-md ui-error" />
```

---

## 8. Button Pattern

### 8.1 Class structure
Semua button harus memakai:
- `ui-control`
- satu `ui-size-*`
- satu `ui-variant-*`

### 8.2 Contoh

```html
<button class="ui-control ui-size-md ui-variant-default">Submit</button>
<button class="ui-control ui-size-md ui-variant-secondary">Cancel</button>
<button class="ui-control ui-size-md ui-variant-outline">Back</button>
<button class="ui-control ui-size-sm ui-variant-ghost">Edit</button>
<button class="ui-control ui-size-md ui-variant-destructive">Delete</button>
```

### 8.3 Aturan button
- default button size adalah `md`
- CTA utama gunakan `default`
- tombol tambahan gunakan `secondary` atau `outline`
- destructive action selalu gunakan `destructive`
- icon button tetap ikut size global

---

## 9. Input / Textbox / Dropdown Pattern

### 9.1 Field wrapper pattern
Gunakan wrapper yang konsisten untuk label, field, dan help text.

```html
<div class="ui-form-group">
  <label class="ui-label">Email</label>
  <input class="ui-field ui-size-md" />
  <div class="ui-helptext">Masukkan email aktif</div>
</div>
```

### 9.2 CSS wrapper pattern

```css
.ui-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ui-label {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.ui-helptext {
  font-size: 12px;
  color: #6b7280;
}
```

### 9.3 Aturan field
- gunakan `ui-field` untuk semua field-like widget
- size tetap ikut `ui-size-*`
- jangan beri warna custom per field tanpa pattern
- state error harus konsisten
- readonly berbeda dari disabled

---

## 10. Text Area Pattern

Untuk text area, size tidak harus mengunci tinggi tetap seperti input biasa.
Namun tetap mengikuti radius, font-size, dan padding size pattern.

```css
textarea.ui-field.ui-size-sm {
  min-height: 80px;
  padding: 10px 12px;
}

textarea.ui-field.ui-size-md {
  min-height: 96px;
  padding: 12px 16px;
}

textarea.ui-field.ui-size-lg {
  min-height: 120px;
  padding: 14px 20px;
}
```

---

## 11. Card Pattern

Card tidak perlu banyak variant, tapi tetap harus satu bahasa visual.

```css
.ui-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.ui-card.ui-size-sm {
  padding: 12px;
  border-radius: 8px;
}

.ui-card.ui-size-md {
  padding: 16px;
  border-radius: 12px;
}

.ui-card.ui-size-lg {
  padding: 24px;
  border-radius: 16px;
}
```

### Aturan card
- gunakan border tipis
- shadow kecil dan halus
- jangan terlalu banyak warna background berbeda
- panel dalam satu screen harus konsisten

---

## 12. Badge Pattern

```css
.ui-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  font-weight: 500;
}

.ui-badge.ui-size-sm {
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
  border-radius: 999px;
}

.ui-badge.ui-size-md {
  height: 28px;
  padding: 0 10px;
  font-size: 13px;
  border-radius: 999px;
}
```

Badge bisa memakai variant yang sama dengan control bila dibutuhkan.

Contoh:

```html
<span class="ui-badge ui-size-sm ui-variant-secondary">Draft</span>
<span class="ui-badge ui-size-sm ui-variant-outline">Pending</span>
```

---

## 13. Modal / Surface Pattern

Untuk modal content, drawer, panel, dan section besar, gunakan visual surface yang sama.

```css
.ui-surface {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}
```

### Aturan surface
- background putih atau sangat netral
- border soft
- shadow tidak berlebihan
- radius lebih besar dari input

---

## 14. Table / Data Grid Pattern

Walaupun Mendix sering punya widget default, class tambahan harus tetap mengarah ke sistem yang sama.

### Aturan visual data grid
- header punya hierarchy jelas
- row hover lembut
- padding cell konsisten
- border halus
- action di row pakai pattern button yang sama

Contoh pendekatan CSS:

```css
.ui-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.ui-table th {
  background: #f9fafb;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
}

.ui-table td {
  padding: 12px 16px;
  border-top: 1px solid #f1f5f9;
  font-size: 14px;
  color: #111827;
}

.ui-table tbody tr:hover {
  background: #fafafa;
}
```

---

## 15. Tabs Pattern

Untuk tabs, hindari gaya terlalu berat. Gunakan style yang bersih dan netral.

```css
.ui-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.ui-tab {
  padding: 10px 14px;
  border-radius: 8px 8px 0 0;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ui-tab.is-active {
  color: #111827;
  background: #ffffff;
  font-weight: 600;
}
```

---

## 16. Bootstrap-like Naming Alternative

Kalau tim lebih nyaman dengan naming ala Bootstrap, gunakan alias yang konsisten tapi mapping-nya tetap sama.

Contoh:
- `ui-btn`
- `ui-btn-default`
- `ui-btn-secondary`
- `ui-btn-outline`
- `ui-btn-ghost`
- `ui-btn-destructive`
- `ui-btn-sm`
- `ui-btn-md`
- `ui-btn-lg`

Namun disarankan tetap punya satu pattern utama di codebase agar tidak bercampur.

---

## 17. Implementasi di Mendix

### 17.1 Tempat terbaik menaruh style
Taruh class global ini di theme project:
- `theme/web/main.scss` atau structure SCSS yang dipakai project
- reusable partial SCSS untuk component pattern

### 17.2 Cara apply di widget Mendix
Gunakan **class** pada widget atau wrapper container.

Contoh penggunaan:
- Button widget diberi class `ui-control ui-size-md ui-variant-default`
- Text box diberi class `ui-field ui-size-md`
- Container card diberi class `ui-card`
- Section panel diberi class `ui-surface`

### 17.3 Rekomendasi struktur file SCSS

```text
styles/
  _tokens.scss
  _base.scss
  _sizes.scss
  _variants.scss
  _forms.scss
  _buttons.scss
  _cards.scss
  _tables.scss
  main.scss
```

### 17.4 Rekomendasi urutan styling
1. definisikan token dasar
2. definisikan base classes
3. definisikan size modifiers
4. definisikan variant modifiers
5. definisikan component-specific classes
6. mapping ke widget Mendix

---

## 18. Anti Pattern

### 18.1 Ukuran random
Jangan ada button 38px, input 42px, select 36px tanpa dasar pattern.

### 18.2 Variant tidak seragam
Jangan pakai nama variant berbeda-beda seperti:
- `primary`
- `main`
- `solidBlue`
- `dangerRed`

Gunakan nama variant yang sudah ditetapkan.

### 18.3 Styling per page
Jangan taruh styling unik di satu page lalu mengulang lagi di page lain.

### 18.4 Radius dan spacing acak
Jangan campur banyak angka kecil tanpa sistem.

### 18.5 Over-customized widget default
Kalau setiap widget Mendix dimodifikasi dengan gaya berbeda, hasil akhirnya tidak terasa satu sistem.

---

## 19. Golden Rules

Semua component harus mengikuti pola berikut:

### Control component
- base class
- size class
- variant class
- optional state class

Contoh:

```html
<button class="ui-control ui-size-md ui-variant-default">Save</button>
```

### Field component
- base class
- size class
- optional state class

Contoh:

```html
<input class="ui-field ui-size-md" />
<input class="ui-field ui-size-md ui-error" />
```

### Surface component
- surface class
- optional size class

Contoh:

```html
<div class="ui-card ui-size-md">...</div>
```

---

## 20. Starter CSS Reference

Berikut starter CSS yang bisa dijadikan baseline implementasi.

```css
.ui-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  background: transparent;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
  text-decoration: none;
}

.ui-field {
  width: 100%;
  border: 1px solid #d0d7de;
  background: #ffffff;
  color: #111827;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
}

.ui-size-sm {
  height: 32px;
  padding: 0 12px;
  font-size: 14px;
  border-radius: 6px;
}

.ui-size-md {
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border-radius: 8px;
}

.ui-size-lg {
  height: 48px;
  padding: 0 20px;
  font-size: 16px;
  border-radius: 12px;
}

.ui-variant-default {
  background: #111827;
  color: #ffffff;
  border-color: #111827;
}

.ui-variant-secondary {
  background: #f3f4f6;
  color: #111827;
  border-color: #e5e7eb;
}

.ui-variant-outline {
  background: #ffffff;
  color: #111827;
  border-color: #d1d5db;
}

.ui-variant-ghost {
  background: transparent;
  color: #111827;
  border-color: transparent;
}

.ui-variant-destructive {
  background: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

.ui-control:focus,
.ui-control:focus-visible,
.ui-field:focus,
.ui-field:focus-visible {
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.25);
}

.ui-disabled,
.ui-control:disabled,
.ui-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.ui-error {
  border-color: #dc2626 !important;
}
```

---

## 21. Penutup

Target dari guide ini adalah membuat seluruh styling di project Mendix:
- terasa satu keluarga
- mudah di-maintain
- mudah direfactor
- tidak bergantung pada styling random per page
- punya nuansa visual modern ala shadcn/ui

Acuan utamanya adalah:
- ukuran konsisten
- variant konsisten
- state konsisten
- naming class konsisten
- surface dan spacing konsisten

Kalau seluruh widget mengikuti guide ini, UI akan terlihat lebih rapi, lebih dewasa, dan lebih scalable untuk jangka panjang.
