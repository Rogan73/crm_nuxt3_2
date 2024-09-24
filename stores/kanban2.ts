import { defineStore } from "pinia"
import { ref } from "vue"
import type { Board, Kanban2State,Column,Task } from '@/types/kanban2types'

export const useKanbanStore = defineStore("kanban2", () => {

    const state = ref<Kanban2State>({
         title: '',
            boards: [],
            isLoading: false,
            error: null,
            selected_board_row: 0,
            selected_boardId: '1',
            showTask: false,
            selected_task: {
                id: 0,
                state:1, // 1 to do  2 in progress 3 done
                id_board: 1,
                id_column: 1,
                isOpen: false,
                name: '',
                description: '',
                id_person: 1,
                order_index: 0
            },
            new_task:false
        })
   

    return{
        state
    }
})