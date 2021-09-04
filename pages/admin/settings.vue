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
              >{{ addLinkBtnText }}</el-button
            >

            <el-table
              :data="
                links.filter(
                  (data) =>
                    !search.links ||
                    data.link.toLowerCase().includes(search.links.toLowerCase())
                )
              "
              class="config-tables"
            >
              <el-table-column
                width="100"
                label="ID"
                prop="id"
              ></el-table-column>
              <el-table-column label="Ссылка" prop="link"></el-table-column>

              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="search.links"
                    size="mini"
                    placeholder="Поиск..."
                  />
                </template>

                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editConfig('links', scope.$index, scope.row)"
                    >Редактировать</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteConfig('links', scope.$index, scope.row)"
                    >Удалить</el-button
                  >
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
              >{{ addQuoteBtnText }}</el-button
            >

            <el-table
              :data="
                quotes.filter(
                  (data) =>
                    !search.quotes ||
                    data.name
                      .toLowerCase()
                      .includes(search.quotes.toLowerCase()) ||
                    data.alias
                      .toLowerCase()
                      .includes(search.quotes.toLowerCase())
                )
              "
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
                  <el-input
                    v-model="search.quotes"
                    size="mini"
                    placeholder="Поиск..."
                  />
                </template>

                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editConfig('quotes', scope.$index, scope.row)"
                    >Редактировать</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteConfig('quotes', scope.$index, scope.row)"
                    >Удалить</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- ------------------------------------------------- -->

    <el-drawer
      size="30%"
      title="Форма добавления/редактирования Yahoo ссылки"
      :visible.sync="drawer.link"
    >
      <div>
        <el-form class="drawer-forms" ref="addLink" :model="addLinkData">
          <el-form-item
            prop="link"
            :rules="[
              {
                required: true,
                message: 'Поле должно быть заполнено',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              placeholder="Ссылка на таблицу"
              v-model="addLinkData.link"
            ></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button
            v-if="!editMode.status"
            plain
            style="width: 50%; margin-left: 25%"
            type="primary"
            @click="addConfig('addLink', 'links')"
            >Добавить</el-button
          >

          <el-button
            v-if="editMode.status"
            plain
            style="width: 50%; margin-left: 25%"
            type="primary"
            @click="addConfig('addLink', 'links')"
            >Сохранить</el-button
          >
        </span>
      </div>
    </el-drawer>

    <el-drawer
      title="Форма добавления/редактирования настроек инструмента"
      :visible.sync="drawer.quote"
    >
      <div>
        <el-form class="drawer-forms" ref="addQuote" :model="addQuoteData">
          <el-form-item
            prop="alias"
            :rules="[
              {
                required: true,
                message: 'Поле должно быть заполнено',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              placeholder="Алиас"
              v-model="addQuoteData.alias"
            ></el-input>
          </el-form-item>

          <el-form-item
            prop="name"
            :rules="[
              {
                required: true,
                message: 'Поле должно быть заполнено',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              placeholder="Название"
              v-model="addQuoteData.name"
            ></el-input>
          </el-form-item>
 
          <el-form-item 
            prop="time"
            :rules="[
              {
                required: true,
                message: 'Поле должно быть заполнено',
                trigger: 'change',
              },
            ]"
          >
            <el-time-picker
              is-range
              class="form-iteam-full-width"
              v-model="addQuoteData.time"
              range-separator="До"
              start-placeholder="Открытие"
              end-placeholder="Закрытие"
              value-format="HH:mm:ss"
            >
            </el-time-picker>
          </el-form-item>
 
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button
            v-if="!editMode.status"
            plain
            style="width: 50%; margin-left: 25%"
            type="primary"
            @click="addConfig('addQuote', 'quotes')"
            >Добавить</el-button
          >

          <el-button
            v-if="editMode.status"
            plain
            style="width: 50%; margin-left: 25%"
            type="primary"
            @click="addConfig('addQuote', 'quotes')"
            >Сохранить</el-button
          >
        </span>
      </div>
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
      editMode: {
        status: false,
        id: 0,
      },
      addQuoteData: {
        alias: "",
        name: "", 
        time: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 18, 0)]
      },
      addLinkData: {
        link: "",
      },
      search: {
        links: "",
        quotes: "",
      },
      searchQuotes: "",
      drawer: {
        link: false,
        quote: false,
      },
      addLinkBtnText: "Добавить ссылку",
      addQuoteBtnText: "Добавить инструмент",
      activeTab: "quotes",
    };
  },
  methods: {
    addConfig(ref, type) {
      this.$refs[ref].validate(async (valid) => {
        if (valid) {
          if (type == "links") {
            if (this.editMode.status) {
              await this.$store.dispatch("config/editLink", {
                id: this.editMode.id,
                link: this.addLinkData.link,
              });
              this.links = await this.$store.dispatch("config/getLinks");

              this.$refs[ref].resetFields();
              this.editMode = {
                status: false,
                id: 0,
              };
              this.drawer.link = false;

              this.$message({
                type: "success",
                message: `Ссылка успешно отредактирована`,
              });
            } else {
              await this.$store.dispatch(
                "config/addLink",
                this.addLinkData.link
              );
              this.links = await this.$store.dispatch("config/getLinks");

              this.$refs[ref].resetFields();

              this.drawer.link = false;

              this.$message({
                type: "success",
                message: `Ссылка успешно добавленная`,
              });
            }
          }

          if (type == "quotes") {
            if (this.editMode.status) {
              await this.$store.dispatch("config/editQuote", {
                id: this.editMode.id,
                ...this.addQuoteData
              });
              this.quotes = await this.$store.dispatch("config/getQuotes");

              this.$refs[ref].resetFields();
              this.editMode = {
                status: false,
                id: 0,
              };
              this.drawer.quote = false;

              this.$message({
                type: "success",
                message: `Настройки успешно отредактированы`,
              });
            } else { 
              await this.$store.dispatch(
                "config/addQuotes",
                this.addQuoteData
              );
              this.quotes = await this.$store.dispatch("config/getQuotes");

              this.$refs[ref].resetFields();

              this.drawer.quote = false;

              this.$message({
                type: "success",
                message: `Настройки успешно добавлены`,
              });
            }
          }
        }
      });
    },

    editConfig(type, index, data) {
      this.editMode.status = true;

      if (type == "links") {
        this.drawer.link = true;

        this.editMode.id = data.id;
        this.addLinkData.link = data.link;
      }

      if(type == "quotes"){
        this.drawer.quote = true;
        
        this.editMode.id = data.id;
        this.addQuoteData.alias = data.alias
        this.addQuoteData.name = data.name
        this.addQuoteData.time = [data.open, data.close]
      }
    },

    async deleteConfig(type, index, data) {
      this.$confirm("Вы уверены, что хотите удалить этот элемент?", "Warning", {
        confirmButtonText: "Да",
        cancelButtonText: "Нет",
        type: "warning",
      }).then(async () => {
        if (type == "links") {
          await this.$store.dispatch("config/deleteLink", data.id);

          this.links = this.links.filter((el) => el.id != data.id);

          this.$message({
            type: "success",
            message: `Ссылка успешно удалена`,
          });
        }

        if (type == "quotes") {
          await this.$store.dispatch("config/deleteQuote", data.id);

          this.quotes = this.quotes.filter((el) => el.id != data.id);

          this.$message({
            type: "success",
            message: `Настройки успешно удалены`,
          });
        }
      });
    },
  },
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

.form-iteam-full-width{
  width: 100% !important;
}
</style>