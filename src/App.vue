<script setup lang="ts">

  import { FilterMatchMode } from '@primevue/core/api';
  import { onMounted, ref } from "vue";

  import type { PaginationResponseDto } from "@/api/dto/pagination/pagination-response.dto";
  import type { RecordFiltersParamsDto } from "@/api/dto/record/record-filters-params.dto";
  import type { RecordResponseDto } from "@/api/dto/record/record-response.dto";
  import { RecordResolver } from "@/api/resolvers/record.resolver";
  import { AgeCategoryLabels } from "@/shared/enums/age-categories.enum";
  import { AttendanceLabels } from "@/shared/enums/attendance";
  import { FlowLabels } from "@/shared/enums/flows.enum";


  const records = ref<RecordResponseDto[]>(new Array(10).fill({}));
  const params = ref<RecordFiltersParamsDto>({})
  const isLoading = ref<boolean>(false);

  const filters = ref({
    flow: { value: null, matchMode: FilterMatchMode.EQUALS },
    username: { value: null, matchMode: FilterMatchMode.CONTAINS },
    competitionName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ageCategory: { value: null, matchMode: FilterMatchMode.EQUALS },
    attendance: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const recordResolver = new RecordResolver()
  onMounted(async () => {
    await fetchRecords();
  })

  const fetchRecords = async () => {
    isLoading.value = true;
    const response = await recordResolver.getAll(params.value)
    const recordsResponse = (response.message as PaginationResponseDto<RecordResponseDto[]>).content
    if (typeof recordsResponse !== "undefined") {
      records.value = recordsResponse
    }
    isLoading.value = false;
  }

</script>

<template>
  <div class="app-container">
    <div class="logo">
      <img
        src="./assets/logo.png"
        alt="Логотип"
      >
    </div>
    <DataTable
      v-model:filters="filters"
      :value="records"
      :rows="10"
      paginator
      show-gridlines
      :global-filter-fields="['flow', 'username', 'competitionName', 'ageCategory', 'attendance']"
      filter-display="menu"
      table-style="table-layout: fixed; width: 100%;"
    >
      <template #empty>
        No customers found.
      </template>
      <template #loading>
        Loading customers data. Please wait.
      </template>
      <Column
        field="flow"
        header="№ Потока"
        style="width: 13%"
        :show-filter-match-modes="false"
        :filter-menu-style="{ width: '15rem' }"
      >
        <template #body="{ data }">
          <div style="height: 1.5rem">
            <Skeleton v-if="isLoading" />
            <span v-else>{{ FlowLabels.find(l => l.value === data.flow)?.label }}</span>
          </div>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
            v-model="filterModel.value"
            placeholder="Выберите из списка"
            style="width: 100%"
            :options="FlowLabels"
            option-label="label"
            option-value="value"
            show-clear
            @change="filterCallback()"
          />
        </template>
        <template #filterapply />
        <template #filterclear />
      </Column>
      <Column
        field="username"
        header="ФИО"
        :show-filter-match-modes="false"
        :filter-menu-style="{ width: '15rem' }"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ data.username }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            style="width: 100%"
            type="text"
            placeholder="Поиск по ФИО"
            @change="filterCallback()"
          />
        </template>
        <template #filterapply />
        <template #filterclear />
      </Column>
      <Column
        field="competitionName"
        header="Компетенция"
        :show-filter-match-modes="false"
        :show-clear-button="false"
        :show-apply-button="false"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ data.competitionName }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <div style="display: flex; justify-content: space-between; gap: 0.5rem; height: 100%">
            <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Поиск по компетенции"
              @input="filterCallback()"
            />
            <Button
              icon="pi pi-times"
              severity="secondary"
              aria-label="clear"
              @click="() => {
                filterModel.value = ''
                filterCallback()
              }"
            />
          </div>
        </template>
      </Column>
      <Column
        field="ageCategory"
        header="Возрастная группа"
        style="width: 11%"
        :show-filter-match-modes="false"
        :filter-menu-style="{ width: '15rem' }"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ AgeCategoryLabels.find(c => c.value === data.ageCategory)?.label }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
            v-model="filterModel.value"
            placeholder="Выберите из списка"
            style="width: 100%"
            :options="AgeCategoryLabels"
            option-label="label"
            option-value="value"
            show-clear
            @change="filterCallback()"
          />
        </template>
        <template #filterapply />
        <template #filterclear />
      </Column>
      <Column
        field="attendance"
        header="Статус"
        style="width: 14%"
        :show-filter-match-modes="false"
        :filter-menu-style="{ width: '15rem' }"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ AttendanceLabels.find(a => a.value === data.attendance)?.label }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Select
            v-model="filterModel.value"
            placeholder="Выберите из списка"
            style="width: 100%"
            :options="AttendanceLabels"
            option-label="label"
            option-value="value"
            show-clear
            @change="filterCallback()"
          />
        </template>
        <template #filterapply />
        <template #filterclear />
      </Column>
    </DataTable>
  </div>
</template>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 2rem;
  }

  .p-datatable {
    width: 100%;
  }

  .logo, .logo > img {
    height: 7rem;
    margin-bottom: 2rem;
  }

  .logo:hover {
    cursor: pointer;
  }
</style>
