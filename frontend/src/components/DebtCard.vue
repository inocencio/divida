<template>
  <button @click="$router.push(`/debt/${debt._id}`)" class="focus:outline-none">

    <div class="p-1 m-4 bg-gray-100 border rounded-md shadow">
      <div class="flex flex-wrap content-start top-0 overflow-hidden">

        <!-- Debt Info -->
        <div class="p-1 mt-2 w-full">
          <div class="bg-gray-100 p-1">
            <div class="items-baseline text-left h-20">
              <h4 class="font-semibold leading-tight truncate text-left mb-2 text-lg">
                {{ debt.name }}
              </h4>
              <h4 class="leading-tight text-left">
                <label>
                  <span>{{ debt.value | currencyFormatter }}</span>
                </label>
              </h4>
            </div>

          </div>
        </div>
      </div>
    </div>

  </button>
</template>

<script>
export default {
  props: ['debt'],
  data: () => ({
    logged: false
  }),
}
</script>

<style scoped>
</style>