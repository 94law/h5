<template>
  <svg :height="size" viewBox="0 0 90 40">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <circle fill="#4D88FF" cx="20" cy="16" r="8">
        <animate
          attributeName="cy"
          from="16"
          to="16"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
          values="16; 8; 26; 16; 16"
          keyTimes="0; 0.2; 0.4; 0.6; 1"
        ></animate>
      </circle>
      <circle fill="#17E6CE" cx="46" cy="16" r="8">
        <animate
          attributeName="cy"
          from="16"
          to="16"
          dur="1.5s"
          begin="0.1s"
          repeatCount="indefinite"
          values="16; 8; 26; 16; 16"
          keyTimes="0; 0.2; 0.4; 0.6; 1"
        ></animate>
      </circle>
      <circle fill="#FF884D" cx="72" cy="16" r="8">
        <animate
          attributeName="cy"
          from="16"
          to="16"
          dur="1.5s"
          begin="0.2s"
          repeatCount="indefinite"
          values="16; 8; 26; 16; 16"
          keyTimes="0; 0.2; 0.4; 0.6; 1"
        ></animate>
      </circle>
    </g>
  </svg>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    size?: string;
  }>(),
  { size: '2em' },
);
</script>
