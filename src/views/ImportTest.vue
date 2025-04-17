<script setup>
import { ref } from 'vue';
import BigTable from "@/components/BigTable.vue";

import { useUserStore} from "@/stores/user.js";
const userData = useUserStore();

const settings = ref({
   title: "Marketing" 
});

const urls = ref({
    data: userData.apiBaseUrl + "/marketing",
    dropdowns: {
        customer: { url: userData.apiBaseUrl + "/customer", valueField: "name", labelField: "name_customer" },
        location: { url: userData.apiBaseUrl + "/location", valueField: "location", labelField: "location" }
    }
});

const fields = ref({
    firstCol: {label: "ID", field: "id", type: "number"},
    uneditable: ["id", "plan_hub"],
    checkbox: [
        "front_bumper", "rear_bumper", "roll_bar", "rops", "buggy_whip_cw_flag", "body_strip_3m",
        "foglamp_led_16_mata", "rotary_lamp_led", "rotary_lamp_flash_tube", "lamp_comb_led",
        "safety_cone", "wheel_chock", "fire_exting", "radio_motorolla", "gps", "wheel_nut_indic",
        "tyre_gt_265_65_r17_mt", "radio_icom"
    ],
    date: [
        "inquiry", "date_rfq", "date_deadline_tender", "approval_presdir", "date_Quotation_trja",
        "date_send_quot", "date_approved_quot", "date_spk_po_customer", "date_master_contract",
        "date_po_dealer", "date_send_po", "date_delvery_to_customer", "received_date_by_customer",
        "date_commisioning_finish"
    ]
});
</script>

<template>
  <BigTable 
    :settings="settings"
    :urls="urls" 
    :fields="fields" 
    :canInsert="true"
    :canUpload="true"
  />
</template>
