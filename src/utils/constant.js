const professionalType = [
  { id: 1, name: 'Arsitek'},
  { id: 2, name: 'Desainer Interior'}
]

const professionalSorting = [
  { id: 0, name: 'Terdekat'},
  { id: 1, name: 'Terbaik'},
  { id: 2, name: 'Terpopuler'}
]

const homeArchitecturePackage = [
  {
    id: 1,
    name: 'Paket Silver',
    desc:`  \u2022 3D Eksterior (4 view)
  \u2022 Siteplan
  \u2022 Situasi
  \u2022 Denah
  \u2022 Tampak`,
    price: 40000
  },
  {
    id: 2,
    name: 'Paket Gold',
    desc:`  \u2022 3D Eksterior (4 view)
  \u2022 Siteplan
  \u2022 Situasi
  \u2022 Denah
  \u2022 Tampak
  \u2022 Potongan
  \u2022 Detail Arsitektur
  \u2022 Detail Struktur
  \u2022 Detail MEP`,
    price: 60000
  },
]

const transferSteps = {
  atm: (`Bank BCA
1. Pertama, jika kamu menggunakan mesin ATM, kamu tentunya perlu untuk memasukkan Kartu ATM BCA ke mesin ATM, pastikan kartunya tidak terbalik.
2. Masukkan PIN ATM, pastikan PIN yang kamu masukan benar. Setelah itu akan muncul menu transaksi. Di menu ini kamu dapat memilih ‘Menu Transaksi Lainnya’.
3. Kemudian pilih menu ‘transfer’ dan ‘Ke Rek BCA’.
4. Setelah itu kamu dapat memasukkan nomor rekening BCA yang dituju.
5. Kamu dapat melanjutkan dengan memasukan nominal yang akan ditransfer.
6. Setelahnya, akan muncul menu konfirmasi dan ketik YA atau OK jika informasi yang tertampil di layar adalah benar. Selanjutnya, struk akan keluar, dan transaksi selesai.`),
  iBanking: (`Bank BCA
1. Masuk ke laman www.klikbca.com
2. Login kemudian daftarkan nomor rekening tujuan di aplikasi KlikBCA.
3. Buka menu Transfer, lalu pilih Transfer ke Rekening BCA atau Rekening Lainnya.
4. Daftarkan nomor tujuan terlebih dahulu, kemudian pilih nomor rekening dari daftar transfer.
5. Masukkan nominal transfer kemudian tulis berita (bila perlu).
6. Jika rekening dan nominal sudah benar, tekan OK atau Lanjutkan lalu masukkan PIN.
7. Klik kirim, kemudian akan muncul bukti transaksi atau bukti transfer.`),
  mBanking: (`Bank BCA
1. Masuk ke menu m-Transfer.
2. Selanjutnya, pilih transfer ke sesama bank atau lain bank.
3. Jika ke lain bank, maka masuklah ke menu transfer antar rekening. Lalu pilih ke rekening mana yang kamu akan transfer.
4. Setelah itu, masukkan kode bank dan nomor rekening tujuan, lalu masukkan jumlah uang yang akan kamu transfer.
5. Dengan transfer menggunakan Mobile Banking BCA, kamu juga dapat menambahkan berita atau keterangan transfer di akhir step.
6. Kemudian kamu akan melihat menu konfirmasi nomor rekening penerima. Setelah itu kamu diminta memasukkan Personal Identification Number (PIN) BCA, pastikan tidak salah dalam memasukkan PIN`)
}

export {
  professionalType,
  professionalSorting,
  homeArchitecturePackage,
  transferSteps
}
