# 3 DETIK SETELAHNYA BIKIN BENGONG 😱 Pesawat Nyaris Nabrak Mobil di Tol Vice City #GTA6

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/azkamahvin88/entry-gta6-clipper-01-r3/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/azkamahvin88/entry-gta6-clipper-01-r3/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![make.fun](https://img.shields.io/badge/make.fun-gta6--clipper--01-blue)](https://make.fun/bounty/gta6-clipper-01)
[![YouTube Shorts](https://img.shields.io/badge/YouTube-Shorts-red)](https://youtube.com/shorts/ZNxXpia8_7k)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Entri ronde 3 untuk kompetisi make.fun **gta6-clipper-01 — "Clip GTA 6 for the most YouTube views"** (hadiah $500 USDC, dibagikan untuk 20 besar). Akun peserta: **@monafayola**. Play code: `makefun-alder-marina-blimp`.

## Videonya

Short vertikal 1080x1920 berdurasi **18,5 detik**, dibuat 100% dari footage resmi Rockstar — **bukan gambar AI**.

- **Hook (detik 0–3):** pesawat terbang rendah nyaris menyenggol mobil-mobil di atas tol Vice City, diambil dari GTA VI Trailer 2 resmi.
- **Aftermath (detik 3–18,5):** cuplikan resmi Ocean Drive, lalu kejar-kejaran helikopter sampai ke jet ski — seolah-olah itulah yang terjadi "3 detik setelahnya".
- **Suara:** voiceover Bahasa Indonesia gaul yang narasiin momennya, diiringi musik *"Achilles"* oleh Kevin MacLeod (CC BY 4.0).

Tonton di sini: https://youtube.com/shorts/ZNxXpia8_7k

## File di repo ini

| File | Isi |
| --- | --- |
| `VIDEO.json` | Link YouTube Shorts entri ini (satu baris JSON). |
| `main.ts` | Program entri: menyalin `VIDEO.json` ke direktori output dan memverifikasi salinannya. |
| `README.md` | Dokumen ini. |
| `LICENSE` | Lisensi MIT. |

## Cara menjalankan program (seperti grader)

```bash
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

Program akan:

1. Membaca `VIDEO.json` dari root repo.
2. Membuat direktori `out` bila belum ada, lalu menyalin `VIDEO.json` ke `out/VIDEO.json`.
3. Membaca ulang salinannya dan memastikan isinya identik byte-per-byte dengan aslinya.
4. Mem-parsing JSON-nya dan memvalidasi field `url` — harus string, bukan placeholder, dan cocok dengan pola URL YouTube Shorts (`https://youtube.com/shorts/<id>` atau `https://www.youtube.com/shorts/<id>`).

Kalau semua lolos, program mencetak pesan sukses yang menyebut path tujuan dan ukuran byte-nya. Kalau ada yang gagal, program menulis error ke stderr dan keluar dengan kode 1.

Cek salinannya sendiri:

```bash
cmp VIDEO.json out/VIDEO.json && echo "byte-identical"
```

## Paket publikasi

- Paket publikasi lengkap (naskah, deskripsi, hashtag, dan catatan edit): `~/workspace/makefun/gta6-clipper-01/work/r3-footage/publish-package-r3-footage.md`
- File video: `~/workspace/makefun/gta6-clipper-01/work/gta6-clipper-01-r3-footage.mp4`
