<script setup lang="ts">

  import { FilterMatchMode } from '@primevue/core/api';
  import type { DataTableSortEvent } from "primevue";
  import { onMounted, ref, watch } from "vue";

  import type { PaginationResponseDto } from "@/api/dto/pagination/pagination-response.dto";
  import type { RecordFiltersParamsDto } from "@/api/dto/record/record-filters-params.dto";
  import type { RecordResponseDto } from "@/api/dto/record/record-response.dto";
  import { RecordResolver } from "@/api/resolvers/record.resolver";
  import { AgeCategoryLabels } from "@/shared/enums/age-categories.enum";
  import { Attendance, AttendanceLabels } from "@/shared/enums/attendance";
  import { FlowLabels } from "@/shared/enums/flows.enum";
  import { debounce } from "@/utils/debounce.util";

  const getAttendanceSeverity = (attendance: Attendance) => {
    switch (attendance) {
      case Attendance.NOT_STATED: return "secondary";
      case Attendance.PRESENT: return "success";
      case Attendance.ABSENT: return "danger";
    }
  };

  const nextAttendance: Record<Attendance, Attendance> = {
    [Attendance.NOT_STATED]: Attendance.PRESENT,
    [Attendance.PRESENT]: Attendance.ABSENT,
    [Attendance.ABSENT]: Attendance.NOT_STATED
  };

  const records = ref<RecordResponseDto[]>([]);
  const totalRecords = ref<number>(0);
  const params = ref<RecordFiltersParamsDto>({
    page: 0,
    size: 20
  })
  const isLoading = ref<boolean>(false);

  const filters = ref({
    flow: { value: undefined, matchMode: FilterMatchMode.EQUALS },
    username: { value: undefined, matchMode: FilterMatchMode.CONTAINS },
    competitionName: { value: undefined, matchMode: FilterMatchMode.CONTAINS },
    ageCategory: { value: undefined, matchMode: FilterMatchMode.EQUALS },
    attendance: { value: undefined, matchMode: FilterMatchMode.EQUALS }
  });

  const recordResolver = new RecordResolver()

  const updateParamsFromFilters = () => {
    params.value = {
      ...params.value,
      flow: filters.value.flow.value,
      username: filters.value.username.value,
      competitionName: filters.value.competitionName.value,
      ageCategory: filters.value.ageCategory.value,
      attendance: filters.value.attendance.value
    };
  };

  const onPageChange = (event: { page: number, rows: number }) => {
    params.value = {
      ...params.value,
      page: event.page,
      size: event.rows
    };
  };

  const onSort = (event: DataTableSortEvent) => {
    const currentSort = params.value.sort || '';
    const sortFields = currentSort ? currentSort.split(',') : [];

    let newSortFields: string[];

    if (sortFields.includes(event.sortField as string)) {
      newSortFields = sortFields.filter(f => f !== event.sortField);
    } else {
      newSortFields = [...sortFields, event.sortField as string];
    }

    params.value = {
      ...params.value,
      sort: newSortFields.length > 0 ? newSortFields.join(',') : undefined,
      page: 0
    };
  }

  const fetchRecords = async () => {
    isLoading.value = true;
    const response = await recordResolver.getAll(params.value)
    const recordsResponse = (response.message as PaginationResponseDto<RecordResponseDto[]>)
    if (typeof recordsResponse.content !== "undefined") {
      records.value = recordsResponse.content
      totalRecords.value = recordsResponse.totalElements
    }
    isLoading.value = false;
  }

  const updateAttendance = async (id: number, oldAttendance: Attendance | undefined) => {
    const attendance = nextAttendance[oldAttendance ?? Attendance.NOT_STATED]
    const response = await recordResolver.update({ id, attendance })
    if (typeof response.message !== "string") {
      records.value = records.value.map((r) => (r.id === id ? {
        ...r,
        attendance: attendance,
      } : r))
    }
  }

  const debouncedFilter = debounce((callback: () => void) => {
    callback();
  }, 500);

  watch(filters, () => {
    updateParamsFromFilters();
    fetchRecords();
  }, { deep: true });

  watch(() => [params.value.page, params.value.size], () => {
    fetchRecords();
  }, { deep: true });

  onMounted(async () => {
    await fetchRecords();
  })

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
      :rows="params.size"
      paginator
      show-gridlines
      :global-filter-fields="['flow', 'username', 'competitionName', 'ageCategory', 'attendance']"
      filter-display="menu"
      table-style="table-layout: fixed; width: 100%; height: 70vh"
      scrollable
      scroll-height="70vh"
      :rows-per-page-options="[10, 20, 30]"
      :total-records="totalRecords"
      lazy
      @page="onPageChange"
      @sort="onSort"
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
        :sortable="true"
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
        :sortable="true"
        :show-filter-match-modes="false"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <span v-else>{{ data.username }}</span>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <div style="display: flex; justify-content: space-between; gap: 0.5rem; height: 100%">
            <InputText
              v-model="filterModel.value"
              type="text"
              placeholder="Поиск по ФИО"
              @input="debouncedFilter(filterCallback)"
            />
            <Button
              icon="pi pi-times"
              severity="secondary"
              aria-label="clear"
              @click="() => {
                filterModel.value = undefined
                filterCallback()
              }"
            />
          </div>
        </template>
        <template #filterapply />
        <template #filterclear />
      </Column>
      <Column
        field="competitionName"
        header="Компетенция"
        :sortable="true"
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
              @input="debouncedFilter(filterCallback)"
            />
            <Button
              icon="pi pi-times"
              severity="secondary"
              aria-label="clear"
              @click="() => {
                filterModel.value = undefined
                filterCallback()
              }"
            />
          </div>
        </template>
      </Column>
      <Column
        field="ageCategory"
        header="Возрастная группа"
        style="width: 14%"
        :sortable="true"
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
        :sortable="true"
        :show-filter-match-modes="false"
        :filter-menu-style="{ width: '15rem' }"
      >
        <template #body="{ data }">
          <Skeleton v-if="isLoading " />
          <Button
            v-else
            outlined
            style="width: 100%"
            :severity="getAttendanceSeverity(data.attendance)"
            :label="AttendanceLabels.find(a => a.value === data.attendance)?.label"
            @click="updateAttendance(data.id, data.attendance)"
          />
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

  .p-datatable-tbody {
    height: auto;
  }

  .p-datatable-tbody > tr {
    height: 1px;
  }

  .p-datatable-tbody > tr > td {
    height: auto;
    vertical-align: top;
  }

  .logo, .logo > img {
    height: 7rem;
    margin-bottom: 2rem;
  }

  .logo:hover {
    cursor: pointer;
  }
</style>
