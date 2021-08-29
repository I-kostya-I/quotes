<template>
  <div class="container"> 
    <el-row>
      <el-col :span="24">

        <div class="btn-add-organizations">
          <el-button @click="orgCreateDialogVisible = true" type="success">{{addBtnOrgText}}</el-button>
        </div>

        <div class="pagination-page-size"> 
          <el-pagination
            @size-change="handleSizeChange"  
            :page-sizes="this.$store.getters['organizations/pagination'].pageSizes"
            :page-size="this.$store.getters['organizations/pagination'].pageSize"
            layout="sizes"
            :total="this.$store.getters['organizations/pagination'].total">
          </el-pagination>
        </div>
 
        <el-table
          border
          :data="this.$store.getters['organizations/organizationsList'].filter(
            data => !searchOrg || 
            data.name.toLowerCase().includes(searchOrg.toLowerCase()) ||
            data.alias.toLowerCase().includes(searchOrg.toLowerCase())
          )"
          style="width: 100%">
          <el-table-column
            sortable
            label="Id"
            prop="id">
          </el-table-column>
          <el-table-column
            sortable
            label="Название организации"
            prop="name">
          </el-table-column>
          <el-table-column
            sortable
            label="Алиас организации"
            prop="alias">
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                :click="scope"
                v-model="searchOrg"
                size="medium"
                placeholder="Введите для поиска ..."/>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleOrgEdit(scope.row)">Edit</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleOrgDelete(scope.row.id)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
 
        <div class="pagination-page-btn"> 
          <el-pagination 
            @current-change="handleCurrentChange" 
            :page-sizes="this.$store.getters['organizations/pagination'].pageSizes"
            :page-size="this.$store.getters['organizations/pagination'].pageSize"
            layout="total, ->, prev, pager, next"
            :total="this.$store.getters['organizations/pagination'].total">
          </el-pagination>
        </div>

        <el-dialog 
          width="50%"
          title="Редактирование организации" 
          :visible.sync="orgEditDialogVisible"
         >
          <el-form 
            :model="OrgForm" 
            :rules="OrgFormRules" 
            ref="OrgForm"
            @keyup.enter.native="saveOrgChange('OrgForm')"
           >

            <el-form-item label="Название" prop="name" :label-width="formLabelWidth">
              <el-input v-model="OrgForm.name" autocomplete="off"></el-input>
            </el-form-item> 

            <el-form-item label="Алиас" prop="alias" :label-width="formLabelWidth">
              <el-input disabled v-model="OrgForm.alias" autocomplete="off"></el-input>
            </el-form-item>

          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="orgEditDialogVisible = false">Отменить</el-button>
            <el-button type="success" @click="saveOrgChange('OrgForm')">Сохранить изменения</el-button> 
          </span>
        </el-dialog>

        <el-dialog 
          width="50%"
          title="Создать организацию" 
          :visible.sync="orgCreateDialogVisible"
         >
          <el-form 
            :model="OrgFormCreate" 
            :rules="OrgFormRulesCreate" 
            ref="OrgFormCreate"
            @keyup.enter.native="saveOrgChange('OrgFormCreate')"
           >

            <el-form-item label="Название" prop="organization.name" :label-width="formLabelWidth">
              <el-input v-model="OrgFormCreate.organization.name" autocomplete="off"></el-input>
            </el-form-item> 

            <el-form-item label="Алиас" prop="organization.alias" :label-width="formLabelWidth">
              <el-input v-model="OrgFormCreate.organization.alias" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Фио владельца" prop="owner.username" :label-width="formLabelWidth">
              <el-input v-model="OrgFormCreate.owner.username" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Email владельца" prop="owner.email" :label-width="formLabelWidth">
              <el-input v-model="OrgFormCreate.owner.email" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Пароль владельца" prop="owner.password" :label-width="formLabelWidth">
              <el-input v-model="OrgFormCreate.owner.password" autocomplete="off"></el-input>
            </el-form-item>

          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="orgCreateDialogVisible = false">Отменить</el-button>
            <el-button type="success" @click="saveOrgCreate('OrgFormCreate')">Сохранить изменения</el-button> 
          </span>
        </el-dialog>

      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  name: 'Organization', 
  middleware: ['adminAuth', 'roleSecurity'],
  async asyncData({store}){ 
    // await store.dispatch('organizations/get')  
  }, 
  data(){
    return { 
      addBtnOrgText : " + Создать организацию ", 
      searchOrg: "",
      orgEditDialogVisible : false,
      orgCreateDialogVisible : false,
      formLabelWidth : "160px",
      OrgForm: {
        name: '', 
        alias : ''
      },
      OrgFormCreate: {
        organization : {
          name: '', 
          alias : ''
        }, 
        owner : {
          username : '',
          email : '',
          password : ''
        } 
      },
      OrgFormRules : {
        name : [
          { required: true, message: 'Пожалуйста, введите название организации' }
        ],
        alias : [
          { required: true, message: 'Пожалуйста, введите алиас организации' }
        ]
      },
      OrgFormRulesCreate : {
        "organization.name" : [
          { required: true, message: 'Пожалуйста, введите название организации' }
        ],
        "organization.alias" : [
          { required: true, message: 'Пожалуйста, введите алиас организации' }
        ],

        "owner.email" : [
          { required: true, message: 'Пожалуйста, введите email владельца организации' },
          { type: 'email', message: 'Пожалуйста, введите правильный адрес электронной почты'}
        ],
        "owner.username" : [
          { required: true, message: 'Пожалуйста, введите ФИО владельца организации' }
        ],
        "owner.password" : [
          { required: true, message: 'Пожалуйста, введите пароль владельца организации' },
          { min: 6, message: 'Пароль должен быть не менее 6 символов' }
        ]

      }
    }
  },
  methods: {
    saveOrgCreate(formName){
      this.$refs[formName].validate( async (valid) => {
        if (valid) {   
          await this.$store.dispatch('organizations/create', this.OrgFormCreate)

          this.$message({
            message: `Организация ${this.OrgFormCreate.organization.name} успешно создана!`,
            type: 'success'
          }); 

          this.orgCreateDialogVisible = false 

          this.$refs[formName].resetFields();

          await this.$store.dispatch('organizations/get') 
        } 
      });
    },
    saveOrgChange(formName){
      this.$refs[formName].validate( async (valid) => {
        if (valid) {  
          await this.$store.dispatch('organizations/edit', this.OrgForm)

          this.orgEditDialogVisible = false

          this.$message({
            message: `Организация ${this.OrgForm.name} успешно обновлена!`,
            type: 'success'
          });
        } 
      });
    },
    handleOrgEdit(org) { 
      this.OrgForm.name = org.name
      this.OrgForm.alias = org.alias
      this.orgEditDialogVisible = true
    },
    handleOrgDelete(id) {
      console.log(id);
    },

    async handleSizeChange(size) { 
      await this.$store.dispatch('organizations/sizeChange', size) 
    },
    async handleCurrentChange(current) {
      await this.$store.dispatch('organizations/currentChange', current) 
    }
  }
}
</script>
 