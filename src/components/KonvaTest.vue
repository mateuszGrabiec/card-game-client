<template>
  <div>
    <!-- Tag to refer canvas from konvajs-->
    <v-stage
      ref="stage"
      :config="configKonva"
    >
      <v-layer ref="layer">
         <!-- TODO function to divine width and height to procent values-->
        <v-text
          :config="{
            text: this.cardInfo,
            x: configKonva.width-150,
            y: configKonva.height/4,
            fontSize: 20
          }"
        />
         <!-- It's a tag to place loop of game-->
        <v-group ref="line-group" v-for="field in fieldColection" v-bind:key="field.id">
           <!-- placking a value (to implement) of a row-->
        <v-text
          :config="{
            id:field.id,
            name:'pointsField',
            text: 'x',
            x: field.x-50,
            y: field.y,
            fontSize: 20
          }"
        /> 
        <!-- Its a implement of fields-->   
        <v-rect
          :config="{
            id:field.id,
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
        >
        </v-rect>
        </v-group>
        <!-- Its a implement of card--> 
        <v-image
          v-for="item in cardColection"
          :key="item.id"
          @mouseover="showCardInfo(item)"
          @mouseleave="cardInfo = ''"
          @dragstart="handleDragstart"
          @dragend="handleDragend"
          :config="{
            x: item.x,
            y: item.y,
            image: item.image,
            rotation: item.rotation,
            id: item.id,
            innerRadius: 30,
            outerRadius: 50, fill: '#89b717',
            opacity: 0.8,
            draggable: item.isDraggable,
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
/** returns a value of variables to html
 *
 * 
 * 
 * 
*/
export default {
  data() {
    return {
      table: [],
      cardColection: [],
      fieldColection: [],
      dragItemPositionHolder: null,
      dragItemId: null,
      cardHolder: null,
      image: null,
      filedToPutHolder: null,
      configKonva: {
        width: width,
        height: height,
      },
      showInfo:false,
      cardInfo:"",
    };
  },
  methods: {
    /** Sending request to server to get table
    */
    getTable() {
      this.socket.emit("getTable");
    },

    //method to handle a placing card to field
    putCard(itemId, fieldId, numOnLine=0,numOfCards=1) {
      const card = this.cardColection.find((i) => i.id === itemId);
      const field = this.fieldColection.find((i) => i.id === fieldId);
      const first=field.width/2-card.width*numOfCards/2
      card.x = field.x+first+numOnLine*card.width;
      card.y = field.y;
      this.moveCardTop(card.id)
      //TODO implement not draggable card - 
      //change implementation becouse this cousing bug
      //maybe other prop ?
      card.isDraggable = this.changeIsDraggable();
    },
    changeIsDraggable(){
      //get prop is card can change postinion from server
      return false
    },
    // handler of started game -> host join if u get disconnect | synchronize game
    mapTable() {
      if(this.table){
      for (let i = 0; i < this.table.length; i++) {
        try{
        if (typeof this.table[i] != undefined) {
            for (let j = 0; j <= this.table[i].length; j++) {
              const idx=i+1;
              //check id
              const cardFromServerId = this.table[i][j].id;
              const card = this.cardColection.find((i) => i.id === cardFromServerId);
              if(card){
                this.putCard(card.id,idx,j,this.table[i].length);
              }
            }
        }
        }catch(err){
          //catch undefinded
          //console.log(err);
        }
      }
      }
      this.socket.emit("updateTable",this.table)
      this.refreshBoard()
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
      let scaleOfCard=height*0.00065;
      for (let n = 0; n < 5; n++) {
        if (this.cardColection[n].isDraggable == false) {
          this.cardColection[n] = {
            id: this.cardColection[n].id,
            power:this.cardColection[n].power,
            isDraggable: false,
            image:this.image,
            x: this.cardColection[n].x,
            y: this.cardColection[n].y,
            width: widthOfCard,
            height: heightOfCard,
            scale: scaleOfCard,
            rotation: 0,
          };
        } else {
          this.cardColection[n] = {
            id: this.cardColection[n].id,
            power:this.cardColection[n].power,
            isDraggable: true,
            image:this.image,
            x: width * 0.1 + widthOfCard * n,
            y: height - heightOfCard,
            width: widthOfCard,
            height: heightOfCard,
            scale: scaleOfCard,
            rotation: 0,
          };
          //console.log(this.cardColection[n]);
        }
      }
    },
    // TODO creating a card object
    showCardInfo(item){
      this.cardInfo=item.power
    },
    moveCardTop(cardId){
      // move current element to the top:
      this.cardHolder = this.cardColection.find((i) => i.id === cardId);
      const index = this.cardColection.indexOf(this.cardHolder);
      this.cardColection.splice(index, 1);
      this.cardColection.push(this.cardHolder);
    },
    handleDragstart(e) {
      // save drag element:
      this.dragItemId = e.target.id();
      this.dragItemPositionHolder = e.target.absolutePosition();
      this.moveCardTop(this.dragItemId)
    },
    haveIntersection(r1, r2) {
      return !(
        r2.x > r1.x + r1.width ||
        r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height / 2 ||
        r2.y + r2.height / 2 < r1.y
      );
    },
    //Check if card is on field 
    checkIsCardOnRect(card) {
      let cardToPut = card.getClientRect();
      const rectsCollection = this.$refs.stage.getStage().find(".rect");
      for (let i = 0; i < rectsCollection.length; i++) {
        if (
          this.haveIntersection(rectsCollection[i].getClientRect(), cardToPut)
        ) {
          this.filedToPutHolder = this.fieldColection[i];
          return true;
        }
      }
      return false;
    },
    handleDragend(e) {
      if (this.checkIsCardOnRect(e.target)) {
        const field = this.filedToPutHolder;
        //change card position to dropped position
        const {x, y} = e.target.absolutePosition();
        this.cardHolder.x=x
        this.cardHolder.y=y
        this.move(this.cardHolder, field,this.table);
        this.getTable();
        this.dragItemId=null
      } else {
        e.target.absolutePosition({
          x: this.dragItemPositionHolder.x,
          y: this.dragItemPositionHolder.y,
        });
        this.dragItemId = null;
      }
    },
    move(card,field) {
      const id = field.id
      const clientData = { card: card, fieldId: id,field:field};
      this.socket.emit("put", clientData);
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
        isDraggable: true,
        rotation: 2 * 180,
        scale: 0.5,
        power: (1 + n) * 10
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
    window.addEventListener("resize", this.mapTable);
    this.refreshBoard();
  },
  // Info will be from db and make a method to fetch all;
  created() {
    this.socket = io("http://localhost:3000");
    const image = new window.Image();
    image.src = "https://konvajs.org/assets/yoda.jpg";
    image.onload = () => {
      // set image only when it is loaded
      this.image = image;
    };

    this.socket.on("sendTable", (table) => {
      this.table = table;
      this.mapTable(this.table.length);
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