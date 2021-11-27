<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="用户新增" v-model="showModal">
      <el-form
        ref="dialogForm"
        :model="userForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="action == 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
            placeholder="请输入用户邮箱"
          >
            <template #append>@163.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
// toRow：把响应式对象转化为普通对象
/**
 * 在setup函数中，我们通过ref和reactive函数创建响应式数据，其特点是，每次修改数据都会更新UI界面，这样的问题是非常消耗性能
所以，如果我们有些时候，有些操作可以不需要每次修改数据都去更新UI界面，那么我们可以通过vue3提供的toRaw方法来获取该数据被Proxy包装前的原始数据，然后通过对原始数据进行修改，进而可以修改对应的代理对象内部数据。这是通过原始数据修改改变的，并不会触发 UI界面更新。
import { reactive, toRaw } from "vue";
export default {
  setup() {
    const obj1= {name:'alice'};
    const user = reactive(obj1);
    const obj2 = toRaw(user);
    console.log(obj1 === obj2);//true
    function change() {
      obj2.name = 'Frank';
    }
    return { user, change};
  },
};
上面例子中，通过包装后的响应式对象user来修改，界面会立即更新。但是如果通过修改原始数据obj2 来修改数据，界面是不会跟新的。另外我们可以看见obj2===obj1，由此证明：toRow就是用于获取一个Proxy对象的原始数据

以上是获取reactive的原始数据（创建时响应式数据时传入的原始数据），我们再来看下如何获取ref的原始数据
我们知道ref的本质是reactive，即ref(obj)相当于reactive({value : obj})
所以如果想通过toRaw方法获取ref类型的原始数据，就必须明确告诉toRaw，需要获取的是.value的值。因为.value中保存的才是当初创建时传入的原始数据

import { ref, toRaw } from "vue";
export default {
  setup() {
    const obj1= {name:'alice'};
    const user = ref(obj1);
    const obj2 = toRaw(user.value);
    console.log(obj1,user,obj2);
    return { user };
  },
};

有的情况下，我们希望某个数据在以后的操作中永远都不会被追踪，vue3提供了一个方法：markRaw

setup() {
   const obj= {name:'alice',age:18};
   obj= markRaw(obj);
   const user= reactive(obj);
   function change(){
    user.age=19
   }
   return { user , change};
}

上述代码中，obj被markRaw标记后，当后面将obj变成proxy对象时，发现调用change方法改变数据时，界面并不会再跟新了！

以上就是vue3 toRaw函数和markRaw函数的基本使用！

链接：https://www.jianshu.com/p/c0b103082889
 * 
 * 
 */

// getCurrentInstance 支持访问内部组件实例
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue'
import utils from './../utils/utils'
export default {
  name: 'user',
  setup() {
    // 获取 Composition API 上下文对象
    const { proxy } = getCurrentInstance()
    // 初始化用户表单对象
    const user = reactive({
      state: 0,
    })
    // 初始化用户列表数据
    const userList = ref([])
    // 初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
    })
    // 选中用户列表对象
    const checkedUserIds = ref([])
    // 弹框显示对象
    const showModal = ref(false)
    // 新增用户Form对象
    const userForm = reactive({
      state: 3,
    })
    // 所有角色列表
    const roleList = ref([])
    // 所有部门列表
    const deptList = ref([])
    // 定义用户操作行为
    const action = ref('add')
    // 定义表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: '请输入用户名称',
          trigger: 'blur',
        },
      ],
      userEmail: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: '请输入正确的手机号格式',
          trigger: 'blur',
        },
      ],
      deptId: [
        {
          required: true,
          message: '请输入用户邮箱',
          trigger: 'blur',
        },
      ],
    })
    // 定义动态表格-格式
    const columns = reactive([
      {
        label: '用户ID',
        prop: 'userId',
      },
      {
        label: '用户名',
        prop: 'userName',
      },
      {
        label: '用户邮箱',
        prop: 'userEmail',
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter(row, column, value) {
          return {
            0: '管理员',
            1: '普通用户',
          }[value]
        },
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter(row, column, value) {
          return {
            1: '在职',
            2: '离职',
            3: '试用期',
          }[value]
        },
      },
      {
        label: '注册时间',
        prop: 'createTime',
        width: 180,
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value))
        },
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        width: 180,
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value))
        },
      },
    ])
    // 初始化接口调用
    onMounted(() => {
      getUserList()
      getDeptList()
      getRoleAllList()
    })
    // 获取用户列表
    const getUserList = async () => {
      let params = { ...user, ...pager }
      try {
        const { list, page } = await proxy.$api.getUserList(params)
        userList.value = list
        pager.total = page.total
      } catch (error) {}
    }

    //  查询事件，获取用户列表
    const handleQuery = () => {
      getUserList()
    }

    // 重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }

    // 分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }

    // 用户单个删除
    const handleDel = async (row) => {
      await proxy.$api.userDel({
        userIds: [row.userId], //可单个删除，也可批量删除
      })
      proxy.$message.success('删除成功')
      getUserList()
    }

    // 批量删除
    const handlePatchDel = async () => {
      if (checkedUserIds.value.length == 0) {
        proxy.$message.error('请选择要删除的用户')
        return
      }
      const res = await proxy.$api.userDel({
        userIds: checkedUserIds.value, //可单个删除，也可批量删除
      })
      if (res.nModified > 0) {
        proxy.$message.success('删除成功')
        getUserList()
      } else {
        proxy.$message.success('修改失败')
      }
    }

    // 表格多选
    const handleSelectionChange = (list) => {
      let arr = []
      list.map((item) => {
        arr.push(item.userId)
      })
      checkedUserIds.value = arr
    }

    // 用户新增
    const handleCreate = () => {
      action.value = 'add'
      showModal.value = true
    }

    const getDeptList = async () => {
      let list = await proxy.$api.getDeptList()
      deptList.value = list
    }

    // 角色列表查询
    const getRoleAllList = async () => {
      let list = await proxy.$api.getRoleAllList()
      roleList.value = list
    }

    // 用户弹窗关闭
    const handleClose = () => {
      showModal.value = false
      handleReset('dialogForm')
    }

    // 提交新增用户
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          // toRow：把响应式对象转化为普通对象，否则后续处理入参的时候会影响页面的数据展示，
          // 因为 userForm 被定义为响应式数据了
          let params = toRaw(userForm)
          params.userEmail += '@163.com'
          params.action = action.value
          let res = await proxy.$api.userSubmit(params)
          showModal.value = false
          proxy.$message.success('用户创建成功')
          handleReset('dialogForm')
          getUserList()
        }
      })
    }

    // 用户编辑
    const handleEdit = (row) => {
      action.value = 'edit'
      showModal.value = true
      // $nextTick：等待DOM渲染完成之后再赋值给变量，这样在执行重置表单数据的时候才能生效
      proxy.$nextTick(() => {
        Object.assign(userForm, row)
      })
    }

    return {
      user,
      userList,
      columns,
      pager,
      checkedUserIds,
      showModal,
      userForm,
      rules,
      roleList,
      deptList,
      action,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDel,
      handlePatchDel,
      handleSelectionChange,
      handleCreate,
      getRoleAllList,
      getDeptList,
      handleClose,
      handleSubmit,
      handleEdit,
    }
  },
}
</script>

<style lang="scss"></style>
