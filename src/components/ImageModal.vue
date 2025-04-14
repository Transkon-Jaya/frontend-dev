<template>
    <div
      v-if="showModal"
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      aria-labelledby="imageModalLabel"
      style="display: block;"
      aria-hidden="false"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h5 class="modal-title" id="imageModalLabel">{{ imageTitle }}</h5>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="imageSrc" alt="Image Preview" class="img-fluid" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      imageSrc: {
        type: String,
        required: true
      },
      imageTitle: {
        type: String,
        default: 'Image Preview'
      },
      showModal: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      handleKeydown(e) {
        if (e.key === 'Escape') {
          this.closeModal();
        }
      }
    },
    mounted() {
      window.addEventListener('keydown', this.handleKeydown);
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.handleKeydown);
    }
  };
  </script>
  
  <style scoped>
  .modal {
    display: block;
    z-index: 1050;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .modal-dialog {
    max-width: 90%;
    width: auto;
  }
  
  .modal-body {
    padding: 0;
    text-align: center;
  }
  
  img {
    max-width: 100%;
    max-height: 70vh;
  }
  </style>
  