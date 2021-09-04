<template>
  <div id="app">
    <div :class="classObj" class="app-wrapper">
      <div
        v-if="device === 'mobile' && sidebar.opened"
        @click="handleClickOutside"
        class="drawer-bg"
      />
      <coreDrawer :routes="sideBarRoutes" class="sidebar-container" />
      <div class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <coreHeader />
        </div>
        <coreMain />
      </div>
    </div>
  </div>
</template>
<script>
import ResizeHandler from "@/utils/mixins/ResizeHandler";
export default {
  name: "Default",
  mixins: [ResizeHandler],
  data() {
    return {
      sideBarRoutes: [],
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
    error() {
      return this.$store.getters.error;
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
  watch: {
    error(value) {
      console.log(value.response);

      this.$message.error(value.response.data.message);
    },
  },
  mounted() {
    this.sideBarRoutes = [
      {
        path: "/admin/settings",
        name: "Настройки",
        hidden: false,
        meta: { icon: "setting", prefix: "fas" },
      },
      {
        path: "/admin/charts",
        name: "Графики",
        hidden: false,
        meta: { icon: "data-line", prefix: "fas" },
      },
      {
        path: "/admin/logout",
        name: "Выйти",
        hidden: false,
        meta: { icon: "switch-button", prefix: "fas" },
      },
    ];
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
.mobile .fixed-header {
  width: 100%;
}
</style>
 


<style>
.container {
  width: 90%;
  margin: 3% 5% 0;
}

.container .el-table {
  box-shadow: 0 5px 6px rgba(0, 21, 41, 0.08);
}

.btn-add-organizations {
  margin-bottom: 2%;
}

.pagination-page-size {
  margin-bottom: 1%;
}

.pagination-page-size div,
.el-pagination .el-select .el-input {
  margin-left: 0;
  padding-left: 0;
}

.pagination-page-btn {
  margin-top: 2%;
}

.pagination-page-btn > .pagination__rightwrapper {
  box-shadow: 0 5px 6px rgba(0, 21, 41, 0.08) !important;
}

.separate-custome-element {
  border-bottom: 1px solid #e4e4e4;
}
</style>