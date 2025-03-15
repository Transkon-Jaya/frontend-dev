<template>
  <div class="admin-users">
    <h2>User Management</h2>
    <button @click="openCreateUserModal">Create New User</button>

    <vue-good-table
      :columns="columns"
      :rows="users"
      :pagination-options="{ enabled: true, mode: 'pages', perPage: 10 }"
      :search-options="{ enabled: true }"
      :sort-options="{ enabled: true }"
    >
      <template v-slot:table-row="props">
        <!-- Editable Name -->
        <template v-if="props.column.field === 'name'">
          <input v-model="props.row.name" />
        </template>
        <!-- Editable Username -->
        <template v-else-if="props.column.field === 'username'">
          <input v-model="props.row.username" />
        </template>
        <!-- Level Dropdown -->
        <template v-else-if="props.column.field === 'level'">
          <select v-model="props.row.level">
            <option v-for="lvl in levels" :key="lvl" :value="lvl">
              {{ lvl }}
            </option>
          </select>
        </template>
        <!-- Actions -->
        <template v-else-if="props.column.field === 'actions'">
          <button @click="updateUser(props.row)">Save</button>
          <button @click="deleteUser(props.row)">Delete</button>
        </template>
        <!-- Default Display -->
        <template v-else>
          <span>{{ props.row[props.column.field] }}</span>
        </template>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      levels: Array.from({ length: 11 }, (_, i) => i), // Levels 0 to 10
      columns: [
        { label: "Name", field: "name", editable: true },
        { label: "Username", field: "username", editable: true },
        { label: "Level", field: "level", editable: true },
        { label: "Actions", field: "actions" },
      ],
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await fetch(
          "https://www.transkon-rent.com/api/users",
          {
            method: "GET", // or 'POST', 'PUT', etc.
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt-token")}`, // Replace yourToken with your actual token
            },
            body: JSON.stringify({ level: localStorage.getItem("user_level") }),
          }
        );
        this.users = await response.json();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async updateUser(user) {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    async deleteUser(user) {
      if (confirm(`Are you sure you want to delete ${user.username}?`)) {
        try {
          await fetch(`/api/users/${user.id}`, { method: "DELETE" });
          this.fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    },
    openCreateUserModal() {
      // Placeholder for modal logic
      alert("Open user creation modal");
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.admin-users {
  max-width: 80%;
  margin: auto;
  padding: 20px;
}

button {
  margin: 5px;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

input,
select {
  padding: 5px;
  margin: 2px;
}
</style>
