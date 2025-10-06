E-Commerce Frontend MVP Guide (Business • FULL per Endpoint)

Goal: Mentee men-deliver MVP FE komersial lengkap yang mencakup semua endpoint yang disediakan: katalog publik, auth, profil, penjual (seller), keranjang, checkout & pesanan, fulfillment penjual, serta ulasan. Fokus pada end-to-end user flows, UI surfaces, akses/otorisasi, dan acceptance criteria—tanpa kode.

Referensi:
API: [Swagger E-Commerce](https://e-commerce-api-production-26ab.up.railway.app/api-swagger/)
Desain: [Figma Project](https://www.figma.com/design/W38k1PafXVD6LnAQo8lNWe/Ecommerce---Batch-4---V2?node-id=29435-3190&t=A1NzwQxsPk9F0oBw-1)

0. Tech Stack (Wajib)
   • Next.js + TypeScript — framework & type safety
   • Tailwind CSS — styling cepat, utility-first
   • shadcn/ui — komponen UI siap pakai
   • TanStack Query (React Query) — fetching & caching server state
   • Optimistic UI — UX responsif (like add-to-cart qty, update status)
   • Day.js — format waktu/tanggal (order timeline, createdAt)
   • Zod + React Hook Form — validasi & form handling (produk, profil, alamat, review)

Opsional pendukung: ESLint/Prettier, Next Image, Playwright untuk smoke E2E.

1. Prinsip Umum

• Auth required: Aksi privat (cart, checkout, my orders, seller actions, review) wajib
login.
• Idempotent & Merge: Add-to-cart harus merge qty untuk item yang sama.
• Pagination / Infinite: Katalog & listing (orders, reviews, seller order-items) gunakan
pagination/infinite. Sertakan Loading, Empty, Error states.
• Public vs Private: Katalog & detail produk publik; cart/orders/review/seller privat.
• Consistency: Subtotal, grandTotal, badges stok/status harus sinkron setelah aksi.

2. Authentication & Session
   Endpoints
   • POST /api/auth/register — daftar
   • POST /api/auth/login — masuk, dapat token

User Stories
• Sebagai user baru, aku bisa daftar dan langsung login.
• Sebagai user, aku bisa login dan sesi persist saat refresh.

UI Surfaces
• Page: Register, Login
• Global: Auth Guard untuk halaman privat; token attached pada request privat.

Acceptance
• Register sukses → diarahkan ke katalog atau cart (jika datang dari checkout).
• Login salah → error jelas; token tersimpan dan terpakai otomatis.

3. Me (User Profile & Identity)

Endpoints
• GET /api/me — profil + quick stats
• PATCH /api/me — update profil dasar

User Stories
• Aku melihat profilku (nama, email, avatar opsional) & quick stats (orders count, spend,
dsb. jika tersedia dari API).
• Aku mengubah info dasar (display name, phone, dsb.).

UI Surfaces
• Page: /me (Overview, Settings)
• Modal/Form: Edit Profile

Acceptance
• PATCH mengupdate data dan UI tanpa reload penuh.

4. Catalog (Public)

Endpoints
• GET /api/products — list produk publik
• GET /api/categories — list kategori (filter)
• GET /api/products/{id} — detail produk

User Stories
• Sebagai pengunjung, aku bisa browsing produk (sort/filter/pagination sederhana).
• Aku bisa melihat detail produk (gambar, harga, deskripsi, rating/reviews).

UI Surfaces
• Page: /products (grid, filter kategori), /products/[id] (detail)
• Components: Product Card (image, title, price, rating), Filters bar

Acceptance
• Pagination/infinite aman; empty/error states ada.
• Filter kategori mempengaruhi query product list.

5. Cart (Private per User)

Endpoints
• GET /api/cart — cart dengan items + subtotal + grandTotal
• DELETE /api/cart — clear cart
• POST /api/cart/items — add item (merge qty bila sudah ada)
• PATCH /api/cart/items/{itemId} — update qty
• DELETE /api/cart/items/{itemId} — remove item

User Stories
• Aku menambahkan produk ke cart dari product list/detail.
• Aku mengubah qty atau menghapus item di cart.
• Aku melihat subtotal & grandTotal yang selalu benar.

UI Surfaces
• Mini Cart (icon + badge qty) & Page: /cart (table/list items, totals, CTA Checkout) Acceptance
• Add-to-cart meng-merge qty jika produk sama.
• Update qty & remove item update subtotal/grandTotal secara konsisten (optimistic +
reconcile).
• Clear cart mengosongkan list & reset totals.

6. Checkout & Orders (Buyer)

Endpoints
• POST /api/checkout atau /api/orders/checkout — create Order & OrderItems (mockpayment=PAID)
• GET /api/orders/my — list pesanan milikku
• GET /api/orders/{id} — detail pesanan
• PATCH /api/orders/items/{id}/complete — konfirmasi terima barang (COMPLETED)

User Stories
• Aku menyelesaikan checkout dari cart → membuat order (status awal sesuai backend,payment mock=PAID).
• Aku melihat riwayat pesanan dengan status per item (e.g.,PROCESSING/SHIPPED/COMPLETED).
• Aku menandai item yang sudah kuterima sebagai COMPLETED.

UI Surfaces
• Page: /checkout (review cart summary, data kontak/pengiriman sederhana untuk MVP)
• Page: /orders (list), /orders/[id] (detail & item-level actions)
• Timeline status per item pada order detail (gunakan Day.js untuk tanggal)

Acceptance
• Setelah checkout sukses, cart menjadi kosong dan diarahkan ke order detail. Order list paginated; detail menampilkan item breakdown dan status.
• Konfirmasi complete hanya muncul untuk item eligible.

7. Reviews (Product Reviews)

Endpoints
• POST /api/reviews — upsert review (syarat: pernah beli & item COMPLETED)
• GET /api/reviews/product/{productId} — list review produk
• DELETE /api/reviews/{id} — delete review milikku

User Stories
• Aku menulis/mengupdate review untuk produk yang sudah benar-benar kuterima.
• Aku membaca review lain di halaman produk.
• Aku bisa menghapus reviewku sendiri.

UI Surfaces
• Section Reviews di Product Detail (list + form jika eligible) Acceptance
• Eligibility check: form review hanya tampil jika syarat terpenuhi.
• Upsert mengupdate list & rating summary secara konsisten.

8. Seller Activation & Shop (Private – Penjual)

Endpoints
• POST /api/seller/activate — aktifkan mode seller (buat shop untuk user ini)
• GET /api/seller/shop — profil toko milikku
• PATCH /api/seller/shop — update profil toko User Stories
• Sebagai user, aku bisa aktifkan mode seller (one-click activation → create shop).
• Sebagai seller, aku melihat & mengubah profil toko.

UI Surfaces
• Page: /seller/activate (call-to-action), /seller/shop (profile & edit)

Acceptance
• Setelah activate, menu Seller muncul; shop profile terbaca & bisa diubah.

9. Seller Products (Private – Penjual)

Endpoints
• GET /api/seller/products — list produk tokoku
• POST /api/seller/products — buat produk
• PUT /api/seller/products/{id} — update produk
• DELETE /api/seller/products/{id} — delete (safe delete)

User Stories
• Sebagai seller, aku mengelola daftar produk: create, edit, delete.

UI Surfaces
• Page: /seller/products (table/list + pagination)
• Modal/Form: Create/Edit Product (nama, harga, stok, kategori, gambar)

Acceptance
• Create langsung muncul di list (optimistic + reconcile).
• Edit dan delete memutakhirkan list tanpa reload penuh (safe delete → tampilkan status removed/archived bila berlaku).

10. Seller Fulfillment (Private – Penjual)

Endpoints
• GET /api/seller/order-items — list order items untuk tokoku
• PATCH /api/seller/order-items/{id}/status — update status item (seller-only)

User Stories
• Sebagai seller, aku melihat order items yang harus kuproses.
• Aku mengubah status item (e.g., PROCESSING → SHIPPED → DELIVERED).

UI Surfaces
• Page: /seller/orders (order items view; filter by status)
• Action: Update Status per item (dropdown/steps)

Acceptance
• Update status memicu refresh list & memberi feedback pengguna (toast/success banner).
• Filter status bekerja dan memiliki empty state.

11. IA (Information Architecture) & Navigasi
    • Public: /products, /products/[id], /categories (opsional sebagai filter), /login, /register
    • Private (Buyer): /cart, /checkout, /orders, /orders/[id], /me
    • Private (Seller): /seller/activate, /seller/shop, /seller/products, /seller/orders
    • Shared Components: Product Card, Category Filter, Price Tag, Rating Badge, Qty Stepper, Cart Drawer, Order Timeline, Review List/Form.

12. Permissions & Edge Cases
    • Only Owner: edit profil, seller shop/profile, seller products, delete review sendiri, confirm complete untuk item miliknya.
    • Stock & Qty: qty tidak boleh < 1, tampilkan peringatan stok limit.
    • Auth gating: akses privat → redirect ke Login dengan return-to.
    • Price changes: pada checkout tampilkan konfirmasi jika harga berubah (jika backend mengembalikan perbedaan). Untuk MVP, asumsikan stabil.

13. Non-Functional Requirements (MVP)
    • Performance: pagination 12–20 produk per halaman; lazy image di katalog.
    • Accessibility: focus ring, alt text produk, kontras cukup.
    • Optimistic UI: add-to-cart, update qty, seller status update, product create/edit/delete.
    • Analytics ringan: view product, add-to-cart, checkout success, seller status update.

14. Deliverables (Checklist per Endpoint → UI)
    • Auth register/login → halaman & persist session ✅
    • Me GET/PATCH → halaman /me + edit profil ✅
    • Catalog GET products/categories/product detail → /products, filter kategori,/products/[id] ✅
    • Cart GET/POST/PATCH/DELETE/clear → mini cart + /cart ✅
    • Checkout POST orders → /checkout + redirect ke /orders/[id] ✅
    • Orders GET my & GET by id & PATCH complete → /orders, /orders/[id] ✅
    • Reviews POST/GET/DELETE → section review pada product detail ✅
    • Seller activate/shop GET/PATCH → /seller/activate, /seller/shop ✅
    • Seller products CRUD → /seller/products + form create/edit + delete ✅
    • Seller fulfillment GET & PATCH status → /seller/orders ✅

15. Definition of Done (DoD)
    • Pengguna baru bisa belanja dari nol: browsing → add-to-cart → checkout → melihat
    order → konfirmasi item complete.
    • Seller baru bisa aktivasi → membuat produk → menerima order item → update status.
    • Semua halaman memiliki Loading/Empty/Error states.
    • Optimistic actions sinkron kembali dengan data server.
    • Totals (subtotal, grandTotal) akurat di semua langkah.

16. Saran Timeline (7 Hari)

1) Hari 1: Auth & Me, IA, Layout, Catalog list + categories.
2) Hari 2: Product detail + Reviews (read).
3) Hari 3: Cart (add/update/remove/clear) + mini cart.
4) Hari 4: Checkout + Orders (list/detail).
5) Hari 5: Reviews (upsert/delete) + QA buyer flows.
6) Hari 7: Seller activation/shop + Seller products CRUD + Fulfillment + QA.

Catatan Mentor: Prioritaskan alur pembeli terlebih dahulu untuk business value tercepat; setelah itu, ramp up ke sisi seller. Pastikan setiap aksi ada feedback visual (toast/state change) dan pagination berjalan mulus di semua listing.
