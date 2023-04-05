<template class="q-pa-md q-gutter-md">
</template>

<script>
export default {
    expose: ['publicData', 'publicMethod'],
    data(){
        return{
            publicData: 'foo',
            privateData: 'bar'
        }
    },
    computed:{


    },
    watch:{

    },
    mounted(){

    },
    methods:{
        publicMethod() {
            /* ... */
        },
        privateMethod() {
            /* ... */
        }
    },
}
</script>

<style>

</style>
