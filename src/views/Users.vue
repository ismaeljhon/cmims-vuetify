<script lang="ts" setup>
import { ITableHeader } from '@/interfaces/theme/table.interface';
import { IUser } from '@/interfaces/user.interface';
import MainContent from '@/layouts/MainContent.vue';
import { onMounted, ref } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import UserDialog from '@/components/dialogs/UserDialog.vue'
import { getUsers } from '@/services/UsersService';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog.vue';

const headers = ref<ITableHeader[]>([
  {
    key: 'full_name',
    title: 'Full Name',
  },
  {
    key: 'role',
    title: 'Role',
  },
  {
    key: 'brgy',
    title: 'Assigned Barangay',
  },
  {
    key: 'email',
    title: 'Email'
  },
  {
    key: 'phone_number',
    title: 'Phone Number',
  },
  {
    key: 'action',
    title: '',
  }
])
const users = ref<IUser[]>([])
const isLoading = ref<boolean>(false)

const search = ref<string>('')
const userDialog = ref()
const confirmDialogDelete = ref()

const showUserDialog = (item: IUser | unknown, isActionAdd = true) => {
  userDialog.value.show(item, isActionAdd)
}

const fetchData = async () => {
  isLoading.value = true
  const { data } = await getUsers()
  users.value = data
  isLoading.value = false
}

const proceedDelete = (item: IUser | unknown) => {
  console.log(item)
}

onMounted(() => {
  fetchData()
})
</script>
<template>
  <MainContent icon="manage_accounts">
    <template #title>Manage Users</template>
    <template #top-right>
      <v-btn color="info" variant="outlined" @click="showUserDialog" prepend-icon="add">Add new user</v-btn>
    </template>
    <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
    <br />
    <v-data-table density="comfortable" :headers="headers" :items="users" item-value="name" class="elevation-0"
      :search="search" :loading="isLoading">
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.brgy="{ item }">
        {{ item.columns.brgy?.name || '-' }}
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.action="{ item }">
        <v-btn icon="edit" flat size="small" @click="showUserDialog(item.raw, false)"></v-btn>
        <v-btn color="red" variant="text" icon="delete" flat size="small" @click="confirmDialogDelete.show()"></v-btn>

        <ConfirmationDialog ref="confirmDialogDelete" color="red-darken-4"
          :message="`Are you sure you want to delete user ${item.raw.email}?`" :width="400"
          @confirm="proceedDelete(item.raw)" />
      </template>
    </v-data-table>
  </MainContent>
  <UserDialog ref="userDialog" @after-save="fetchData" />
</template>