import Swal from 'sweetalert2'


const customSwal = Swal.mixin({
  customClass: {
    confirmButton: 'swal-btn-confirm',
    cancelButton: 'swal-btn-cancel',
    popup: 'swal-popup',
    title: 'swal-title',
    htmlContainer: 'swal-text'
  },
  buttonsStyling: false
})

export const confirmDialog = async (options = {}) => {
  const result = await customSwal.fire({
    title: options.title || 'Are you sure?',
    text: options.text || '',
    icon: options.icon || 'warning',
    showCancelButton: true,
    confirmButtonText: options.confirmText || 'Yes',
    cancelButtonText: options.cancelText || 'Cancel',
    reverseButtons: true,
    ...options
  })
  
  return result.isConfirmed
}

export const alertDialog = async (options = {}) => {
  await customSwal.fire({
    title: options.title || 'Notice',
    text: options.text || '',
    icon: options.icon || 'info',
    confirmButtonText: options.confirmText || 'OK',
    ...options
  })
}

export const successDialog = async (options = {}) => {
  await customSwal.fire({
    title: options.title || 'Success!',
    text: options.text || '',
    icon: 'success',
    confirmButtonText: options.confirmText || 'OK',
    timer: options.timer || 2000,
    ...options
  })
}

export const errorDialog = async (options = {}) => {
  await customSwal.fire({
    title: options.title || 'Error!',
    text: options.text || '',
    icon: 'error',
    confirmButtonText: options.confirmText || 'OK',
    ...options
  })
}

export default customSwal
