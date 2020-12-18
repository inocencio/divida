<template>
  <div class="bg-gray-700 text-gray-900">
    <div class="p-2 text-right">
    </div>
    <div class="grid grid-cols-4 gap-5">
      <span v-if="debts.length === 0" class="text-white text-lg font-semibold p-2 text-center right-0 left-0 fixed">Sem Dívidas Cadastradas!</span>
      <DebtCard v-for="debt in debts" :key="debt._id" :debt="debt"></DebtCard>
    </div>
  </div>
</template>

<script>
import DebtCard from "@/components/DebtCard";

export default {
  name: 'Home',
  components: {
    DebtCard
  },
  data: () => ({
    debts: {},
  }),
  mounted () {
    this.loadDebts()
  },
  methods: {
    loadDebts() {
      const baseURI = '/debts'

      this.$axios.get(baseURI)
      .then((res) => {
        this.debts = res.data.content

      })
    },
  },
  watch: {
  }
}
</script>