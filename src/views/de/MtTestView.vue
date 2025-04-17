<script setup>
import { ref } from 'vue';
import MiniTable from "@/components/MiniTable.vue";

import { useUserStore} from "@/stores/user.js";
const userData = useUserStore();

const settings = ref({
   title: "Employee Attendanceeee",
   searchText: "Search Employee..."
});

const urls = ref({
  data: userData.apiBaseUrl + "/down_equipment",
  dropdowns: {
    customer: { url: userData.apiBaseUrl + "/customer", valueField: "name", labelField: "name_customer" },
    location: { url: userData.apiBaseUrl + "/location", valueField: "location", labelField: "location" }
  }
});

const fields = ref({
  firstCol: {label: "TK NO", field: "tk_no", type: "type"},
  uneditable: ["id", "plan_hub"],
  checkbox: [
    "front_bumper", "rear_bumper", "roll_bar", "rops", "buggy_whip_cw_flag", "body_strip_3m",
    "foglamp_led_16_mata", "rotary_lamp_led", "rotary_lamp_flash_tube", "lamp_comb_led",
    "safety_cone", "wheel_chock", "fire_exting", "radio_motorolla", "gps", "wheel_nut_indic",
    "tyre_gt_265_65_r17_mt", "radio_icom"
  ],
  date: [
    "last_history_date"
  ]
});
</script>

<template>
  <MiniTable 
    :settings="settings"
    :urls="urls" 
    :fields="fields" 
    :canInsert="true"
    :canUpload="true"
  />
</template>
