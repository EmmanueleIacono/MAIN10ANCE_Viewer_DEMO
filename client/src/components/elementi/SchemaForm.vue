<template>
  <table class="form-table">
    <template v-for="field in visibleFields" :key="field.key || field.label">
      <tr v-if="field.type === 'section'" class="section-title-row">
        <td colspan="2"><b>{{ field.label }}</b></td>
      </tr>
      <tr v-else-if="field.type === 'divider'" class="divider-row">
        <td colspan="2"><hr /></td>
      </tr>
      <tr v-else>
        <th>
          <label :for="fieldId(field)">
            <b v-if="field.strong !== false">{{ field.label }}</b>
            <span v-else>{{ field.label }}</span>
          </label>
          <p v-if="field.help" class="field-help"><i>{{ field.help }}</i></p>
        </th>
        <td>
          <p v-if="field.type === 'static'" class="user-field">{{ readValue(field) }}</p>
          <textarea
            v-else-if="field.type === 'textarea'"
            :id="fieldId(field)"
            :value="readValue(field)"
            :disabled="disabled || field.disabled"
            :style="field.style"
            @input="writeValue(field, $event.target.value)"
          ></textarea>
          <select
            v-else-if="field.type === 'select'"
            :id="fieldId(field)"
            :value="readValue(field)"
            :disabled="disabled || field.disabled"
            class="float-dx"
            @change="writeValue(field, $event.target.value)"
          >
            <option value=""></option>
            <option v-for="option in fieldOptions(field)" :key="optionValue(option)" :value="optionValue(option)">
              {{ optionLabel(option) }}
            </option>
          </select>
          <div v-else-if="field.type === 'checkboxGroup'">
            <div v-for="option in fieldOptions(field)" :key="optionValue(option)">
              <input
                :id="`${fieldId(field)}-${optionValue(option)}`"
                :checked="arrayValue(field).includes(optionValue(option))"
                :disabled="disabled || field.disabled"
                :value="optionValue(option)"
                type="checkbox"
                @change="toggleArrayValue(field, optionValue(option), $event.target.checked)"
              >
              <label :for="`${fieldId(field)}-${optionValue(option)}`">{{ optionLabel(option) }}</label>
            </div>
          </div>
          <input
            v-else-if="field.type === 'checkbox'"
            :id="fieldId(field)"
            :checked="!!readValue(field)"
            :disabled="disabled || field.disabled"
            type="checkbox"
            @change="writeValue(field, $event.target.checked)"
          >
          <input
            v-else
            :id="fieldId(field)"
            :value="readValue(field)"
            :disabled="disabled || field.disabled"
            :type="field.type || 'text'"
            @input="writeValue(field, coerceValue(field, $event.target.value))"
          >
        </td>
      </tr>
    </template>
  </table>
</template>

<script>
import {computed} from 'vue';

export default {
  name: 'SchemaForm',
  props: {
    fields: {
      type: Array,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
    context: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update-field'],
  setup(props, {emit}) {
    const visibleFields = computed(() => props.fields.filter(field => {
      return typeof field.visible === 'function' ? field.visible(props.model, props.context) : field.visible !== false;
    }));

    function fieldId(field) {
      return field.id || `field-${field.key}`;
    }

    function readValue(field) {
      if (typeof field.value === 'function') return field.value(props.model, props.context);
      return props.model[field.key] ?? '';
    }

    function writeValue(field, value) {
      emit('update-field', field.key, value);
    }

    function coerceValue(field, value) {
      if (field.type === 'number') return value === '' ? null : Number(value);
      return value;
    }

    function fieldOptions(field) {
      if (typeof field.options === 'function') return field.options(props.model, props.context) || [];
      return field.options || [];
    }

    function optionValue(option) {
      if (option && typeof option === 'object') return option.value ?? option.sigla ?? option.id ?? option.nome;
      return option;
    }

    function optionLabel(option) {
      if (option && typeof option === 'object') return option.label ?? option.nome ?? option.value ?? option.sigla ?? option.id;
      return option;
    }

    function arrayValue(field) {
      return Array.isArray(props.model[field.key]) ? props.model[field.key] : [];
    }

    function toggleArrayValue(field, value, checked) {
      const current = arrayValue(field);
      if (checked && !current.includes(value)) emit('update-field', field.key, [...current, value]);
      if (!checked) emit('update-field', field.key, current.filter(item => item !== value));
    }

    return {
      visibleFields,
      fieldId,
      readValue,
      writeValue,
      coerceValue,
      fieldOptions,
      optionValue,
      optionLabel,
      arrayValue,
      toggleArrayValue,
    };
  },
}
</script>

<style scoped>
textarea {
  resize: vertical;
}

input, textarea {
  float: right;
  line-height: 100%;
  padding: 1px;
  border: 0;
}

select, textarea, input:not([type=checkbox]) {
  width: 100%;
}

.form-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

.form-table .section-title-row td {
  padding: 5px 0;
  text-align: center;
  vertical-align: middle;
}

.form-table .divider-row hr {
  border: none;
  border-top: 1px solid #808080;
  padding: 5px 0;
  width: 60%;
  margin: 0 auto;
}

.form-table th {
  text-align: left;
  width: 50%;
  vertical-align: top;
  padding-right: 10px;
  background-color: unset;
}

.form-table td {
  width: 50%;
  vertical-align: top;
}

.float-dx {
  float: right;
}

.user-field {
  line-height: 100%;
  padding: 0;
  text-align: right;
}

.field-help {
  font-size: smaller;
  font-weight: normal;
}
</style>
