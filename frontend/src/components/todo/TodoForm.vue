<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { Todo, CreateTodoInput } from '../../types/todo'
import type { FormInstance, FormRules } from 'element-plus'
import { shallowRef } from 'vue'

const props = defineProps<{
  modelValue: boolean
  todo?: Todo | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: CreateTodoInput]
}>()

const formRef = shallowRef<FormInstance>()

const form = reactive({
  title: '',
  content: '',
  priority: 'medium' as 'low' | 'medium' | 'high',
  remindAt: null as string | null,
})

const rules: FormRules = {
  title: [
    { required: true, message: 'Title is required', trigger: 'blur' },
    { min: 1, max: 200, message: 'Title must be 1-200 characters', trigger: 'blur' },
  ],
}

const dialogTitle = computed(() => (props.todo ? 'Edit Todo' : 'New Todo'))

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

watch(
  () => props.modelValue,
  (visible) => {
    if (visible && props.todo) {
      form.title = props.todo.title
      form.content = props.todo.content
      form.priority = props.todo.priority
      form.remindAt = props.todo.remindAt
    } else if (visible) {
      form.title = ''
      form.content = ''
      form.priority = 'medium'
      form.remindAt = null
    }
  }
)

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', {
        title: form.title,
        content: form.content,
        priority: form.priority,
        remindAt: form.remindAt,
      })
      dialogVisible.value = false
    }
  })
}

function handleClose() {
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="520px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="todo-form"
    >
      <el-form-item label="Title" prop="title">
        <el-input
          v-model="form.title"
          placeholder="What needs to be done?"
          maxlength="200"
          show-word-limit
          clearable
        />
      </el-form-item>

      <el-form-item label="Content" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          placeholder="Add some details..."
          :rows="3"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>

      <div class="todo-form-row">
        <el-form-item label="Priority" prop="priority" class="todo-form-priority">
          <el-select v-model="form.priority" placeholder="Priority">
            <el-option label="🟢 Low" value="low" />
            <el-option label="🟡 Medium" value="medium" />
            <el-option label="🔴 High" value="high" />
          </el-select>
        </el-form-item>

        <el-form-item label="Remind At" prop="remindAt" class="todo-form-remind">
          <el-date-picker
            v-model="form.remindAt"
            type="datetime"
            placeholder="Set reminder"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ss"
            clearable
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="todo-form-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ todo ? 'Update' : 'Create' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.todo-form {
  padding: var(--space-sm) 0;
}

.todo-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.todo-form-priority {
  flex: 1;
}

.todo-form-remind {
  flex: 1;
}

.todo-form-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}
</style>
