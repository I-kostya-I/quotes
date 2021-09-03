<template>
  <div class="container">
    <!-- ------------------------------------------------- -->

    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeTab">
          <!-- ------------------------------------------------- -->

          <el-tab-pane label="ССЫЛКИ НА YAHOO ТАБЛИЦЫ" name="links">
            <el-button
              @click="drawer.link = true"
              icon="el-icon-document-copy"
              type="primary"
              plain
            >{{addLinkBtnText}}</el-button>

            <el-table
              :data="links.filter(data => !search.links || data.link.toLowerCase().includes(search.links.toLowerCase()))"
              class="config-tables"
            >
              <el-table-column width="100" label="ID" prop="id"></el-table-column>
              <el-table-column label="Ссылка" prop="link"></el-table-column>

              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="search.links" size="mini" placeholder="Поиск..." />
                </template>

                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editConfig('links', scope.$index, scope.row)"
                  >Редактировать</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteConfig('links', scope.$index, scope.row)"
                  >Удалить</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- ------------------------------------------------- -->

          <el-tab-pane label="СПИСОК ИНСТРУМЕНТОВ" name="quotes">
            <el-button
              @click="drawer.quote = true"
              icon="el-icon-document"
              type="primary"
              plain
            >{{addQuoteBtnText}}</el-button>

            <el-table
              :data="quotes.filter(data => !search.quotes || data.name.toLowerCase().includes(search.quotes.toLowerCase()))"
              class="config-tables"
            >
              <el-table-column label="ID" prop="id"></el-table-column>
              <el-table-column label="Алиас" prop="alias"></el-table-column>
              <el-table-column label="Название" prop="name"></el-table-column>
              <el-table-column label="Время" prop="time">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>Открытие: {{ scope.row.open }}</p>
                    <p>Закрытие: {{ scope.row.close }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">
                        <i class="el-icon-time"></i> Время
                      </el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="search.quotes" size="mini" placeholder="Поиск..." />
                </template>

                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editConfig('quotes', scope.$index, scope.row)"
                  >Редактировать</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteConfig('quotes', scope.$index, scope.row)"
                  >Удалить</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- ------------------------------------------------- -->

    <el-drawer size="30%" title="Форма добавления Yahoo ссылки" :visible.sync="drawer.link">
      <div>
        <el-form class="drawer-forms" ref="addLink" :model="addLinkData">
          <el-form-item
            prop="link"
            :rules="[
              { required: true, message: 'Поле должно быть заполнено', trigger: 'blur' }
            ]"
          >
            <el-input placeholder="Ссылка на таблицу" v-model="addLinkData.link"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button
            plain
            style="width:50%; margin-left : 25%;"
            type="primary"
            @click="addConfig('addLink', 'links')"
          >Добавить</el-button>
        </span>
      </div>
    </el-drawer>

    <el-drawer title="Форма добавления настроек инструмента" :visible.sync="drawer.quote">
      <span>Hi there!</span>
    </el-drawer>
  </div>
</template>

<script>
export default {
  layout: "admin",
  name: "Settings",
  middleware: ["adminAuth"],
  async asyncData({ store }) {
    const links = await store.dispatch("config/getLinks");
    const quotes = await store.dispatch("config/getQuotes");
    return { links, quotes };
  },
  data() {
    return {
      addLinkData: {
        link: ""
      },
      search: {
        links: "",
        quotes: ""
      },
      searchQuotes: "",
      drawer: {
        link: false,
        quote: false
      },
      addLinkBtnText: "Добавить ссылку",
      addQuoteBtnText: "Добавить инструмент",
      activeTab: "links"
    };
  },
  methods: {
    addConfig(ref, type) {
      this.$refs[ref].validate(async valid => {
        if (valid) {
          if (type == "links") {
            await this.$store.dispatch("config/addLink", this.addLinkData.link);
            this.links = await this.$store.dispatch("config/getLinks");

            this.$refs[ref].resetFields();

            this.drawer.link = false;

            this.$message({
              type: "success",
              message: `Ссылка успешно добавленная`
            });
          }
        }
      });
    },

    editConfig(type, index, data) {
      console.log(type, index, data);
    },

    async deleteConfig(type, index, data) {
      this.$confirm(
        "Вы уверены, что хотите удалить этот элемент?",
        "Warning",
        {
          confirmButtonText: "Да",
          cancelButtonText: "Нет",
          type: "warning"
        }
      ).then(async () => {
        if (type == "links") {
          await this.$store.dispatch("config/deleteLink", data.id);
          
          this.links = this.links.filter(el => el.id != data.id);

          this.$message({
            type: "success",
            message: `Ссылка успешно удалена`
          });
        }
      });
    }
  }
};
</script>
 
<style>
.config-tables {
  width: 100%;
  margin-top: 40px;
}

.drawer-forms {
  margin: 5%;
}
</style>