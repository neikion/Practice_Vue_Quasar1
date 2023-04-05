
<template>
    <button @click="count++">당신은 {{ count }} 번 클릭했습니다.</button>
</template>
<script>
export default {
    data() {
        return {
            count: 0
        }
    }
}
</script>

