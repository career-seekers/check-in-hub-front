<script lang="ts">
import { defineComponent } from 'vue'

import type { ErrorResponseDto } from "@/api/dto/error/error-response.dto";
import type { ParticipantResponseDto } from "@/api/dto/participant/participant-response.dto";
import type { UpdateParticipantDto } from "@/api/dto/participant/request/update-participant.dto";
import { ParticipantResolver } from "@/api/resolvers/participant.resolver";
import { useDevice } from "@/utils/device-detector.util";

import ParticipantItem from "./UI/ParticipantItem.vue";

export default defineComponent({
  name: "ParticipationList",
  components: { ParticipantItem },
  props: {
    eventId: {
      type: String,
      required: true
    },
  },
  data() {
    const participationResolver = new ParticipantResolver();
    const isMobile = useDevice().isMobile;

    return {
      participationResolver,
      isMobile,
      participants: [] as ParticipantResponseDto[],
      searchQuery: "",
    }
  },
  computed: {
    participationList() {
      return this.participants.filter((el) => el.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  },
  async mounted() {
    const response = await this.participationResolver.getAll();
    if (typeof (response as ErrorResponseDto).msg === "undefined") {
      this.participants = (response as ParticipantResponseDto[])
        .filter(p => p.event.id === Number(this.eventId))
        .sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  methods: {
    async change(id: number, checked: boolean) {
      const updatedData: UpdateParticipantDto = {
        id: id,
        presence: checked,
      }

      await this.participationResolver.update(updatedData);
    },
    async changeCount(id: number, count: number) {
      const updatedData: UpdateParticipantDto = {
        id: id,
        count: count
      }

      await this.participationResolver.update(updatedData).then(() => {
        window.location.reload();
      });
    }
  }
})
</script>

<template>
  <div
    class="container"
    :class="isMobile ? 'container-mobile' : 'container-desktop'"
  >
    <div class="search-input-container">
      <input
        v-model="searchQuery"
        class="text-input"
        type="text"
        placeholder="ФИО Участника"
      >
    </div>

    <div
      v-if="!isMobile"
      class="block-title"
    >
      <div class="block">
        Имя участника
      </div>
      <div class="block">
        Компетенция
      </div>
      <div class="block">
        Возраст
      </div>
      <div class="block">
        Отметить посещение
      </div>
    </div>

    <div
      v-if="participants.length > 0"
      class="wrapper"
    >
      <ParticipantItem
        v-for="(participant, index) in participationList"
        :key="index"
        class="item"
        :is-here="participant.presence"
        :count="participant.count == null ? 0 : participant.count"
        @checkbox-change="(check: boolean) => change(participant.id, check)"
        @count-change="(count: number) => changeCount(participant.id, count)"
      >
        <template #name>
          {{ participant.name }}
        </template>
        <template #competence>
          {{ participant.competence }}
        </template>
        <template #age>
          {{ participant.age }}
        </template>
      </ParticipantItem>
    </div>

    <h1
      v-else
      class="sub-header"
    >
      Пока что участников нет
    </h1>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  padding: 1rem;
  border-radius: 10px;
  gap: 1rem;
}

.container-mobile {
  width: 85%;
  min-height: 30vh;
}

.container-desktop {
  width: 70vw;
  min-height: 50vh;
}

.item {
  border: 1px solid gray;
}

.block-title {
  display: grid;
  grid-template-columns:  5fr 5fr 3fr 8fr;
  justify-content: center;
  align-items: center;
  text-align: left;
  gap: 1rem;
  width: 95%;
  height: 2rem;
  color: black;
  background-color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid gray;
}

.block-title > div {
  border-right: 1px solid black;
  width: 100%;
  overflow-x: scroll;
}

.block-title > div:last-child {
  border: 0;
}

.text-input {
  width: 100%;
  display: flex;
  flex: 1;
  padding: 12px;
  border: 2px solid #b8d8d8;
  border-radius: 8px;
  font-size: 16px;
  background: #f8f9fa;
  color: black;
}

.sub-header {
  color: black;
}
</style>