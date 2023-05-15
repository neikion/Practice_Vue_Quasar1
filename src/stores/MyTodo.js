import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { api, axios } from "boot/axios";
import qs from "qs";




export default defineStore("useTodo",{
    state:()=>({

        token:{
            create: null,
            list:null,
            update: null,
            remove: null,
            reset: null,
        },
        todoRouter:`/api/todo`,
        tasks:[],
        totalCount:0,
    }),
    getters:{
    },
    actions:{
        settasks(changetasks){
            tasks=changetasks;
        },
        async insert (payload) {
            try {
                if (this.token.create != null) {
                    this.token.create = this.token.create.cancel("create cancel");
                }
                this.token.create = axios.CancelToken.source();
                const result = await api.post(`${this.todoRouter}`, payload,{
                    cancelToken: this.token.create.token,
                });
                return result;
            } catch (error) {
                console.error({ err: error });
                return false;
            }
        },
        async list(payload){
            try {
                if (this.token.list != null) {
                    this.token.list = this.token.list.cancel("list cancel");
                }
                this.token.list = axios.CancelToken.source();
                const query = qs.stringify(payload);
                const result = await api.get(`${this.todoRouter}?${query}`, payload,{
                    cancelToken: this.token.list.token,
                });
                return result;
            } catch (error) {
                console.error({ err: error });
                return false;
            }
        },
        async update (payload){
            try {
                if (this.token.update != null) {
                    this.token.update = this.token.update.cancel("update cancel");
                }
                this.token.update = axios.CancelToken.source();
                const id = payload.seq;
                const result = api.put(`${this.todoRouter}/${id}`, payload,{
                    cancelToken: this.token.update.token,
                });
                return result;
            } catch (error) {
                console.error({ err: error });
                return false;
            }
        },
        async remove (payload){
            try {
                if (this.token.remove != null) {
                    this.token.remove = this.token.remove.cancel("remove cancel");
                }
                this.token.remove = axios.CancelToken.source();
                const id = payload.seq;
                const result = api.delete(`${this.todoRouter}/${id}`,{
                    cancelToken: this.token.remove.token,
                });
                return result;
            } catch (error) {
                console.error({ err: error });
                return false;
            }
        },
        async reset(payload){
            try {
                if (this.token.reset != null) {
                    this.token.reset = this.token.reset.cancel("reset cancel");
                }
                this.token.reset = axios.CancelToken.source();
                const result = await api.post(`${this.todoRouter}/reset`, payload,{
                    cancelToken: this.token.reset.token,
                });
                return result;
            } catch (error) {
                console.error({ err: error });
                return false;
            }
        }
    }
})
