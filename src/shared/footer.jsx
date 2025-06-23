export default function Footer() {
    return (
        <div className="container">
            <footer className="row py-5 my-5 border-top">
                {/* Logo dan Deskripsi */}
                <div className="col-md-5 mb-4">
                    <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
                        style={{ fontStyle: 'inter' }}>
                        <img
                            src={"src/assets/logo.png"}
                            alt="Logo"
                            style={{ height: '30px', objectFit: 'contain' }}
                            className="mb-4"
                        />
                    </a>
                    <p className="text-dark">
                        Sistem Pelayanan Terpadu untuk menyampaikan aspirasi, masukan,
                        serta pengaduan dari masyarakat kepada perangkat desa.
                    </p>

                    {/* Tautan Sosial Media */}
                    <div className="d-flex my-4">
                        <ul className="list-unstyled d-flex gap-3 m-0 p-0">
                            <li>
                                <i className="fa-brands fa-youtube fs-4"></i>
                            </li>
                            <li>
                                <i className="fa-brands fa-square-instagram fs-4"></i>
                            </li>
                            <li>
                                <i className="fa-brands fa-facebook fs-4"></i>
                            </li>
                        </ul>
                    </div>

                    {/* Hak Cipta */}
                    <p className="text-muted small">
                        Hak Cipta © 2025, Laporaja
                    </p>
                </div>

                {/* Spacer */}
                <div className="col-md-1"></div>

                {/* Tautan Berguna */}
                <div className="col-md-3 mb-4">
                    <h5 className="fw-bold text-dark mb-3">Tautan Berguna</h5>
                    <ul className="list-unstyled">
                        <li className="mb-2">
                            <a href="/" className="text-decoration-none text-muted">Beranda</a>
                        </li>
                        <li className="mb-2">
                            <a href="#caraKerja" className="text-decoration-none text-muted">Cara Kerja</a>
                        </li>
                        <li className="mb-2">
                            <a href="#testimonial" className="text-decoration-none text-muted">Testimoni</a>
                        </li>
                        <li className="mb-2">
                            <a href="/lapor" className="text-decoration-none text-muted">Lapor</a>
                        </li>
                    </ul>
                </div>

                {/* Hubungi Kami */}
                <div className="col-md-3 mb-4">
                    <h5 className="fw-bold text-dark mb-3">Hubungi Kami</h5>

                    {/* Telepon */}
                    <div className="d-flex align-items-start mb-3">
                        <div className="rounded-circle bg-light p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="fa-solid fa-phone"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small">No. Telepon:</p>
                            <p className="text-dark mb-0 small fw-medium">(+62) 812-3456-7890</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="d-flex align-items-start mb-3">
                        <div className="rounded-circle bg-light p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div>
                            <p className="text-muted mb-0 small">Alamat Email:</p>
                            <p className="text-dark mb-0 small fw-medium">laporaja@govern.com</p>
                        </div>
                    </div>

                    {/* Alamat */}
                    <div className="d-flex align-items-start">
                        <div className="rounded-circle bg-light p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div>
                            <p className="text-dark mb-0 small fw-medium">Jl. Pematang Sawah No. 17</p>
                            <p className="text-dark mb-0 small fw-medium">Desa Sukamaju, Kec. Cibiru</p>
                            <p className="text-dark mb-0 small fw-medium">Kab. Bandung, 40393</p>
                            <p className="text-dark mb-0 small fw-medium">Indonesia</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
