<template>
  <CContainer fluid>
    <div class="firmwares-title">
      <h2>Firmwares</h2>
    </div>

    <div class="d-flex">
      <SidebarItem />
      <div class="sidebar-content">
        <router-view />
      </div>
    </div>
  </CContainer>
</template>

<script setup>
import SidebarItem from '../../components/Firmwares/SidebarItem.vue'
</script>

<style scoped>
.firmwares-title {
  margin-bottom: 20px;
}

.sidebar-content {
  flex-grow: 1;
  padding: 20px;
}
</style>
