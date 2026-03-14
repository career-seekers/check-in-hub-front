<script setup lang="ts">

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
      :value="records"
      :rows="10"
      paginator
      show-gridlines
      table-style="table-layout: fixed; width: 100%;"
    >
      <Column
        header="№ Потока"
        style="width: 13%"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ FlowLabels[data.flow as never] }}</span>
        </template>
      </Column>
      <Column
        header="ФИО"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ data.username }}</span>
        </template>
      </Column>
      <Column
        header="Компетенция"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ data.competitionName }}</span>
        </template>
      </Column>
      <Column
        header="Возрастная группа"
        style="width: 11%"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ AgeCategoryLabels[data.ageCategory as never] }}</span>
        </template>
      </Column>
      <Column
        header="Статус"
        style="width: 14%"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ AttendanceLabels[data.attendance as never] }}</span>
        </template>
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
