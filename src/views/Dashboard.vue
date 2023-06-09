<script lang="ts" setup>
import { useAuthentication } from '@/composables/useAuthentication';
import { ITableHeader } from '@/interfaces/theme/table.interface';
import MainContent from '@/layouts/MainContent.vue';
import { getTotalItems } from '@/services/ItemsService';
import { getTotalUserInventoryRequest } from '@/services/UsersService'
import Items from '@/views/Items.vue'
import Requests from '@/views/Requests.vue'
import { computed } from 'vue';
import { onMounted, ref } from 'vue';

const { brgyAssignedId, isAdmin } = useAuthentication()

const userLatestAddedHeader: ITableHeader[] = [
  {
    title: 'Item Name',
    align: 'start',
    key: 'name',
    fixed: false
  },
  {
    title: 'Brand',
    align: 'start',
    key: 'brands.name'
  },
  {
    title: 'Units',
    align: 'start',
    key: 'units'
  },
  {
    title: 'Quantity',
    align: 'center',
    key: 'quantity'
  }
]

const latestUsersInventoryRequestHeadersForUserView: ITableHeader[] = [
  {
    title: 'ID',
    align: 'start',
    key: 'id',
  },
  {
    title: 'Item',
    align: 'start',
    key: 'item.name',
  },
  {
    title: 'Quantity Requested',
    align: 'center',
    key: 'quantity',
  },
  {
    title: 'Requested By',
    align: 'start',
    key: 'requestedBy.full_name',
  }
]

const latestUsersInventoryRequestHeadersForAdminView: ITableHeader[] = [
  {
    title: 'ID',
    align: 'start',
    key: 'id',
  },
  {
    title: 'Brgy',
    align: 'start',
    key: 'brgy.name',
  },
  {
    title: 'Item',
    align: 'start',
    key: 'item.name',
  },
  {
    title: 'Quantity',
    align: 'center',
    key: 'quantity',
  },
  {
    title: 'Requested By',
    align: 'start',
    key: 'requestedBy.full_name',
  }
]


const latestUsersInventoryRequestHeaders = computed(() => isAdmin.value ? latestUsersInventoryRequestHeadersForAdminView : latestUsersInventoryRequestHeadersForUserView)

const totalQuantity = ref<number>(0)
const totalItems = ref<number>(0)
const expiredItems = ref<number>(0)
const totalUserInventoryRequests = ref<number>(0)
const isLoadingTotalItems = ref<boolean>(false)
const isLoadingTotalUserInventoryRequests = ref<boolean>(false)

const fetchTotalUserInventoryRequests = async () => {
  isLoadingTotalUserInventoryRequests.value = true

  const { total_user_inventory_requests } = await getTotalUserInventoryRequest({
    brgyId: brgyAssignedId.value
  })
  totalUserInventoryRequests.value = total_user_inventory_requests

  isLoadingTotalUserInventoryRequests.value = false
}

const fetchTotalItems = async () => {
  isLoadingTotalItems.value = true

  const { total_items, total_quantity, expired_items } = await getTotalItems({
    brgyId: brgyAssignedId.value
  })
  totalQuantity.value = total_quantity
  totalItems.value = total_items
  expiredItems.value = expired_items

  isLoadingTotalItems.value = false
}

const totalQuantityValue = computed(() => {
  let str = totalQuantity.value.toString()
  str += `${totalQuantity.value ? ' pc' : ''}${totalQuantity.value > 1 ? 's' : ''}`

  return str
})
onMounted(async () => {
  fetchTotalItems()
  fetchTotalUserInventoryRequests()
})
</script>
<template>
  <MainContent icon="dashboard">
    <template #title>Dashboard</template>
    <v-row>
      <v-col>
        <v-card :loading="isLoadingTotalItems" :disabled="isLoadingTotalItems">
          <v-card-text class="pa-a5">
            <div class="d-flex align-center">
              <v-icon icon="medication" size="50" class="align-self-center mx-3" color="success"></v-icon>
              <div class="ml-4 mr-1">
                <h4 class="text-subtitle-1">Total Items</h4>
                <p v-if="isLoadingTotalItems" class="mb-3">Calculating data..</p>
                <h2 v-else class="text-h5">{{ totalItems }}</h2>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card :loading="isLoadingTotalItems" :disabled="isLoadingTotalItems">
          <v-card-text class="pa-a5">
            <div class="d-flex align-center">
              <v-icon icon="medical_information" size="50" class="align-self-center mx-3" color="info"></v-icon>
              <div class="ml-4 mr-1">
                <h4 class="text-subtitle-1">Total Quantity</h4>
                <p v-if="isLoadingTotalItems" class="mb-3">Calculating data..</p>
                <h2 v-else class="text-h5">{{ totalQuantityValue }}</h2>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card :loading="isLoadingTotalItems" :disabled="isLoadingTotalItems">
          <v-card-text class="pa-a5">
            <div class="d-flex align-center">
              <v-icon icon="warning_amber" size="50" class="align-self-center mx-3" color="error"></v-icon>
              <div class="ml-4 mr-1">
                <h4 class="text-subtitle-1">Expired Item(s)</h4>
                <p v-if="isLoadingTotalItems" class="mb-3">Calculating data..</p>
                <h2 v-else class="text-h5">{{ expiredItems }}</h2>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card :loading="isLoadingTotalUserInventoryRequests" :disabled="isLoadingTotalUserInventoryRequests">
          <v-card-text class="pa-a5">
            <div class="d-flex align-center">
              <v-icon icon="notification_important" size="50" class="align-self-center mx-3" color="warning"></v-icon>
              <div class="ml-4 mr-1">
                <h4 class="text-subtitle-1">Inventory Requests</h4>
                <p v-if="isLoadingTotalUserInventoryRequests" class="mb-3">Calculating data..</p>
                <h2 v-else class="text-h5">{{ totalUserInventoryRequests }}</h2>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <Items title="Latest Items Added" :custom-headers="userLatestAddedHeader" hide-search hide-pagination
          show-latest-only>
          <template #top-right>
            <v-btn color="info" variant="text" size="small" href="#items" target="_blank" prepend-icon="open_in_new">
              View items
            </v-btn>
          </template>
        </Items>
      </v-col>
      <v-col cols="6">
        <Requests :custom-headers="latestUsersInventoryRequestHeaders" hide-search hide-pagination show-latest-only>
          <template #top-right>
            <v-btn color="info" variant="text" size="small" href="#requests" target="_blank" prepend-icon="open_in_new">
              View Requests
            </v-btn>
          </template>
        </Requests>
      </v-col>
    </v-row>
  </MainContent>
</template>
