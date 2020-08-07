<template>
  <div>
    <v-stage
      ref="stage"
      :config="configKonva"
      @dragstart="handleDragstart"
      @dragend="handleDragend"
    >
      <v-layer ref="layer">
        <v-rect
          v-for="field in fieldColection"
          :key="field.id"
          :config="{
            name:'rect',
            x: field.x,
            y: field.y,
            width:  field.width,
            height: field.height,
            fill: 'red',
            shadowBlur: 10,
            cornerRadius: 10,
            cardsId:[]
        }"
        ></v-rect>
        <v-image
          v-for="item in cardColection"
          :key="item.id"
          :config="{
            x: item.x,
            y: item.y,
            image: image,
            rotation: item.rotation,
            id: item.id,
            numPoints: 5,
            innerRadius: 30,
            outerRadius: 50, fill: '#89b717',
            opacity: 0.8,
            draggable: true,
            scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: dragItemId === item.id ? 15 : 5,
            shadowOffsetY: dragItemId === item.id ? 15 : 5,
            shadowOpacity: 0.6
          }"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import io from "socket.io-client";
const width = window.innerWidth;
const height = window.innerHeight;
export default {
  data() {
    return {
      table: [],
      cardColection: [],
      fieldColection: [],
      dragItemId: null,
      fieldToPutId: null,
      dragItemPositionHolder: null,
      image: null,
      filedToPutHolder: null,
      configKonva: {
        width: width,
        height: height,
      },
    };
  },
  methods: {
    getTable() {
      this.socket.emit("getTable");
    },
    putCard(itemId, fieldId) {
      const card = this.cardColection.find((i) => i.id === itemId);
      const field = this.fieldColection.find((i) => i.id === fieldId);
      card.isOnHand = false;
      card.x = field.x;
      card.y = field.y;
      this.refreshBoard();
    },
    //mapTable()
    drawTable() {
      if(this.table){
      for (let i = 0; i < this.table.length; i++) {
        try{
          //let isdsad;
        if (typeof this.table[i] != undefined) {
            for (let j = 0; j < this.table[i].length; j++) {
              this.putCard(this.table[i][j],++i)
            }
        }
        }catch(err){
          //catch undefinded
          //console.log(this.table[i] === undefined);
        }
      }
      }
    },
    refreshBoard() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      //size of stage
      this.configKonva = {
        width: width,
        height: height,
      };
      //size and position of card
      let fieldWidth = width * 0.6;
      let fieldHeight = height * 0.16;
      for (let n = 0; n < 4; n++) {
        if (n < 2) {
          this.fieldColection[n] = {
            id: this.fieldColection[n].id,
            x: fieldHeight,
            y: fieldHeight * (n + 1),
            height: fieldHeight,
            width: fieldWidth,
            rotation: 0,
            scale: 1,
          };
        } else {
          this.fieldColection[n] = {
            id: this.fieldColection[n].id,
            x: fieldHeight,
            y: fieldHeight * (n + 1) + height * 0.05,
            height: fieldHeight,
            width: fieldWidth,
            rotation: 0,
            scale: 1,
          };
        }
      }
      //size and positon of Cards
      let widthOfCard = width * 0.1;
      let heightOfCard = height * 0.1;
      for (let n = 0; n < 5; n++) {
        if (this.cardColection[n].isOnHand == false) {
          this.cardColection[n] = {
            id: this.cardColection[n].id,
            isOnHand: false,
            x: this.cardColection[n].x,
            y: this.cardColection[n].y,
            width: widthOfCard,
            height: heightOfCard,
            scale: 0.5,
            rotation: 0,
          };
        } else {
          this.cardColection[n] = {
            id: this.cardColection[n].id,
            isOnHand: true,
            x: width * 0.1 + widthOfCard * n,
            y: height - heightOfCard,
            width: widthOfCard,
            height: heightOfCard,
            scale: 0.5,
            rotation: 0,
          };
        }
      }
    },
    move(dragItemId) {
      const clientData = { dragItemId: dragItemId, fieldId: this.fieldToPutId };
      this.socket.emit("put", clientData);
    },
    handleDragstart(e) {
      // save drag element:
      this.dragItemId = e.target.id();
      this.dragItemPositionHolder = e.target.absolutePosition();
      // move current element to the top:
      const item = this.cardColection.find((i) => i.id === this.dragItemId);
      const index = this.cardColection.indexOf(item);
      this.cardColection.splice(index, 1);
      this.cardColection.push(item);
    },
    haveIntersection(r1, r2) {
      return !(
        r2.x > r1.x + r1.width / 2 ||
        r2.x + r2.width / 2 < r1.x ||
        r2.y > r1.y + r1.height / 2 ||
        r2.y + r2.height / 2 < r1.y
      );
    },
    checkIsCardOnRect(card) {
      let cardToPut = card.getClientRect();
      const rectsCollection = this.$refs.stage.getStage().find(".rect");
      for (let i = 0; i < rectsCollection.length; i++) {
        if (
          this.haveIntersection(rectsCollection[i].getClientRect(), cardToPut)
        ) {
          let field = rectsCollection[i].getClientRect();
          this.filedToPutHolder = field;
          this.fieldToPutId = this.fieldColection[i].id;
          return true;
        }
      }
      return false;
    },
    handleDragend(e) {
      if (this.checkIsCardOnRect(e.target)) {
        const field = this.filedToPutHolder;
        e.target.absolutePosition({
          x: field.x,
          y: field.y,
        });
        this.move(this.dragItemId);
      } else {
        e.target.absolutePosition({
          x: this.dragItemPositionHolder.x,
          y: this.dragItemPositionHolder.y,
        });
        this.dragItemId = null;
      }
    },
  },
  mounted() {
    //testingBoard
    for (let n = 0; n < 5; n++) {
      this.cardColection.push({
        id: (1 + n) * 10,
        x: 100 + n * 50,
        y: height - 200,
        height: window.innerWidth * 0.1,
        width: window.innerWidth * 0.1,
        isOnHand: true,
        rotation: 2 * 180,
        scale: 0.5,
      });
    }
    for (let n = 0; n < 4; n++) {
      this.fieldColection.push({
        id: 1 + n,
        x: 100 + n * 150,
        y: height - 400,
        height: 100,
        width: 100,
        rotation: 2 * 180,
        scale: 1,
      });
    }
    //endOfTestingBoard
    //resize listener
    window.addEventListener("resize", this.drawTable);
    this.refreshBoard();
  },
  created() {
    this.socket = io("http://localhost:3000");
    const image = new window.Image();
    image.src = "https://konvajs.org/assets/yoda.jpg";
    image.onload = () => {
      // set image only when it is loaded
      this.image = image;
    };

    this.socket.on("updateBoard", (dataFromServer) => {
      //console.log(dataFromServer);
      if (this.dragItemId == dataFromServer.dragItemId) this.dragItemId = null;
      else {
        this.putCard(dataFromServer.dragItemId, dataFromServer.fieldId);
      }
    });

    this.socket.on("sendTable", (table) => {
      this.table = table;
      this.drawTable(this.table.length);
    });

    //Get Table
    this.getTable();
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>