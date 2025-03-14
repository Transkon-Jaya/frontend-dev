<script setup>
import { onMounted } from "vue";

const fetchData = async () => {
  const token = localStorage.getItem("token"); // Get JWT token
  const userLevel = localStorage.getItem("user_level"); // Get user level
  console.log(token);
  try {
    const response = await fetch("https://www.transkon-rent.com/api/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Attach token
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    console.log(data); // Log response data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Fetch data on component mount
onMounted(fetchData);
</script>
