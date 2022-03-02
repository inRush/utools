<template>
  <button @click="dialog=true">打开</button>
  <v-dialog v-model="dialog">
    <v-card class="mx-auto history-list" max-width="400" max-height="300" tile>
      <v-list border>
        <v-list-subheader>历史记录</v-list-subheader>
        <v-list-item two-line :value="1">
          <v-list-item-header>
            <v-list-item-title>
              {"context":{"version":"1.0.0","sign":"d111156a1e72af4ee04c3a60b65e1507","timestamp":1646024441424,"channel":"zhixing","source":"NatlXiangYou","tag":"flight.national.afterservice.electronicInvoiceNotify"},"data":{"orderNo":"XYTX20220224162349","ticketPassengers":[{"name":"成达力艾布塔力甫","cardType":"NI","cardNum":"654324197505160039","tickets":[{"segmentIndex":{"sequenceNum":1},"invoiceInfo":{"ticketType":2,"organizationName":"哈巴河县农业农村局","tfn":"11654324MB1798608A","companyMobile":"","companyAddress":"","bankAccount":"","openAccountBank":"","remark":"行程信息：2022-02-25
              15:35:00 西安-阿勒泰 航班号：MU2377
              乘机人：成达力艾布塔力甫；","price":103,"invoiceDetails":[{"type":"diffPrice","price":103}]}}]}]}}
            </v-list-item-title>
            <v-list-item-subtitle>2022-01-01 15:02:00</v-list-item-subtitle>
          </v-list-item-header>
        </v-list-item>
        <v-list-item two-line :value="2">
          <v-list-item-header>
            <v-list-item-title>
              {"context":{"version":"1.0.0","sign":"d111156a1e72af4ee04c3a60b65e1507","timestamp":1646024441424,"channel":"zhixing","source":"NatlXiangYou","tag":"flight.national.afterservice.electronicInvoiceNotify"},"data":{"orderNo":"XYTX20220224162349","ticketPassengers":[{"name":"成达力艾布塔力甫","cardType":"NI","cardNum":"654324197505160039","tickets":[{"segmentIndex":{"sequenceNum":1},"invoiceInfo":{"ticketType":2,"organizationName":"哈巴河县农业农村局","tfn":"11654324MB1798608A","companyMobile":"","companyAddress":"","bankAccount":"","openAccountBank":"","remark":"行程信息：2022-02-25
              15:35:00 西安-阿勒泰 航班号：MU2377
              乘机人：成达力艾布塔力甫；","price":103,"invoiceDetails":[{"type":"diffPrice","price":103}]}}]}]}}
            </v-list-item-title>
            <v-list-item-subtitle>2022-01-01 15:02:00</v-list-item-subtitle>
          </v-list-item-header>
        </v-list-item>
        <v-list-item two-line :value="3">
          <v-list-item-header>
            <v-list-item-title>
              {"context":{"version":"1.0.0","sign":"d111156a1e72af4ee04c3a60b65e1507","timestamp":1646024441424,"channel":"zhixing","source":"NatlXiangYou","tag":"flight.national.afterservice.electronicInvoiceNotify"},"data":{"orderNo":"XYTX20220224162349","ticketPassengers":[{"name":"成达力艾布塔力甫","cardType":"NI","cardNum":"654324197505160039","tickets":[{"segmentIndex":{"sequenceNum":1},"invoiceInfo":{"ticketType":2,"organizationName":"哈巴河县农业农村局","tfn":"11654324MB1798608A","companyMobile":"","companyAddress":"","bankAccount":"","openAccountBank":"","remark":"行程信息：2022-02-25
              15:35:00 西安-阿勒泰 航班号：MU2377
              乘机人：成达力艾布塔力甫；","price":103,"invoiceDetails":[{"type":"diffPrice","price":103}]}}]}]}}
            </v-list-item-title>
            <v-list-item-subtitle>2022-01-01 15:02:00</v-list-item-subtitle>
          </v-list-item-header>
        </v-list-item>
        <v-list-item two-line :value="4">
          <v-list-item-header>
            <v-list-item-title>
              {"context":{"version":"1.0.0","sign":"d111156a1e72af4ee04c3a60b65e1507","timestamp":1646024441424,"channel":"zhixing","source":"NatlXiangYou","tag":"flight.national.afterservice.electronicInvoiceNotify"},"data":{"orderNo":"XYTX20220224162349","ticketPassengers":[{"name":"成达力艾布塔力甫","cardType":"NI","cardNum":"654324197505160039","tickets":[{"segmentIndex":{"sequenceNum":1},"invoiceInfo":{"ticketType":2,"organizationName":"哈巴河县农业农村局","tfn":"11654324MB1798608A","companyMobile":"","companyAddress":"","bankAccount":"","openAccountBank":"","remark":"行程信息：2022-02-25
              15:35:00 西安-阿勒泰 航班号：MU2377
              乘机人：成达力艾布塔力甫；","price":103,"invoiceDetails":[{"type":"diffPrice","price":103}]}}]}]}}
            </v-list-item-title>
            <v-list-item-subtitle>2022-01-01 15:02:00</v-list-item-subtitle>
          </v-list-item-header>
        </v-list-item>
        <v-list-item two-line :value="4">
          <v-list-item-header>
            <v-list-item-title>
              {"context":{"version":"1.0.0","sign":"d111156a1e72af4ee04c3a60b65e1507","timestamp":1646024441424,"channel":"zhixing","source":"NatlXiangYou","tag":"flight.national.afterservice.electronicInvoiceNotify"},"data":{"orderNo":"XYTX20220224162349","ticketPassengers":[{"name":"成达力艾布塔力甫","cardType":"NI","cardNum":"654324197505160039","tickets":[{"segmentIndex":{"sequenceNum":1},"invoiceInfo":{"ticketType":2,"organizationName":"哈巴河县农业农村局","tfn":"11654324MB1798608A","companyMobile":"","companyAddress":"","bankAccount":"","openAccountBank":"","remark":"行程信息：2022-02-25
              15:35:00 西安-阿勒泰 航班号：MU2377
              乘机人：成达力艾布塔力甫；","price":103,"invoiceDetails":[{"type":"diffPrice","price":103}]}}]}]}}
            </v-list-item-title>
            <v-list-item-subtitle>2022-01-01 15:02:00</v-list-item-subtitle>
          </v-list-item-header>
        </v-list-item>
      </v-list>

    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data: () => ({
    dialog: false,
    items: [
      {text: 'Real-Time', icon: 'mdi-clock'},
    ],
  }),
}
</script>

<style lang="scss" scoped>
.history-list {
  max-height: 200px;
  overflow-y: scroll !important;
}

.history-list::-webkit-scrollbar {
  display: none;
}

</style>
