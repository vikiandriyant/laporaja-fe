import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function ModalSukses({ show, onClose, message, onNavigate }) {
    useEffect(() => {
        if (show) {
            Swal.fire({
                title: '<h6 class="mb-2 fw-bold">Berhasil!</h6>', 
                html: `<p class="fs-6 mb-3">${message}</p>`, 
                icon: 'success',
                width: 350, 
                showCancelButton: true,
                confirmButtonText: 'Lihat Riwayat',
                cancelButtonText: 'Tutup',
                buttonsStyling: false,
                customClass: {
                    popup: 'p-3', 
                    confirmButton: 'btn btn-success btn-sm me-2', 
                    cancelButton: 'btn btn-outline-secondary btn-sm'
                }
            }).then((result) => {
                if (result.isConfirmed) onNavigate();
                else onClose();
            });
        }
    },);

    return null;
}