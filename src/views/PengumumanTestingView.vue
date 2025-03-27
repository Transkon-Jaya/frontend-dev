<template>
    <div>
      <h2>Upload Image</h2>
      <textarea v-model="imageDescription" placeholder="Kalimat Pengumuman"></textarea>
      <input type="file" @change="handleFileUpload" />
      <button @click="uploadImage">Upload</button>
  
      <p v-if="uploadStatus">{{ uploadStatus }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        imageName: "",
        imageDescription: "",
        selectedFile: null,
        uploadStatus: "",
      };
    },
    methods: {
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0];
      },
      async uploadImage() {
        if (!this.selectedFile || !this.imageDescription) {
          this.uploadStatus = "Please fill all fields and select an image!";
          return;
        }
  
        let formData = new FormData();
        formData.append("image", this.selectedFile);
        // formData.append("name", this.imageName);
        formData.append("description", this.imageDescription);
  
        try {
          let response = await axios.post("https://www.transkon-rent.com/api/pengumuman", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
  
          if (response.data.status === "success") {
            this.uploadStatus = "Image uploaded successfully!";
          } else {
            this.uploadStatus = "Upload failed: " + response.data.message;
          }
        } catch (error) {
          this.uploadStatus = "Error uploading image.";
          console.error(error);
        }
      },
    },
  };
  </script>
  