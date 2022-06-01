<template>
<div class="col-sm-6 col-lg-3">
  <div class="flex">
    <div :style="`--col: ${colore};`" class="circle flex">
      <div v-for="num in numDots" :key="num" class="points" :style="`--i: ${num}; --r: ${360/numDots}deg;`" :class="num <= percentuale ? 'animated' : ''"></div>
    </div>
    <div class="text"><h1 class="h1-db">{{percentuale}}%</h1><h6 class="h6-db">{{descrizione}}</h6></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Speedometer',
  props: {
    colore: {
      type: String,
      default: 'grey',
    },
    numDots: {
      type: Number,
      default: 100,
    },
    percentuale: Number,
    descrizione: String,
  },
}
</script>

<style scoped>
.h1-db, .h6-db {
  color: #333333;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}
.h1-db {font-size: 36px;}
.h6-db {font-size: 13px;}
.flex {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.text {
  position: absolute;
  text-align: center;
}
.circle {
  height: 200px;
}
.points {
  width: 3px;
  height: 15px;
  background: rgba(255, 255, 255, 0.2);
  position: absolute;
  transform: rotate(calc(var(--i)*var(--r))) translateY(-80px);
  border-radius: 3px;
}
.animated {
  animation: glow .01s linear forwards;
  animation-delay: calc(var(--i)*0.05s);
}
@keyframes glow {
  100%{
    background: var(--col);
    box-shadow: 0 0 20px var(--col);
  }
}
</style>
