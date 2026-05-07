<template>
  <div :class="$style.container">
    <div :class="$style.loading">
      <i></i>
      <i></i>
    </div>
    <slot></slot>
  </div>
</template>

<style lang="postcss" module>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes ballLoadingLeft {
  25% {
    z-index: 2;
  }

  50% {
    transform: translate(15px, 0) scale(1);
  }

  75% {
    transform: translate(0, 0) scale(0.75);
  }

  100% {
    transform: translate(-15px, 0) scale(1);
  }
}

@keyframes ballLoadingRight {
  25% {
    transform: translate(0, 0) scale(0.75);
  }

  50% {
    transform: translate(-15px, 0) scale(1);
  }

  75% {
    z-index: 2;
  }

  100% {
    transform: translate(15px, 0) scale(1);
  }
}

.loading {
  width: 50px;
  height: 20px;
  position: relative;

  & > i {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 50%;
    margin-left: -10px;
    display: inline-block;
    border-radius: 50%;

    /* mix-blend-mode: multiply; */

    &:nth-of-type(1) {
      background: #448aff;
      transform: translate(-15px, 0);
      animation: ballLoadingLeft 1s linear infinite;
    }

    &:nth-of-type(2) {
      background: #ff4081;
      transform: translate(15px, 0);
      animation: ballLoadingRight 1s linear infinite;
    }
  }
}
</style>
