<template>
  <label>
    <input
        type="text"
        v-bind:value="value"
        v-on:input="$emit('localValue', $event.target)"
        class="text-gray-900 p-2 font-semibold"
        :class="{ 'border-2 border-red-500 h-10' : errLabel }"
        :placeholder="template"
    >
  </label>
</template>

<script>
export default {
  props: [
      'template', 'errLabel', 'value'
  ],
  model: {
    prop: 'value',
    event: 'onValueChange'
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('onValueChange', value)
      }
    }
  },
  watch: {
    value() {
      this.localValue = this.value
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{2})?(\d{2})?(\d{4})?/g, '$1/$2/$3')
        .substr(0, this.template.length)
    }
  }
}
</script>

<style scoped>

</style>