

<script lang="ts" setup>
import { ISidebarNavigation } from '@/interfaces/theme/sidebar.interface';
import { computed, ref } from 'vue';
import { signOut } from '@/services/AuthenticationService'
import { useRouter } from 'vue-router'
import { useAuthentication } from '@/composables/useAuthentication';

const drawer = ref<boolean>(true)
const navigation: ISidebarNavigation[] = [
  {
    icon: 'dashboard',
    label: 'Dashboard',
    link: '/dashboard',
  },
  {
    icon: 'medical_information',
    label: 'Items',
    link: '/items',
  },
  {
    icon: 'fact_check',
    label: 'Inventory Requests',
    link: '/requests',
  },
  {
    icon: 'manage_accounts',
    label: 'Users',
    link: '/users',
    isAdmin: true
  }
]

const userNavigation: ISidebarNavigation[] = navigation.filter(nav => !nav.isAdmin) || []
const router = useRouter()
const { isAdmin, fullName, brgyAssigned } = useAuthentication()

const handleSignOut = async () => {
  await signOut()

  router.push({
    name: 'Login'
  })
}

const filteredNavigation = computed(() => {
  return isAdmin.value ? navigation : userNavigation
})

const assignedIndicator = computed(() => {
  return isAdmin.value ? 'City Health Office' : `Brgy ${brgyAssigned.value.name}`
})

</script>

<template>
  <v-app id="inspire">
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        Centralized Medical Inventory Management System
      </v-toolbar-title>
      <v-btn id="menu-activator" append-icon="expand_more" class="ml-1">
        {{ fullName }} | ({{ assignedIndicator }})
      </v-btn>

      <v-menu activator="#menu-activator">
        <v-list>
          <v-list-item>
            <v-list-item-title key="logout" value="logout">
              <v-btn variant="text" class="text-left" prepend-icon="logout" @click="handleSignOut">Sign out</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item v-for="(nav, index) in filteredNavigation" :key="index" :prepend-icon="nav.icon" :title="nav.label"
          :value="index" :to="nav.link"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid fill-height>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
