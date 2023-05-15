<template>
    <q-page class="bg-grey-3-colum">
        <div class="row q-pa-sm bg-primary">
            <q-input
                v-model="newTask"
                @keyup.enter="addDbTask"
                class="col"
                bg-color="white"
                filled
                aria-placeholder="Add task"
                dense
            >
                <template v-slot:append>
                <q-btn @click="addDbTask" round dense flat icon="add"></q-btn>
                </template>
            </q-input>
        </div>

        <q-btn label="reset" @click="resetDb"></q-btn>

        <q-list class="bg-white" separator bordered>
            <q-item
            v-for="item in tasks"
            :key="item.title"
            @click="item.done = item.done == 'Y' ? 'N' : 'Y'"
            :class="{ 'done bg-blue-1': item.done == 'Y' }"
            v-ripple
            clickable
            >
                <q-item-section avatar>
                    <q-checkbox
                    v-model="item.done"
                    color="primary"
                    class="no-pointer-event"
                    true-value="Y"
                    false-value="N"
                    dense
                    ></q-checkbox>
                </q-item-section>
                <q-item-section>
                    <q-item-label>{{ item.title }}</q-item-label>
                </q-item-section>
                <q-item-section v-if="item.done=='Y'" side>
                    <q-btn
                        flat
                        round
                        dense
                        color="primary"
                        icon="edit"
                        @click.stop="openDialog(item)"
                        >
                    </q-btn>
                </q-item-section>
                <q-item-section v-if="item.done=='Y'" side>
                    <q-btn
                        flat
                        round
                        dense
                        color="red"
                        icon="delete"
                        @click.stop="removeDbItem(item)"
                    ></q-btn>
                </q-item-section>
            </q-item>
            <div v-intersection="onIntersection" v-if="tasks.length"></div>
        </q-list>
        <div v-if="!tasks.length" class="no-tasks absolute-center">
            <q-icon name="check" size="100px" color="primary" />
            <div class="text-h5 text-primary text-center">No tasks</div>
        </div>
        <DialogCustom
            ref="dialog"
            :edit-task="editTask"
            :origin="origin"
            @onInput="editDbTodo"
            >
        </DialogCustom>

    </q-page>
</template>

<script>
    import { defineComponent } from "vue";
    import todoApi from "src/api/todoApi";
    import DialogCustom from "components/DialogCustom.vue";

    export default defineComponent({
        name:"Todo",
        title:"DB Todo list",
        components:{DialogCustom},
        data(){
            return {
                newTask: "",
                tasks:[],
                totalCount:0,
                editTask:null,
                origin:null
            };
        },
        computed:{
        },
        methods:{
            async addDbTask() {
                if(!this.newTask){
                    this.$refs.list.focus();
                }
                const payload = {title: this.newTask,};
                const result=await todoApi.create(payload);
                if (result.status == 200) {
                    if (result.data.id) {
                    // front
                        this.tasks.unshift({
                            id: result.data.id,
                            title: this.newTask,
                            done: "N",
                        });
                        this.totalCount++;
                    }
                    await this.$q.notify({
                        message: `${this.newTask} 추가하셨습니다`,
                        icon: "home",
                        color: "primary",
                    });
                    this.newTask="";
                }
            },
            async fetchData() {
                const len = 5;
                const lastId = this.tasks.length
                    ? this.tasks[this.tasks.length - 1].seq
                    : 0;
                if (this.tasks.length > 0 && this.tasks.length == this.totalCount) {
                    console.log("fetchData 호출안함", this.tasks.length, this.totalCount);
                    return false;
                }
                const payload = {
                    lastId,
                    len,
                };
                const result = await todoApi.list(payload);
                if (result.data.list) {
                    this.tasks = [...this.tasks, ...result.data.list];
                    this.totalCount = result.data.totalCount;
                }
            },
            async onIntersection(entry) {
                if (entry.isIntersecting) {
                    this.$q.loading.show();
                    await this.fetchData();
                    this.$q.loading.hide();
                }
            },
            openDialog(item) {
                this.$refs.dialog.dialog = true;
                this.editTask = item;
                this.origin = this.editTask.title;
            },
            async editDbTodo(item) {
                //배열에서 수정하되 done은 'n'으로
                const idx = this.tasks.findIndex((task) => task == item);
                item.done = "N";
                this.tasks.splice(idx, 1, item);

                if (this.editTask.title != this.origin) {
                    //타이틀이 다를때만 수정
                    await todoApi.update(item);
                    await this.$q.notify({
                    message: `${item.title} 수정하셨습니다`,
                    icon: "home",
                    color: "primary",
                    });
                }
            },

            //삭제
            async removeDbItem(item) {
                const idx = this.tasks.findIndex((task) => task.seq == item.seq);
                //삭제 array.splice(시작 index, 제거 index, 추가 요소)
                this.tasks.splice(idx, 1);
                const result = await todoApi.remove(item);
                if (result.status == 200) {
                    await this.$q.notify({
                    message: `${item.title} 삭제하셨습니다`,
                    icon: "home",
                    color: "primary",
                    });
                }
            },

            //더미리스트 만들기
            async resetDb() {
                const payload = {
                    title: "todo_",
                    done: "N",
                    len: 100,
                };
                const result = await todoApi.reset(payload);
                if (result.status == 200) {
                    this.fetchData();
                }
            },
            onOKClick() {
                // 인풋 내용없을때 원래 내용인 오리진으로 채워넣어준다. // 예외처리
                if (!this.editTask.title) this.editTask.title = this.origin;
                this.$emit("onInput", this.editTask);
                this.dialog = false;
            },
        },
        mounted(){
            this.fetchData();
        }
    });
</script>

<style lang="scss">
.done {
  .q-item__label {
    text-decoration: line-through;
    color: #bbb;
  }
}
.no-tasks {
  opacity: 0.5;
}
</style>
