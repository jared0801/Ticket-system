<template>
    <div class="modal is-active">
        <div @click="toggleModal" class="modal-background"></div>
        <div class="modal-content">
            <div class="notification" :class="classType" style="text-align: center;">
                <p>{{ content }}</p>
                <!-- 
                <p>Are you sure you would like to delete this project? This will delete all tickets associated with this project.</p>
                 -->
                <button class="button" :aria-label="aria" v-on:click="$emit('confirm')">{{ buttonText }}</button>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" v-on:click="toggleModal"></button>
    </div>
</template>

<script>
export default {
    name: "Modal",
    data() {
        return {
        }
    },
    props: {
        content: {
            type: String,
            required: true
        },
        aria: {
            type: String,
            default: 'Confirm'
        },
        buttonText: {
            type: String,
            required: true
        },
        classType: {
            type: String,
        }
    },
    methods: {
        toggleModal() {
            this.$emit('toggle-modal');
        }
    }
}
</script>

<style scoped>

.modal-content {
    cursor: default;
}

</style>