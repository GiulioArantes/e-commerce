// close or open models
const modals = document.querySelectorAll('.modal');
let activeModal = null;
export const modalActions = {
  open: (modalType) => {
    const modal = [...modals].find((m) => m.dataset.modalType === modalType);
    if (modal) {
      activeModal = modal;
      modal.style.display = 'flex';
    }
  },

  close: () => {
    if (activeModal) {
      activeModal.style.display = 'none';
      activeModal = null;
    }
  },
};

// Funtion: Open description
const modalDescription = document.querySelector('#modal-description');
export function openProductModal(product) {
  modalDescription.textContent = product.description;
  modalActions.open('product');
}
