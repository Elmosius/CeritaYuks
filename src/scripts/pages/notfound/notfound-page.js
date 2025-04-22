export default class NotFoundPage {
  async render() {
    return `
        <section class="container not-found-section">
          <h1 class="not-found-title">404 - Halaman Tidak Ditemukan  <a href="#/" class="back-home">Kembali ke Beranda</a></h1>
        </section>
      `;
  }
  s;
  async afterRender() {
    // Tidak ada proses lanjutan
  }
}
