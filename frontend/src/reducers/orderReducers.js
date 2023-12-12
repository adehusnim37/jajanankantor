import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_FAIL,
    ORDER_CREATE_SUCCESS,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_RESET,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_RESET,
    ORDER_LIST_FAIL,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_REQUEST,
    ORDER_DELIVERED_SUCCESS,
    ORDER_DELIVERED_FAIL,
    ORDER_DELIVERED_RESET,
    ORDER_DELIVERED_REQUEST,
    ORDER_DELETE_SUCCESS,
    ORDER_DELETE_REQUEST, ORDER_DELETE_FAIL,
    ORDER_UPDATEBANKCODE_REQUEST, ORDER_UPDATEBANKCODE_SUCCESS, ORDER_UPDATEBANKCODE_FAIL,
    WEBHOOK_VA_REQUEST, WEBHOOK_VA_SUCCESS, WEBHOOK_VA_FAIL,
    ORDER_CREATE_QRIS_REQUEST, ORDER_CREATE_QRIS_SUCCESS, ORDER_CREATE_QRIS_FAIL
} from "../constants/orderConstants";

export const orderCreateReducer = (state = {}, action) => {
    switch(action.type) {
        case ORDER_CREATE_REQUEST:
            return { loading: true }
        case ORDER_CREATE_SUCCESS:
            return { loading: false, success: true, order: action.payload }
        case ORDER_CREATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const orderDetailsReducer = (state = { loading: true, orderItems : [], shippingAddress: {}, telpon:{} }, action) => {
    switch(action.type) {
        case ORDER_DETAILS_REQUEST:
            return { ...state, loading: true }
        case ORDER_DETAILS_SUCCESS:
            return { loading: false, order: action.payload }
        case ORDER_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const orderPayReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_PAY_REQUEST:
            return {
                loading: true,
            }
        case ORDER_PAY_SUCCESS:
            return {
                loading: false,
                success: true,
            }
        case ORDER_PAY_FAIL:
            return {
                loading: false,
                error: action.payload,
            }
        case ORDER_PAY_RESET:
            return {}
        default:
            return state
    }
}


export const orderListMyReducer = (state = {orders: []}, action) => {
    switch (action.type) {
        case ORDER_LIST_MY_REQUEST:
            return {
                loading: true,
            }
        case ORDER_LIST_MY_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            }
        case ORDER_LIST_MY_FAIL:
            return {
                loading: false,
                error: action.payload,
            }
        case ORDER_LIST_MY_RESET:
            return {
                orders: []
            }
        default:
            return state
    }
}

export const orderListReducer = (state = {orders: []}, action) => {
    switch (action.type) {
        case ORDER_LIST_REQUEST:
            return {
                loading: true,
            }
        case ORDER_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
            }
        case ORDER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}

export const orderDeliveredReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_DELIVERED_REQUEST:
            return {
                loading: true,
            }
        case ORDER_DELIVERED_SUCCESS:
            return {
                loading: false,
                success: true,
            }
        case ORDER_DELIVERED_FAIL:
            return {
                loading: false,
                error: action.payload,
            }
        case ORDER_DELIVERED_RESET:
            return {}
        default:
            return state
    }
}

export const orderCancelledReducer = (state = {}, action) => {
    switch (action.type){
        case ORDER_DELETE_REQUEST:
            return { loading: true }
        case ORDER_DELETE_SUCCESS:
            return {loading: false, success: true}
        case ORDER_DELETE_FAIL:
            return { loading: false, error: action.payload}
        default:
            return state
    }
}

export const orderUpdateBankCodeReducer = (state = {}, action) => {
    switch (action.type){
        case ORDER_UPDATEBANKCODE_REQUEST:
            return { loading: true }
        case ORDER_UPDATEBANKCODE_SUCCESS:
            return {loading: false, success: true}
        case ORDER_UPDATEBANKCODE_FAIL:
            return { loading: false, error: action.payload}
        default:
            return state
    }
}

export const orderUpdateQrisReducer = (state = {}, action) => {
    switch (action.type){
        case ORDER_CREATE_QRIS_REQUEST:
            return { loading: true }
        case ORDER_CREATE_QRIS_SUCCESS:
            return {loading: false, success: true}
        case ORDER_CREATE_QRIS_FAIL:
            return { loading: false, error: action.payload}
        default:
            return state
    }
}

export const webhookReducer = (state = {}, action) => {
   switch (action.type){
         case WEBHOOK_VA_REQUEST:
              return { loading: true }
         case WEBHOOK_VA_SUCCESS:
              return {loading: false, success: true}
         case WEBHOOK_VA_FAIL:
              return { loading: false, error: action.payload}
         default:
              return state
   }
}
